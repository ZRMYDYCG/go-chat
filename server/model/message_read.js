/**
 * 聊天消息阅读状态表
 */
const { Model, DataTypes } = require("sequelize");
const db = require("../db");
const moment = require("moment");

class MessageRead extends Model {}

MessageRead.init(
  {
    message_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "聊天消息id",
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "用户id",
    },
    read_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "阅读时间",
      get() {
        const rawValue = this.getDataValue("read_time");
        return rawValue ? moment(rawValue).format("YYYY-MM-DD HH:mm") : null;
      },
    },
  },
  {
    sequelize: db,
    // 模型默认名
    modelName: "message_read",
    // 显式指定表名为`message_read`
    tableName: "message_read",
    createdAt: "created_time",
    updatedAt: "update_time",
  }
);

// MessageRead.sync({ force: true })
module.exports = MessageRead;
