/***
 * 联系人相关表单数据校验规则rules
 */

// 添加好友校验规则
const createContactRules = {
  reciver_id: [{
    type: 'string',
    required: true,
    message: {
      text: '好友id必须',
      code: 300001001
    },
  }],
}

// 删除联系人校验规则
const deleteContactRules = {
  id: [{
    type: 'string',
    required: true,
    message: {
      text: 'id必须',
      code: 300001004
    },
  }],
}

// 联系人资料设置校验规则
const setInfoRules = {
  id: [{
    type: 'string',
    required: true,
    message: {
      text: 'id必须',
      code: 300001005
    },
  }],
  user_id: [{
    type: 'string',
    required: true,
    message: {
      text: '用户id必须',
      code: 300001006
    },
  }],
}


const contactRules = {
  createContactRules,
  deleteContactRules,
  setInfoRules,
}

module.exports = contactRules
