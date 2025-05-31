/**
 * 聊天消息删除情况表
 */
const { Model, DataTypes } = require("sequelize");
const db = require("../db");
const moment = require("moment");

class MessageDelete extends Model {}

MessageDelete.init(
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
    is_delete: {
      type: DataTypes.ENUM,
      values: ["0", "1"],
      allowNull: false,
      defaultValue: "0",
      comment: "是否删除（0正常 1软删除）",
    },
    delete_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "删除时间",
      get() {
        const rawValue = this.getDataValue("delete_time");
        return rawValue ? moment(rawValue).format("YYYY-MM-DD HH:mm") : null;
      },
    },
  },
  {
    sequelize: db,
    // 模型默认名
    modelName: "message_delete",
    // 显式指定表名为`message_delete`
    tableName: "message_delete",
    createdAt: "created_time",
    updatedAt: "update_time",
  }
);

// MessageDelete.sync({ force: true });
module.exports = MessageDelete;
