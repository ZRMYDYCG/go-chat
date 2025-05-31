const { validateFormData, flatObject } = require("../utils/common");
const {
  createContactRules,
  deleteContactRules,
  setInfoRules,
} = require("../validate/contact");
const { ValidateError, DataError } = require("../middleware/errorHandler");
const ContactModel = require("../model/contact");
const UserModel = require("../model/user");
const { Op } = require("sequelize");
const db = require("../db");

class Contact {
  /**
   * 添加好友
   * @param {*} user
   * @returns
   */
  createContact = async (user) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(
      user,
      createContactRules
    );

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    // 检查是否添加自己为好友
    const isSelf = String(user.user_id) === String(user.reciver_id);
    if (isSelf) {
      const message = "不可添加自己为好友";
      const error = new DataError(message);
      error.payload = {
        code: 300001002,
        text: message,
      };
      throw error;
    }

    // 检查是否已经为好友
    const isFriend = await ContactModel.findOne({
      where: user,
      attributes: ["id"],
    });
    if (isFriend !== null) {
      const message = "不可重复添加为好友";
      const error = new DataError(message);
      error.payload = {
        code: 300001003,
        text: message,
      };
      throw error;
    }

    let res;
    try {
      res = await db.transaction(async (t) => {
        let result
        // 添加好友
        result = await ContactModel.create(user, { transaction: t });

        // 如果对方与当前用户不存在好友关系（可能以前两人为好友，但当前用户单边删除过好友），
        // 为对方也自动添加当前用户为联系人
        const reciver = {
          user_id: user.reciver_id,
          reciver_id: user.user_id,
        }
        const isFriend = await ContactModel.findOne({
          where: reciver,
          attributes: ["id"],
        });
        if (isFriend === null) {
          result = await ContactModel.create(
            reciver,
            { transaction: t }
          );
        }

        return result;
      });
    } catch (error) {
      // 如果执行到此,则发生错误.
      // 该事务已由 Sequelize 自动回滚！
    }

    return res;
  };

  /**
   * 获取联系人列表
   * @param {*} data
   * @returns
   */
  getContactList = async (data) => {
    const { user_id, keywords, type, page, limit } = data;

    // 查询条件组装
    const where = {
      user_id,
    };

    if (keywords) {
      where[Op.or] = [
        {
          remark: {
            [Op.like]: `%${keywords}%`,
          },
        },
      ];
    }

    if (type) {
      where.type = type;
    }

    ContactModel.belongsTo(UserModel, {
      foreignKey: "reciver_id",
      targetKey: "id",
    });

    const res = await ContactModel.findAndCountAll({
      where,
      attributes: ["id", "reciver_id", "remark", "desc"],
      include: [
        {
          model: UserModel,
          attributes: ["account", "nickname", "avatar"],
        },
      ],
      order: [["id", "DESC"]],
      offset: (page - 1) * limit,
      limit,
    });

    res.rows = res.rows.map((contact) => contact.get({ plain: true }));

    if (res?.rows) {
      res.rows = res.rows.map((contact) => {
        return flatObject(contact, true, "", [
          "account",
          "nickname",
          "avatar",
          "remark",
        ]);
      });

      // 生成聊天最终显示的remark
      res.rows = res.rows.map((contact) => {
        if (["", null].includes(contact.remark)) {
          if (contact.nickname) {
            contact.remark = contact.nickname;
          } else if (contact.account) {
            contact.remark = contact.account;
          }
        }

        return contact;
      });
    }

    return res;
  };

  /**
   * 删除联系人
   * @param {*} data
   * @returns
   */
  deleteContact = async (data) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(
      data,
      deleteContactRules
    );

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    const { id, user_id } = data;

    const res = await ContactModel.destroy({
      force: true,
      where: {
        id,
        user_id,
      },
    });

    return res;
  };

  /**
   * 联系人资料设置
   * @param {*} info
   * @returns
   */
  setInfo = async (info) => {
    // 表单数据格式校验
    const { errors, message } = await validateFormData(info, setInfoRules);

    if (errors) {
      const error = new ValidateError(message.text);
      error.payload = message;
      throw error;
    }

    const { id, user_id } = info;

    delete info.id,
    delete info.user_id

    const res = await ContactModel.update(
      info,
      {
        where: {
          id,
          user_id,
        },
      }
    );

    return res[0];
  };
}

module.exports = new Contact();
