'use strict'

const Controller = require('egg').Controller
const defaultAvatar = 'https://yxp2918-1304563104.cos.ap-chongqing.myqcloud.com/blog-pictures/%E4%B8%8B%E8%BD%BD.jpg'
class UserController extends Controller {
  async register() {
    const { ctx } = this
    const { username, password } = ctx.request.body
    // 判断用户是否为空
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '用户不存在',
        data: null
      }
    }
    const userInfo = await ctx.service.user.getUserByName(username)
    // 判断数据库是否已经存在该用户
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户已被注册,请重新输入',
        data: null
      }
      return
    }
    const result = await ctx.service.user.userRegister({
      username,
      password,
      signature: '逐渐变强',
      avatar: defaultAvatar
    })
    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null
      }
    }
  }
  // 登录 获取token
  async login() {
    const { ctx, app } = this
    const { username, password } = ctx.request.body
    const userInfo = await ctx.service.user.getUserByName(username)
    // 账户不存在的情况
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '用户名不存在',
        data: null
      }
      return
    }
    // 找到用户,判断密码是否和数据库的一致
    if (userInfo && password != userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null
      }
      return
    }

    //登陆成功，生成token
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
      },
      app.config.jwt.secret
    )
    ctx.body = {
      code: 200,
      msg: '登陆成功',
      data: {
        token
      }
    }
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this
    // 获取token
    const token = ctx.request.header.authorization
    // 解密 获取 username 与 id
    const decode = await app.jwt.verify(token, app.config.jwt.secret)
    const userInfo = await ctx.service.user.getUserByName(decode.username)
    const { id, username, signature, avatar } = userInfo
    ctx.body = {
      code: 200,
      msg: '登陆成功',
      data: {
        id,
        username,
        signature,
        avatar
      }
    }
  }
  // 修改用户信息
  async editUserInfo() {
    const { ctx, app } = this
    const { signature, avatar } = ctx.request.body

    try {
      const token = ctx.request.header.authorization
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return
      const user_id = decode.id
      const userInfo = await ctx.service.user.getUserByName(decode.username)
      const result = await ctx.service.user.editUserInfo({ ...userInfo, signature, avatar })
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id: user_id,
          signature,
          username: userInfo.username,
          avatar
        }
      }
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '编辑失败',
        data: null
      }
      return null
    }
  }
  // 修改用户密码
  async modifyPass() {
    const { ctx, app } = this
    const { old_pass = '', new_pass = '', new_pass2 = '' } = ctx.request.body

    try {
      let user_id
      const token = ctx.request.header.authorization
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return
      if (decode.username == 'admin') {
        ctx.body = {
          code: 400,
          msg: '管理员账户，不允许修改密码！',
          data: null
        }
        return
      }
      user_id = decode.id
      const userInfo = await ctx.service.user.getUserByName(decode.username)
      console.log(userInfo.password)
      if (old_pass != userInfo.password) {
        ctx.body = {
          code: 400,
          msg: '原密码错误',
          data: null
        }
        return
      }

      if (new_pass != new_pass2) {
        ctx.body = {
          code: 400,
          msg: '新密码不一致',
          data: null
        }
        return
      }

      const result = await ctx.service.user.modifyPass({
        ...userInfo,
        password: new_pass
      })

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
  // 测试
  async test() {
    const { ctx, app } = this
    const token = ctx.request.header.authorization
    const decode = await app.jwt.verify(token, app.config.jwt.secret)

    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        ...decode
      }
    }
  }
}

module.exports = UserController
