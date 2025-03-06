import * as common from '@/utils/helper/common'
import * as data from '@/utils/helper/data'
import * as is from '@/utils/helper/is'
import type { App } from 'vue'

const utilsPlugin = {
  install(app: App) {
    // common
    app.config.globalProperties.$common = common
    app.provide('$common', common)

    // is
    app.config.globalProperties.$is = is
    app.provide('$is', is)

    // data
    app.config.globalProperties.$dataHelpers = data
    app.provide('$dataHelpers', data)
  },
}

export default utilsPlugin
