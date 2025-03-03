import App from '@/App.vue'
import { registerRouter } from '@/router'
import { registerStore } from '@/store'
import { createApp } from 'vue'
import './main.css'

function bootstrap() {
  const app = createApp(App)
  registerStore(app)
  registerRouter(app)

  app.mount('#app')
}

bootstrap()
