/***
 * 聊天相关表单数据校验规则rules
 */

// 添加聊天校验规则
const createChatRules = {
  reciver_id: [{
    type: 'string',
    required: true,
    message: {
      text: '好友id必须',
      code: 400001001
    },
  }],
}

// 删除聊天校验规则
const deleteChatRules = {
  chat_id: [{
    type: 'string',
    required: true,
    message: {
      text: '聊天id必须',
      code: 400002001
    },
  }],
  reciver_id: [{
    type: 'string',
    required: true,
    message: {
      text: '接收人id必须',
      code: 400002002
    },
  }],
  user_id: [{
    type: 'number',
    required: true,
    message: {
      text: '用户id必须',
      code: 400002003
    },
  }],
}

const chatRules = {
  createChatRules,
  deleteChatRules,
}

module.exports = chatRules
