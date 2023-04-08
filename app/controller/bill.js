'use strict'

const moment = require('moment')

const Controller = require('egg').Controller

class BillController extends Controller {
  async add() {
    const { ctx, app } = this
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400, // 参数错误，服务器无法理解
        msg: '参数错误',
        date: null
      }
    }
    try {
      let user_id
      const token = ctx.request.header.authorization
      const decode = app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return
      user_id = decode.id
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id
      })
      ctx.body = {
        code: 200,
        msg: '增加成功',
        data: null
      }
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '添加失败',
        data: null
      }
      
    }
  }
}

module.exports = BillController 
