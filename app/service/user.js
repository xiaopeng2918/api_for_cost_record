'use strict'

const Service = require('egg').Service

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this
    try {
      const result = await app.mysql.get('user', { username })
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async userRegister(params) {
    const { app } = this
    try {
      const result = await app.mysql.insert('user', params)
      return result
    } catch (err) {
      console.log(err)
      return null
    }
  }
}

module.exports = UserService
