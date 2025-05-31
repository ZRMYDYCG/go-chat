const chatService = require("../service/chat");
const { successResponse, failResponse } = require("../utils/common");

class ChatController {
  /**
   * 添加聊天
   * @param {*} context
   */
  create = async (context) => {
    const { reciver_id, type = 0 } = context.request.body;

    const { id: user_id } = context.state.user;

    const data = {
      user_id,
      reciver_id: reciver_id ?　String(reciver_id) : reciver_id,
      type: String(type),
    };

    const res = await chatService.createChat(data);

    context.body = res
      ? successResponse("添加聊天成功！")
      : failResponse("添加聊天失败！");
  };

  /**
   * 获取聊天列表
   * @param {*} context
   */
  list = async (context) => {
    const { keywords = "", type = null, page = 1, limit = 10 } = context.query;
    const { id: user_id } = context.state.user;
    const data = {
      user_id,
      keywords,
      type,
      page: Number(page),
      limit: Number(limit),
    };
    const res = await chatService.getChatList(data);

    context.body = res
      ? successResponse("获取聊天列表成功！", res)
      : failResponse("获取聊天列表失败！");
  };

  /**
   * 操作-删除聊天
   * @param {*} context
   */
  delete = async (context) => {
    const { chat_id, reciver_id } = context.query;
    const { id: user_id } = context.state.user;
    const data = {
      chat_id,
      reciver_id,
      user_id,
    };
    const res = await chatService.deleteChat(data);

    context.body = res
      ? successResponse("删除聊天成功！")
      : failResponse("删除聊天失败！");
  };
}

module.exports = new ChatController();
