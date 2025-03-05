import { HTTP_TIMEOUT } from '@/settings/config/http'
import { useUserStore } from '@/store/modules/user'
import axios from 'axios'

// 创建http axios实例
const http = axios.create({
  // baseURL: HTTP_HOST,
  timeout: HTTP_TIMEOUT,
})

// 请求拦截
http.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    config.headers.Authorization = userStore.token
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 响应拦截
http.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default http
