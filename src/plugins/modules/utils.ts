import * as common from '@/utils/helper/common'
import * as data from '@/utils/helper/data'
import * as is from '@/utils/helper/is'

const utilsPlugin = {
  install(app) {
    // common
    app.config.globalProperties.$common = common
    app.provide('$common', common)

    // is
    app.config.globalProperties.$is = is
    app.provide('$is', is)

    // date
    app.config.globalProperties.$date = data
    app.provide('$data', data)
  },
}

export default utilsPlugin
