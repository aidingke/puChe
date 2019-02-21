var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_URL: process.env.API_URL,
    IMG_URL: process.env.IMG_URL,
    REPORT_URL: process.env.REPORT_URL
})
