const userService = require('../service/user')
const { successResponse, failResponse } = require('../utils/common')
const { DEFAULT_AVATERS } = require('../config/user')
const { sample } = require('lodash')

class UserController {
  /**
   * 注册用户
   * @param {*} context 
   */
  register = async (context) => {
    const { account, password } = context.request.body

    console.log(account, password)

    const data = {
      avatar: `${sample(DEFAULT_AVATERS)}`,
      account,
      password
    }

    const res = await userService.createUser(data)

    context.body = res
    ? successResponse('注册成功！')
    : failResponse('注册失败！')
  }

  /**
   * 登录
   * @param {*} context 
   */
  login = async (context) => {
    const { account, password } = context.request.body
    const data = {
      account,
      password
    }
    console.log(data)
    const res = await userService.login(data)

    context.body = res
    ? successResponse('登录成功！', res)
    : failResponse('登录失败！')
  }

  /**
   * 上传图像文件
   * @param {*} data 
   * @returns 
   */
  uploadAvater = async (context) => {
    const { file } = context.request.files
    const { id: user_id } = context.state.user;
    const data = {
      user_id,
      file,
    }
    const res = await userService.uploadAvater(data)

    context.body = res
    ? successResponse('上传图像成功！', res)
    : failResponse('上传图像失败！')
  }

  /**
   * 更新用户信息
   * @param {*} context
   */
  updateInfo = async (context) => {
    const { sex, birthday } = context.request.body;

    const { id: user_id } = context.state.user;

    const data = {
      user_id,
      sex,
      birthday,
    };

    const res = await userService.updateInfo(data);

    context.body = res
      ? successResponse("更新用户信息成功！")
      : failResponse("更新用户信息失败！");
  };

  /**
   * 搜索用户列表
   * @param {*} context
   */
  searchUser = async (context) => {
    const { account, page = 1, limit = 10 } = context.query;
    const data = {
      account,
      page: Number(page),
      limit: Number(limit),
    };
    const res = await userService.searchUser(data);

    context.body = res
      ? successResponse("获取用户列表成功！", res)
      : failResponse("获取用户列表失败！");
  };
}

module.exports = new UserController()
