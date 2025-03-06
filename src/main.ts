import App from '@/App.vue'
import { registerPlugins } from '@/plugins'
import { registerRouter } from '@/router'
import { registerStore } from '@/store'
// import 'element-plus/theme-chalk/dark/css-vars.css'
import { createApp } from 'vue'
import './css/app.css'
// import './css/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './css/main.css'

import mock from './mock'

mock(false)

function bootstrap() {
  const app = createApp(App)
  registerStore(app)
  registerRouter(app)
  registerPlugins(app)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.mount('#app')
}

bootstrap()
