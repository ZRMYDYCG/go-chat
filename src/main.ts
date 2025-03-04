import App from '@/App.vue'
import { registerPlugins } from '@/plugins'
import { registerRouter } from '@/router'
import { registerStore } from '@/store'
import { createApp } from 'vue'
import './css/app.css'
import './css/main.css'
import mock from './mock'

mock(true)

function bootstrap() {
  const app = createApp(App)
  registerStore(app)
  registerRouter(app)
  registerPlugins(app)

  app.mount('#app')
}

bootstrap()
