/**
 * 通用方法
 */
const Schema = require("async-validator");

// 表单数据校验
async function validateFormData(data, rules) {
  const validator = new Schema.default(rules);

  return await validator
    .validate(data)
    .then(() => {
      return {
        data,
        error: null,
        message: null,
      };
    })
    .catch(({ errors }) => {
      return {
        data: null,
        errors,
        message: errors[0].message,
      };
    });
}

// 成功返回
function successResponse(message = "success", data = null, code = 200) {
  return {
    code,
    data,
    message,
  };
}

// 失败返回
function failResponse(message = "fail", data = null, code = 0) {
  return {
    code,
    data,
    message,
  };
}

// 对象扁平化
function flatObject(obj, autoPrefix = true, prefix = "", noPrefixAttrs = []) {
  let flatObj = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (Object.prototype.toString.call(val) === "[object Object]") {
      flatObj = {
        ...flatObj,
        ...flatObject(val, autoPrefix, autoPrefix ? key : '', noPrefixAttrs),
      };
    } else {
      if (autoPrefix && !noPrefixAttrs.includes(key)) {
        prefix = prefix ? prefix + "_" : "";
        flatObj[`${prefix}${key}`] = val;
      } else {
        flatObj[key] = val;
      }
    }
  });

  return flatObj;
}

const commonUtils = {
  validateFormData,
  successResponse,
  failResponse,
  flatObject,
};

module.exports = commonUtils;
