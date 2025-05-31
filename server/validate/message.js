/***
 * 聊天消息相关表单数据校验规则rules
 */
//获取聊天消息列表校验规则
const getMessageListRules = {
  reciver_id: [{
    type: 'string',
    required: true,
    message: {
      text: '接收人id必须',
      code: 200001001
    },
  }],
}

// 删除聊天消息校验规则
const deleteMessageRules = {
  id: [{
    type: 'string',
    required: true,
    message: {
      text: '聊天消息id必须',
      code: 200002001
    },
  }],
}

// 操作聊天消息状态校验规则
const updateMessageReadRules = {
  id: [{
    type: 'string',
    required: true,
    message: {
      text: '聊天消息id必须',
      code: 200003001
    },
  }],
  status: [{
    type: 'string',
    required: true,
    message: {
      text: '聊天消息状态必须',
      code: 200003002
    },
  }],
}


const messageRules = {
  getMessageListRules,
  deleteMessageRules,
  updateMessageReadRules
}

module.exports = messageRules
