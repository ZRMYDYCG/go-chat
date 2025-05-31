/**
 * 用户表
 */
const { DataTypes } = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  account: {
    type: DataTypes.CHAR(50),
    unique: true,
    allowNull: false,
    comment: '账号',
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码',
  },
  salt: {
    type: DataTypes.CHAR(100),
    allowNull: false,
    comment: '密码盐',
  },
  avatar: {
    type: DataTypes.CHAR(255),
    allowNull: true,
    comment: '用户头像',
  },
  nickname: {
    type: DataTypes.CHAR(30),
    allowNull: true,
    comment: '名称（昵称）',
  },
  sex: {
    type: DataTypes.ENUM,
    values: ['0', '1', '2'],
    allowNull: false,
    defaultValue: '0',
    comment: '待办完成状态（0女 1男 2未知）',
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '生日',
  },
  status: {
    type: DataTypes.ENUM,
    values: ['0', '1'],
    allowNull: false,
    defaultValue: '0',
    comment: '账号状态（0正常 1已冻结）',
  },
  is_delete: {
    type: DataTypes.ENUM,
    values: ['0', '1'],
    allowNull: false,
    defaultValue: '0',
    comment: '是否删除（0正常 1软删除）',
  },
}, {
  // 显式指定表名为`user`
  tableName: 'user',
  createdAt: 'created_time',
  updatedAt: 'update_time',
})

// User.sync({ force: true })
module.exports = User