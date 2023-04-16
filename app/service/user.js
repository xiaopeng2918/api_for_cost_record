'use strict'

const Service = require('egg').Service

class UserService extends Service {
  // 通过名字得到用户信息
  async getUserByName(username) {
    const { app } = this
    try {
      const result = await app.mysql.get('user', { username })
      return result
    } catch (err) {
      console.log(err)
      return null
    }
  }
  // 用户注册
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
  // 用户修改
  async editUserInfo(params) {
    const { app } = this
    try {
      const result = await app.mysql.update(
        'user',
        {
          ...params
        },
        {
          id: params.id
        }
      )
      return result
    } catch (err) {
      console.log(err)
      return null
    }
  }
  // 密码修改
  async modifyPass(params) {
    const { app } = this
    try {
      let result = await app.mysql.update(
        'user',
        {
          ...params
        },
        {
          id: params.id
        }
      )
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

module.exports = UserService
