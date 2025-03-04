import App from '@/App.vue'
import { registerRouter } from '@/router'
import { registerStore } from '@/store'
import { createApp } from 'vue'
import './css/app.css'
import './css/main.css'

function bootstrap() {
  const app = createApp(App)
  registerStore(app)
  registerRouter(app)

  app.mount('#app')
}

bootstrap()
