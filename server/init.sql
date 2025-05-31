/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50562
Source Host           : localhost:3306
Source Database       : go_chat

Target Server Type    : MYSQL
Target Server Version : 50562
File Encoding         : 65001

Date: 2024-11-07 09:04:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `gc_chat`
-- ----------------------------
DROP TABLE IF EXISTS `gc_chat`;
CREATE TABLE `gc_chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `reciver_id` int(11) NOT NULL COMMENT '接收用户或群id',
  `type` enum('0','1') NOT NULL DEFAULT '0' COMMENT '聊天类型（01v1 1群聊）',
  `created_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gc_chat
-- ----------------------------

-- ----------------------------
-- Table structure for `gc_contact`
-- ----------------------------
DROP TABLE IF EXISTS `gc_contact`;
CREATE TABLE `gc_contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `reciver_id` int(11) NOT NULL COMMENT '联系人或群id',
  `remark` char(50) DEFAULT NULL COMMENT '联系人备注名',
  `desc` char(150) DEFAULT NULL COMMENT '联系人描述信息',
  `created_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gc_contact
-- ----------------------------

-- ----------------------------
-- Table structure for `gc_message`
-- ----------------------------
DROP TABLE IF EXISTS `gc_message`;
CREATE TABLE `gc_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `reciver_id` int(11) NOT NULL COMMENT '接收用户或群id',
  `content` text NOT NULL COMMENT '消息内容',
  `type` enum('0','1','2','3') NOT NULL DEFAULT '0' COMMENT '消息类型（0文本 1图片 2语音 3视频）',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  `created_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gc_message
-- ----------------------------

-- ----------------------------
-- Table structure for `gc_message_delete`
-- ----------------------------
DROP TABLE IF EXISTS `gc_message_delete`;
CREATE TABLE `gc_message_delete` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) NOT NULL COMMENT '聊天消息id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `is_delete` enum('0','1') NOT NULL DEFAULT '0' COMMENT '是否删除（0正常 1软删除）',
  `delete_time` datetime NOT NULL COMMENT '删除时间',
  `created_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gc_message_delete
-- ----------------------------

-- ----------------------------
-- Table structure for `gc_message_read`
-- ----------------------------
DROP TABLE IF EXISTS `gc_message_read`;
CREATE TABLE `gc_message_read` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) NOT NULL COMMENT '聊天消息id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  `created_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gc_message_read
-- ----------------------------

-- ----------------------------
-- Table structure for `gc_user`
-- ----------------------------
DROP TABLE IF EXISTS `gc_user`;
CREATE TABLE `gc_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` char(50) NOT NULL COMMENT '账号',
  `password` char(64) NOT NULL COMMENT '密码',
  `salt` char(100) NOT NULL COMMENT '密码盐',
  `avatar` char(255) DEFAULT NULL COMMENT '用户头像',
  `nickname` char(30) DEFAULT NULL COMMENT '名称（昵称）',
  `sex` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '待办完成状态（0女 1男 2未知）',
  `birthday` date NOT NULL COMMENT '生日',
  `status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '账号状态（0正常 1已冻结）',
  `is_delete` enum('0','1') NOT NULL DEFAULT '0' COMMENT '是否删除（0正常 1软删除）',
  `created_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gc_user
-- ----------------------------
INSERT INTO `gc_user` VALUES ('1', 'chat_6666', '$2b$10$oipF0MErMFMbjtk4MgNH2O5X2aAyvn5NDYA9xUnhZ9eSRGdfl2Bri', '$2b$10$oip', '/upload/avatar/_W-I5camAjSIMXEg8_0rJcGW31t1dxN7snrSpvDNbJQ.jpg', '唐三藏', '0', '2024-10-07', '0', '0', '2024-10-07 17:48:36', '2024-10-07 17:48:36');
INSERT INTO `gc_user` VALUES ('2', 'chat_5555', '$2b$10$/7QUexGWhp9hR4bo1slsReNwXsZgHS5csFOt7e98jJlNEz49cO0kC', '$2b$10$/7Q', '/upload/avatar/ATCvEupT4mf6aVM244AyMR9yhCic7uQK4zMlboWqvk0.jpg', null, '0', '2024-10-07', '0', '0', '2024-10-07 17:48:42', '2024-10-07 17:48:42');
INSERT INTO `gc_user` VALUES ('3', 'chat_4444', '$2b$10$rjEt74qcVRa8SGMGYamVuu7IrZbmHpugGJ7uD5PCm7lXHgSe9rY9S', '$2b$10$rjE', '/upload/avatar/hyXg68FDYLRVi29OP2kDqhWh-zX_ihWi_DSSHlP4GiI.jpg', '白龙马', '0', '2024-10-07', '0', '0', '2024-10-07 17:48:45', '2024-10-07 17:48:45');
INSERT INTO `gc_user` VALUES ('4', 'chat_3333', '$2b$10$0nludai3vprGUmP8d0zEk.IofXzli6n8fo2AdgxeSRjCvjxj8vWH6', '$2b$10$0nl', '/upload/avatar/IzUpQGGzP8m9Ekn6ht3L8lBkeHe_iB_9HPy4-Qwufyo.jpg', '沙悟净', '0', '2024-10-07', '0', '0', '2024-10-07 17:48:51', '2024-10-07 17:48:51');
INSERT INTO `gc_user` VALUES ('5', 'chat_2222', '$2b$10$rKoH2y8EA57VPhzCHrLLxe/FqL0fx9AlLRKcpjF2RUbC1q.4czXQS', '$2b$10$rKo', '/upload/avatar/KJLFvLdFOF_htMTjjxTt-JEovGOAPCIl2p2eBPetKuQ.jpg', '猪悟能', '0', '2024-10-07', '0', '0', '2024-10-07 17:48:55', '2024-10-07 17:48:55');
INSERT INTO `gc_user` VALUES ('6', 'chat_1111', '$2b$10$jC0REAld8qDo/kfF4TOkI.IUDv41c8HOvVhPYHyCB8HSdhvIF2OQy', '$2b$10$jC0', '/upload/avatar/o4EA0jGx7AwD7D5-ucGi474kmn2fHAuAKU_Ouog8sT4.jpg', '孙悟空', '0', '2024-10-07', '0', '0', '2024-10-07 17:49:00', '2024-10-07 17:49:00');

\! touch /var/lib/mysql/.initialized
