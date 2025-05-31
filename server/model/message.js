/**
 * 聊天消息表
 */
const { Model, DataTypes } = require("sequelize");
const db = require("../db");
const moment = require("moment");
class Message extends Model {}

Message.init(
  {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "用户id",
    },
    reciver_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "接收用户或群id",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "消息内容",
    },
    type: {
      type: DataTypes.ENUM,
      values: ["0", "1", "2", "3"],
      allowNull: false,
      defaultValue: "0",
      comment: "消息类型（0文本 1图片 2语音 3视频）",
    },
    send_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "发送时间",
      get() {
        const rawValue = this.getDataValue("send_time");
        return rawValue ? moment(rawValue).format("YYYY-MM-DD HH:mm") : null;
      },
    },
  },
  {
    sequelize: db,
    // 模型默认名
    modelName: "message",
    // 显式指定表名为`message`
    tableName: "message",
    createdAt: "created_time",
    updatedAt: "update_time",
  }
);

// Message.sync({ force: true })
module.exports = Message;
