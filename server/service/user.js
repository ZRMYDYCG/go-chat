const { validateFormData } = require("../utils/common");
const {
  createUserRules,
  userLoginRules,
  uploadAvaterRules,
  updateInfoRules,
  searchUserRules,
} = require("../validate/user");
const { ValidateError, DataError } = require("../middleware/errorHandler");
const UserModel = require("../model/user");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/app");
const path = require("path");
const process = require("process");
const fs = require("fs");
const moment = require("moment");

class User {
  /**
   * 创建用户账号
   * @param {*} user
   * @returns
   */
  createUser = async (user) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(user, createUserRules);

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    // 生成密码加密salt盐值
    const salt = bcrypt.genSaltSync(10);
    user.salt = salt;
    user.password = bcrypt.hashSync(user.password, salt);
    user.birthday = moment(new Date()).format("YYYY-MM-DD");


    const res = await UserModel.create(user).catch((err) => {
      console.log(err);
    });

    return res;
  };

  /**
   * 用户登录
   * @param {*} user
   * @returns
   */
  login = async (user) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(user, userLoginRules);

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    // 使用account查询数据库对应账号信息
    const userRecord = await UserModel.findOne({
      where: { account: user.account },
    });
    if (!userRecord) {
      const message = "账号不存在";
      const error = new DataError(message);
      error.payload = {
        code: 100002003,
        text: message,
      };
      throw error;
    }

    const { id, account, password, avatar, sex, birthday, nickname } = userRecord;

    // 对用户输入密码进行加密转换后与数据库记录比较是否一致
    const matched = bcrypt.compareSync(user.password, password);
    if (!matched) {
      const message = "账号或密码错误";
      const error = new DataError(message);
      error.payload = {
        code: 100002004,
        text: message,
      };
      throw error;
    }

    // 生成token
    const info = {
      id,
      account,
      avatar,
      sex,
      birthday,
      nickname,
    };
    const token = sign(info, JWT_SECRET, { expiresIn: "1d" });

    const loginRes = {
      token,
      info,
    };
    return loginRes;
  };

  /**
   * 上传头像文件
   * @param {*} data
   * @returns
   */
  uploadAvater = async (data) => {
    const { user_id, file } = data;
    // 表单数据格式校验
    const { errors, message } = await validateFormData(data, uploadAvaterRules);

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      // 清除不合理文件
      fs.promises
        .unlink(path.join(process.cwd(), `/upload/${file.newFilename}`))
        .catch(() => {});
      throw error;
    }

    // 保存文件
    try {
      await fs.promises.mkdir(path.join(process.cwd(), "/upload/avatar"), {
        recursive: true,
      });
    } catch (error) {
      throw new Error("上传头像失败！");
    }
    const uploadDir = path.join(process.cwd(), "/upload/avatar");
    const targetPath = path.join(uploadDir, file.newFilename);
    fs.renameSync(file.filepath, targetPath);

    const avaterPath = `/upload/avatar/${file.newFilename}`;

    // 更新数据库信息
    const res = await UserModel.update(
      {
        avatar: avaterPath,
      },
      {
        where: {
          id: user_id,
          status: "0",
        },
      }
    );

    if (!res[0]) {
      // 清除文件
      fs.promises.unlink(path.join(process.cwd(), avaterPath)).catch(() => {});

      throw new Error("更新头像信息失败！");
    }

    return avaterPath;
  };

  /**
   * 更新用户信息
   * @param {*} info
   * @returns
   */
  updateInfo = async (info) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(info, updateInfoRules);

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    const { user_id } = info;

    const res = await UserModel.update(info, {
      where: {
        id: user_id,
        status: "0",
        is_delete: "0",
      },
    });

    return res[0];
  };

  /**
   * 搜索用户列表
   * @param {*} data
   * @returns
   */
  searchUser = async (data) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(data, searchUserRules);

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    const { account, page, limit } = data;

    // 查询条件组装
    const where = {
      account,
      status: "0",
      is_delete: "0",
    };

    const res = await UserModel.findAndCountAll({
      where,
      attributes: ["id", "account", "nickname", "avatar"],
      offset: (page - 1) * limit,
      limit,
    });

    if (res?.rows) {
      res.rows = res.rows.map((user) => {
        if (["", null].includes(user.nickname)) {
          user.nickname = user.account;
        }

        return user;
      });
    }

    return res;
  };
}

module.exports = new User();
