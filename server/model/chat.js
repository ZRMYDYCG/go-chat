/**
 * 聊天表
 */
const { Model, DataTypes } = require("sequelize");
const db = require("../db");

class Chat extends Model {}

Chat.init(
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
    type: {
      type: DataTypes.ENUM,
      values: ["0", "1"],
      allowNull: false,
      defaultValue: "0",
      comment: "聊天类型（0: 1v1、1群聊）",
    },
  },
  {
    sequelize: db,
    // 模型默认名
    modelName: "chat",
    // 显式指定表名为`chat`
    tableName: "chat",
    createdAt: "created_time",
    updatedAt: "update_time",
  }
);

// Chat.sync({ force: true })
module.exports = Chat;
