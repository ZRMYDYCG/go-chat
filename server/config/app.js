const {
  APP_PORT,
  DB_HOST
} = process.env

const app = {
  APP_PORT,
  DB_HOST,
  JWT_SECRET: 'GC_Course$10'
}

module.exports = app