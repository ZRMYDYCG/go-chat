const app = require('./app')
const appConfig = require('./config/app')

const {
  APP_PORT,
} = appConfig

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
