/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1680783633707_5340'

  // add your middleware config here
  config.middleware = []
  //mysql
  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'cost_record'
    },
    app: true,
    agent: false
  }
  config.multipart = {
    // egg 提供两种文件接收模式，1 是 file 直接读取，2 是 stream 流的方式
    mode: 'file'
  }
  // csrf
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  }
  config.jwt = {
    secret: 'yxp2918'
  }
  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload'
  }

  return {
    ...config,
    ...userConfig
  }
}
