import moment from 'moment'

/**
 * 数据处理工具汇总
 * * * formatDate 日期格式化
 * */

/**
 * 日期格式化字符串形式
 * @param timestamp 日期时间戳
 * @param format 模式
 * @returns 格式化时间String
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    return ''
  }

  return moment(date).format(format)
}
