const path = require('path')
const dotenv = require('dotenv')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2));

dotenv.config({
  path: path.resolve(__dirname, '../.env')
})

dotenv.config({
  path: path.resolve(__dirname, `../.env.${argv.mode}`)
})
