import * as data from '@/utils/helper/data'
import * as is from '@/utils/helper/is'

const utilsPlugin = {
  install(app) {
    // is
    app.config.globalProperties.$is = is
    app.provide('$is', is)

    // date
    app.config.globalProperties.$date = data
    app.provide('$data', data)
  },
}

export default utilsPlugin
