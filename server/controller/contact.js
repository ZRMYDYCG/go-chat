const contactService = require("../service/contact");
const { successResponse, failResponse } = require("../utils/common");

class ContactController {
  /**
   * 添加好友
   * @param {*} context
   */
  create = async (context) => {
    const { reciver_id } = context.request.body;

    const { id: user_id } = context.state.user;

    const data = {
      user_id,
      reciver_id: String(reciver_id),
    };

    const res = await contactService.createContact(data);

    context.body = res
      ? successResponse("添加好友成功！")
      : failResponse("添加好友失败！");
  };

  /**
   * 获取联系人列表
   * @param {*} context
   */
  list = async (context) => {
    const { keywords = '', type = null, page = 1, limit = 10 } = context.query;
    const { id: user_id } = context.state.user;
    const data = {
      user_id,
      keywords,
      type,
      page: Number(page),
      limit: Number(limit),
    };
    const res = await contactService.getContactList(data);

    context.body = res
      ? successResponse("获取联系人列表成功！", res)
      : failResponse("获取联系人列表失败！");
  };

  /**
   * 操作-删除联系人
   * @param {*} context 
   */
  delete = async (context) => {
    const { id } = context.query;
    const { id: user_id } = context.state.user;
    const data = {
      id,
      user_id,
    };
    const res = await contactService.deleteContact(data);

    context.body = res
      ? successResponse("删除联系人成功！")
      : failResponse("删除联系人失败！");
  };

  /**
   * 联系人资料设置
   * @param {*} context
   */
  setInfo = async (context) => {
    const { id, remark, desc } = context.request.body;

    const { id: user_id } = context.state.user;

    const data = {
      id: String(id),
      user_id: String(user_id),
      remark,
      desc,
    };

    const res = await contactService.setInfo(data);

    context.body = res
      ? successResponse("联系人资料设置成功！")
      : failResponse("联系人资料设置失败！");
  };
}

module.exports = new ContactController();
