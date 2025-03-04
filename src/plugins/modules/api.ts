import api from '@/api'
import * as HTTP from '@/settings/config/http'
import type { App } from 'vue'

const apiPlugin = {
  install(app: App): void {
    app.config.globalProperties.$api = api
    app.provide('$api', api)

    app.config.globalProperties.$HTTP = HTTP
    app.provide('$HTTP', HTTP)

    app.config.globalProperties.$HTTP_CODE = HTTP.HTTP_CODE
    app.provide('$HTTP_CODE', HTTP.HTTP_CODE)
  },
}
export default apiPlugin
