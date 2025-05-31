const messageService = require("../service/message");
const { successResponse, failResponse } = require("../utils/common");

class MessageController {
  /**
   * 获取聊天消息列表
   * @param {*} context
   */
  list = async (context) => {
    const { reciver_id, keywords = '', type = null, status = null, page = 1, limit = 10 } = context.query;
    const { id: user_id } = context.state.user;
    const data = {
      reciver_id,
      user_id,
      keywords,
      type,
      status,
      page: Number(page),
      limit: Number(limit),
    };
    const res = await messageService.getMessageList(data);

    context.body = res
      ? successResponse("获取聊天消息列表成功！", res)
      : failResponse("获取聊天消息列表失败！");
  };

  /**
   * 操作-删除聊天消息
   * @param {*} context 
   */
  delete = async (context) => {
    const { id } = context.query;
    const { id: user_id } = context.state.user;
    const data = {
      id,
      user_id,
    };
    const res = await messageService.deleteMessage(data);

    context.body = res
      ? successResponse("删除聊天消息成功！")
      : failResponse("删除聊天消息失败！");
  };

  /**
   * 设置为已读
   * @param {*} context 
   */
  // read = async (context) => {
  //   const { id } = context.request.body;
  //   const { id: user_id } = context.state.user;
  //   const data = {
  //     id: String(id),
  //     user_id,
  //     status: "1",
  //     read_time: new Date(),
  //   };
  //   const res = await messageService.updateMessageRead(data);

  //   context.body = res
  //     ? successResponse("设置为已读成功！")
  //     : failResponse("设置为已读失败！");
  // };
}

module.exports = new MessageController();
