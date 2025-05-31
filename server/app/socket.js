const { Server } = require('socket.io')
const { verify } = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/app')
const ContactModel = require('../model/contact')
const ChatModel = require('../model/chat')
const MessageModel = require('../model/message')
const UserModel = require('../model/user')
const chatService = require('../service/chat')
const { Op, literal } = require('sequelize')
const { flatObject } = require('../utils/common')
const moment = require('moment')

// socket服务器
const io = new Server(3001, {
  // 跨域设置
  cors: {
    origin: '*',
  },
})

const socketUserMaps = new Map()

// 监听客户端连接事件
io.on('connection', (socket) => {
  const { auth } = socket.handshake
  const { token } = auth
  let user = null
  try {
    user = verify(token, JWT_SECRET)

    // 关联socket用户与网站用户信息
    socketUserMaps.set(socket.id, user)
  } catch (error) {}

  // client用户端发来消息
  socket.on('chat-1v1-to-server', async (message) => {
    const { reciver_id } = message
    const { id: user_id } = user

    // 1、判断两者是否好友关系
    const isFriend = await ContactModel.findOne({
      where: {
        [Op.and]: {
          user_id,
          reciver_id,
        },
        [Op.and]: {
          reciver_id: user_id,
          user_id: reciver_id,
        },
      },
      attributes: ['id'],
    })
    if (isFriend === null) {
      sendSocketMessageToTargetUser(user_id, () => {
        socket.emit('server:global-error-message', {
          message: '不能发送消息给非好友用户！',
        })
      })
      return false
    }

    // 2、判断是否有此聊天chat

    // 3、判断是否对方有聊天记录，没有则自动生成一条
    // 一般出现在初次加好友后首次给其发送消息
    const reciverChat = {
      reciver_id: String(user_id),
      user_id: reciver_id,
    }
    const hasChatHistory = await ChatModel.findOne({
      where: reciverChat,
      attributes: ['id'],
    })
    if (hasChatHistory === null) {
      chatService.createChat(reciverChat)

      sendSocketMessageToTargetUser(reciver_id, (socket) => {
        socket.emit('server:auto-create-chat', {
          message: '聊天时自动生成一次聊天记录',
        })
      })
    }

    // 4、写入消息数据局库表
    const { content, type } = message

    console.log('message', message)

    debugger
    const messageBaseInfo = {
      user_id,
      reciver_id,
      content,
      type,
      send_time: moment(new Date()).format('YYYY-MM-DD HH:mm'),
    }

    const messageRes = await MessageModel.create(messageBaseInfo, {
      raw: true,
    })
    const { id: message_id, send_time } = messageRes.toJSON()

    // 5、查询相关需要的用户信息组合完整的消息，为转发做准备
    UserModel.belongsTo(MessageModel, {
      foreignKey: 'id',
      targetKey: 'user_id',
    })

    let messageExtraInfo = await UserModel.findOne({
      where: {
        id: user_id,
      },
      attributes: ['avatar'],
      include: {
        model: MessageModel,
        modelName: 'message',
        where: {
          id: message_id,
        },
        attributes: [[literal("DATE_FORMAT(message.created_time, '%Y-%m-%d %H:%i:%s')"), 'created_time']],
      },
    })

    messageExtraInfo = messageExtraInfo.toJSON()
    messageExtraInfo = flatObject(messageExtraInfo, false)

    // 组合完整消息数据
    const messageFullInfo = {
      id: message_id,
      ...messageBaseInfo,
      ...messageExtraInfo,
      send_time,
      is_me: false,
    }

    // 6、如果reciver接收消息用户在线且存在socket登录记录信息中，
    // 进行socket实时转发到对应reciver接收消息用户
    sendSocketMessageToTargetUser(reciver_id, (socket) => {
      socket.emit('chat-1v1-to-client', messageFullInfo)
    })
  })

  // socket连接断开
  socket.on('disconnect', () => {
    // 清理socket用户
    socketUserMaps.delete(socket.id)
  })
})

// 为指定用户执行socket消息发送
async function sendSocketMessageToTargetUser(id, callback) {
  const sockets = await io.fetchSockets()

  sockets.forEach((socket) => {
    socketUserMaps.forEach((user, socketId) => {
      if (socket.id === socketId && id === user.id) {
        callback(socket, user, socketId)
      }
    })
  })
}

module.exports = io

module.exports.socketUserMaps = socketUserMaps
