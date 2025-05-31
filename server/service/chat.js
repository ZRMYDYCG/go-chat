const { validateFormData, flatObject } = require("../utils/common");
const { createChatRules, deleteChatRules } = require("../validate/chat");
const { ValidateError, DataError } = require("../middleware/errorHandler");
const ChatModel = require("../model/chat");
const UserModel = require("../model/user");
const ContactModel = require("../model/contact");
const MessageModel = require("../model/message");
const MessageDelete = require("../model/message_delete");
const { Op } = require("sequelize");
const db = require("../db");

class Chat {
  /**
   * 添加聊天
   * @param {*} user
   * @returns
   */
  createChat = async (chat) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(chat, createChatRules);

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    // 检查是否已经有聊天
    const isInChat = await ChatModel.findOne({
      where: chat,
      attributes: ["id"],
    });

    if (isInChat !== null) {
      const message = "不可重复添加聊天";
      const error = new DataError(message);
      error.payload = {
        code: 400001002,
        text: message,
      };
      throw error;
    }

    const res = await ChatModel.create(chat);

    return res;
  };

  /**
   * 获取聊天列表
   * @param {*} data
   * @returns
   */
  getChatList = async (data) => {
    const { user_id, keywords, type, page, limit } = data;

    // 查询条件组装
    const where = {
      user_id,
    };

    // if (keywords) {
    //   where[Op.or] = [
    //     {
    //       title: {
    //         [Op.like]: `%${keywords}%`,
    //       },
    //     },
    //     {
    //       content: {
    //         [Op.like]: `%${keywords}%`,
    //       },
    //     },
    //   ];
    // }

    if (type) {
      where.type = type;
    }

    ChatModel.belongsTo(UserModel, {
      foreignKey: "reciver_id",
      targetKey: "id",
    });

    ChatModel.belongsTo(ContactModel, {
      foreignKey: "reciver_id",
      targetKey: "reciver_id",
    });

    const res = await ChatModel.findAndCountAll({
      where,
      attributes: ["id", "user_id", "reciver_id", "type", "created_time"],
      include: [
        {
          model: UserModel,
          // 使用别名区分字段
          attributes: ["account", "nickname", "avatar"],
        },
        {
          model: ContactModel,
          where: {
            user_id,
          },
          attributes: ["remark"],
        },
      ],
      order: [["id", "DESC"]],
      offset: (page - 1) * limit,
      limit,
    });

    res.rows = res.rows.map((chat) => chat.get({ plain: true }));

    if (res?.rows) {
      res.rows = await Promise.all(
        res.rows.map(async (chat) => {
          const { reciver_id } = chat;

          // 查询用户已删除与reciver用户的消息
          const deleteMessageList = await MessageDelete.findAll({
            where: {
              user_id,
            },
            attributes: ["message_id"],
            raw: true,
          });
          const deleteMessageIds = deleteMessageList.map(
            (message) => message.message_id
          );

          chat.message = await MessageModel.findOne({
            raw: true,
            where: {
              id: {
                [Op.notIn]: deleteMessageIds,
              },
              [Op.or]: [
                {
                  user_id,
                  reciver_id,
                },
                {
                  user_id: reciver_id,
                  reciver_id: user_id,
                },
              ],
            },
            attributes: [["content", "last_message"]],
            order: [["id", "DESC"]],
          });

          return flatObject(chat, true, "", [
            "account",
            "nickname",
            "avatar",
            "remark",
            "last_message",
            "send_time",
          ]);
        })
      );

      // 生成聊天最终显示的remark
      res.rows = res.rows.map((chat) => {
        if (["", null].includes(chat.remark)) {
          if (chat.nickname) {
            chat.remark = chat.nickname;
          } else if (chat.account) {
            chat.remark = chat.account;
          }
        }

        delete chat.account;
        delete chat.nickname;

        return chat;
      });
    }

    return res;
  };

  /**
   * 删除聊天
   * @param {*} data
   * @returns
   */
  deleteChat = async (data) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(data, deleteChatRules);

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    const { chat_id, reciver_id, user_id } = data;

    let res;
    try {
      res = await db.transaction(async (t) => {
        // 记录删除的聊天记录消息状态
        // 此时可能聊天另一方还未删除聊天，需要展示消息
        // 查询已被删除过的消息，防止重复删除
        const deletedMessageList = await MessageDelete.findAll({
          where: {
            user_id
          },
          attributes: ["message_id"],
        })
        const deletedMessageIds = deletedMessageList.map((message) => message.message_id);

        const messageList = await MessageModel.findAll({
          where: {
            id: {
              [Op.notIn]: deletedMessageIds
            },
            [Op.or]: [
              {
                user_id,
                reciver_id,
              },
              {
                user_id: reciver_id,
                reciver_id: user_id,
              },
            ],
          },
          attributes: ["id"],
          raw: true,
        });
        const messageIds = messageList.map((message) => message.id);

        // 存储被删除信息记录数据
        if (messageIds.length) {
          const deleteMessageList = messageIds.map((message_id) => {
            return {
              message_id,
              user_id,
              delete_time: new Date(),
            };
          });
          await MessageDelete.bulkCreate(deleteMessageList, {
            transaction: t,
          });
        }

        // 删除聊天记录
        const result = await ChatModel.destroy(
          {
            force: true,
            where: {
              id: chat_id,
              user_id,
            },
          },
          { transaction: t }
        );

        return result;
      });
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
    }

    return res;
  };
}

module.exports = new Chat();
