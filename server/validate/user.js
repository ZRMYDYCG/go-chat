/***
 * 用户相关表单数据校验规则rules
 */

// 用户注册校验规则
const createUserRules = {
  account: [
    {
      type: "string",
      required: true,
      message: {
        text: "用户名或密码错误",
        code: 100001001,
      },
    },
    {
      type: "string",
      pattern: "^[0-9a-zA-Z_]{6,20}$",
      message: {
        text: "用户名格式错误",
        code: 100001002,
      },
    },
  ],
  password: {
    type: "string",
    required: true,
    message: {
      text: "用户名或密码错误",
      code: 100001003,
    },
  },
};

// 用户登录校验规则
const userLoginRules = {
  account: {
    type: "string",
    required: true,
    message: {
      text: "用户名或密码错误",
      code: 100002001,
    },
  },
  password: {
    type: "string",
    required: true,
    message: {
      text: "用户名或密码错误",
      code: 100002002,
    },
  },
};

// 用户图像上传校验规则
const uploadAvaterRules = {
  file: [
    {
      type: "object",
      required: true,
      message: {
        text: "图像必须",
        code: 100003001,
      },
    },
    {
      validator: (rule, value, callback) => {
        // 头像类型检测
        const allowFileTypes = ["image/jpeg", "image/png"];
        if (!allowFileTypes.includes(value.mimetype)) {
          callback({
            text: "图像格式需为jpg、png",
            code: 100003002,
          });
        }

        // 头像大小检测
        const allowFileSize = 500 * 1024;
        if (value.size > allowFileSize) {
          callback({
            text: `图片文件大小不超过${allowFileSize / 1024}kb`,
            code: 100003003,
          });
        }

        callback();
      },
    },
  ],
};

// 更新用户信息校验规则
const updateInfoRules = {
  sex: [{
    type: 'string',
    required: true,
    message: {
      text: '性别必须',
      code: 100004001
    },
  }],
  birthday: {
    type: 'string',
    required: true,
    message: {
      text: '生日必须',
      code: 100004002
    },
  },
}

// 搜索用户列表校验规则
const searchUserRules = {
  account: {
    type: "string",
    required: true,
    message: {
      text: "请输入账号名称",
      code: 100005001,
    },
  },
};

const userRules = {
  createUserRules,
  userLoginRules,
  uploadAvaterRules,
  updateInfoRules,
  searchUserRules,
};

module.exports = userRules;
