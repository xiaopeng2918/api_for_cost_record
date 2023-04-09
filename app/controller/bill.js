'use strict'

const moment = require('moment')

const Controller = require('egg').Controller

class BillController extends Controller {
  // 添加表单
  async add() {
    const { ctx, app } = this
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400, // 参数错误，服务器无法理解
        msg: '参数错误',
        date: null
      }
      return
    }
    try {
      let user_id
      const token = ctx.request.header.authorization
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
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
  // 获取表单 以月为单位
  async list() {
    const { ctx, app } = this
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query
    try {
      let user_id
      const token = ctx.request.header.authorization
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return
      user_id = decode.id
      // 根据用户id拿到他的bill列表
      const list = await ctx.service.bill.list(user_id)
      // 过滤出每月的列表 按账单所属类别
      const _list = list.filter((item) => {
        if (type_id != 'all') {
          // 数据库存取的date为时间戳
          return moment(Number(item.date)).format('YYYY-MM') == date && type_id == item.type_id
        }
        return moment(Number(item.date)).format('YYYY-MM') == date
      })
      // 格式化数据，整理为前端应当收到的格式
      let listMap = _list
        .reduce((curr, item) => {
          // 获取指定一天的数据
          const date = moment(Number(item.date)).format('YYYY-MM-DD')
          if (curr && curr.length && curr.findIndex((item) => item.date == date) > -1) {
            const index = curr.findIndex((item) => item.date == date)
            curr[index].bills.push(item)
          }
          if (curr && curr.length && curr.findIndex((item) => item.date == date) == -1) {
            curr.push({
              date,
              bills: [item]
            })
          }
          if (!curr.length) {
            curr.push({
              date,
              bills: [item]
            })
          }
          return curr
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date))

      // 分页 按照每天的账单来进行分页
      const fileterListMap = listMap.slice((page - 1) * page_size, page * page_size)
      // 计算当月收入和支出
      let __list = list.filter((item) => moment(Number(item.date)).format('YYYY-MM') == date)
      // 支出
      let totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount)
          return curr
        }
        return curr
      }, 0)
      // 收入
      let totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount)
          return curr
        }
        return curr
      }, 0)
      // 返回数据
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense,
          totalIncome,
          totalPage: Math.ceil(listMap.length / page_size),
          list: fileterListMap || []
        }
      }
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
  // 根据账单id 与账单所属用户user_id获取账单详情
  async detail() {
    const { ctx, app } = this
    const { id } = ctx.request.query
    let user_id
    const token = ctx.request.header.authorization
    const decode = await app.jwt.verify(token, app.config.jwt.secret)
    if (!decode) return
    user_id = decode.id
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '订单id不能为空',
        data: null
      }
      return
    }
    try {
      const detail = await ctx.service.bill.detail(id, user_id)
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail
      }
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '获取账单详情页失败',
        data: null
      }
    }
  }
  // 更新账单
  async update() {
    const { ctx, app } = this
    // 账单的相关参数，这里注意要把账单的 id 也传进来
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body
    // 判空处理
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
    }
    try {
      let user_id
      const token = ctx.request.header.authorization
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return
      user_id = decode.id
      const result = await ctx.service.bill.update({
        id,
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
        msg: '修改详情页成功',
        data: null
      }
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '修改失败',
        data: err
      }
    }
  }

  // 删除账单
  async delete() {
    const { ctx, app } = this
    const { id } = ctx.request.body
    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
      return
    }
    try {
      let user_id
      const token = ctx.request.header.authorization
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return
      user_id = decode.id
      const result = await ctx.service.bill.delete(id, user_id)
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null
      }
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null
      }
    }
  }

  // 以下为图表

  async data() {
    const { ctx, app } = this
    const { date } = ctx.query
    let user_id
    const token = ctx.request.header.authorization
    const decode = await app.jwt.verify(token, app.config.jwt.secret)
    if (!decode) return
    user_id = decode.id
    try {
      const result = await ctx.service.bill.list(user_id)
      const start = moment(date).startOf('month').unix() * 1000
      const end = moment(date).endOf('month').unix() * 1000
      // 当前用户指定月份的所有表单数据
      const _data = result.filter((item) => Number(item.date) >= start && Number(item.date) <= end)
      // 总支出
      const total_expense = _data.reduce((arr, cur) => {
        if (cur.pay_type == 1) {
          arr += Number(cur.amount)
          return arr
        }
        return arr
      }, 0)
      // 总收入
      const total_income = _data.reduce((arr, cur) => {
        if (cur.pay_type == 2) {
          arr += Number(cur.amount)
          return arr
        }
        return arr
      }, 0)
      // 获取收支构成
      let total_data = _data.reduce((arr, cur) => {
        const index = arr.findIndex((item) => item.type_id == cur.type_id)
        if (index == -1) {
          arr.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            number: Number(cur.amount)
          })
        }
        if (index > -1) {
          arr[index].number += Number(cur.amount)
        }
        return arr
      }, [])
      total_data = total_data.map((item) => {
        item.number = Number(Number(item.number).toFixed(2))
        return item
      })
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          total_expense: Number(total_expense).toFixed(2),
          total_income: Number(total_income).toFixed(2),
          total_data: total_data || []
        }
      }
    } catch (err) {
      ctx.body = {
        code: 500,
        msg: '获取账单综合数据失败',
        data: null
      }
    }
  }
}

module.exports = BillController
