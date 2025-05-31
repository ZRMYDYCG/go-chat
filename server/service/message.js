const { validateFormData, flatObject } = require("../utils/common");
const {
  getMessageListRules,
  deleteMessageRules,
  updateMessageReadRules,
} = require("../validate/message");
const { ValidateError } = require("../middleware/errorHandler");
const MessageModel = require("../model/message");
const MessageReadModel = require("../model/message_read");
const MessageDelete = require("../model/message_delete");
const UserModel = require("../model/user");
const { Op, literal } = require("sequelize");

class Message {
  /**
   * 获取聊天消息列表
   * @param {*} data
   * @returns
   */
  getMessageList = async (data) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(
      data,
      getMessageListRules
    );

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    const { user_id, reciver_id, keywords, type, status, page, limit } = data;

    // 查询条件组装
    const where = {
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
    };

    if (keywords) {
      where[Op.or] = [
        ...where[Op.or],
        {
          content: {
            [Op.like]: `%${keywords}%`,
          },
        },
      ];
    }

    if (type) {
      where.type = type;
    }

    // if (status) {
    //   where.status = status;
    // }

    // 查询用户已删除与reciver用户的消息
    const deleteMessageList = await MessageDelete.findAll({
      where: {
        user_id,
      },
      attributes: ["message_id"],
      raw: true,
    });
    const deleteMessageIds = deleteMessageList.map((message) => message.message_id);

    if (deleteMessageIds.length) {
      where.id = {
        [Op.notIn]: deleteMessageIds
      };
    }

    MessageModel.belongsTo(UserModel, {
      foreignKey: "user_id",
      targetKey: "id",
    });

    MessageModel.belongsTo(MessageReadModel, {
      foreignKey: "id",
      targetKey: "message_id",
    });

    const res = await MessageModel.findAndCountAll({
      modelName: "message",
      where,
      attributes: [
        "id",
        "content",
        "type",
        "send_time",
        [
          literal(
            `CASE WHEN message.user_id = ${user_id} THEN TRUE ELSE FALSE END`
          ),
          "is_me",
        ],
      ],
      include: [
        {
          model: UserModel,
          attributes: ["avatar"],
        },
        {
          model: MessageReadModel,
          attributes: [
            [
              literal(
                `CASE WHEN message_read.user_id = ${user_id} THEN 1 ELSE 0 END`
              ),
              "read",
            ], // 添加一个虚拟字段，表示消息是否已读
          ],
        },
      ],
      order: [["id", "DESC"]],
      offset: (page - 1) * limit,
      limit,
    });

    res.rows = res.rows.map((contact) => contact.get({ plain: true }));

    if (res?.rows) {
      res.rows = res.rows.map((message) => {
        message.is_me = Boolean(message.is_me);
        return flatObject(message, true, "", ["status", "avatar", "read"]);
      });

      res.rows = res.rows.reverse();
    }

    return res;
  };

  /**
   * 删除聊天消息
   * @param {*} data
   * @returns
   */
  deleteMessage = async (data) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(
      data,
      deleteMessageRules
    );

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    const { id, user_id } = data;

    const res = await MessageModel.update(
      {
        is_delete: "1",
      },
      {
        where: {
          id,
          user_id,
          is_delete: "0",
        },
      }
    );

    return res[0];
  };

  /**
   * 更改聊天消息阅读状态
   * @param {*} data
   * @returns
   */
  // updateMessageRead = async (data) => {
  //   // 表单数据格式校验
  //   const { errors, message } = await validateFormData(
  //     data,
  //     updateMessageReadRules
  //   );

  //   if (errors) {
  //     const error = new ValidateError(message.text);
  //     error.payload = message;
  //     throw error;
  //   }

  //   const { id, user_id, status, read_time } = data;

  //   const res = await MessageModel.update(
  //     {
  //       status,
  //       read_time,
  //     },
  //     {
  //       where: {
  //         id,
  //         user_id,
  //         status: "0",
  //         is_delete: "0",
  //       },
  //     }
  //   );

  //   return res[0];
  // };
}

module.exports = new Message();
