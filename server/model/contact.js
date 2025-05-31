/**
 * 联系人表
 */
const { DataTypes } = require('sequelize')
const db = require('../db')

const Contact = db.define('contact', {
  user_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '用户id',
  },
  reciver_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '联系人或群id',
  },
  remark: {
    type: DataTypes.CHAR(50),
    allowNull: true,
    comment: '联系人备注名',
  },
  desc: {
    type: DataTypes.CHAR(150),
    allowNull: true,
    comment: '联系人描述信息',
  }
}, {
  // 显式指定表名为`contact`
  tableName: 'contact',
  createdAt: 'created_time',
  updatedAt: 'update_time',
})

// Contact.sync({ force: true })
module.exports = Contact