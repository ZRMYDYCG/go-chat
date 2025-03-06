import { HTTP_HOST } from '@/settings/config/http'

/**
 * 非处理数据的功能性工具汇总
 * * * formatServerFilePath 补全完善后的服务器文件访问路径
 * */
export const formatServerFilePath = (src) => {
  if (!src) {
    return ''
  }
  return /^https*:\/\//.test(src) ? src : `${HTTP_HOST}${src}`
}
