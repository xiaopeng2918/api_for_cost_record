const fs = require('fs')
const moment = require('moment')
const mkdirp = require('mkdirp')
const path = require('path')

const Controller = require('egg').Controller

class UpLoadontroller extends Controller {
  async upload() {
    const { ctx } = this
    // 需要前往 config/config.default.js 设置 config.multipart 的 mode 属性为 file
    let file = ctx.request.files[0]
    // ctx.request.files[0] 表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
    let uploadDir = ''
    try {
      let filePath = file ? file.filepath.replace(/\\/g, '/') : null
      let f = fs.readFileSync(filePath)
      // 获取当前日期
      let day = moment(new Date()).format('YYYYMMDD')
      // 创建图片保存的路径
      let dir = path.join(this.config.uploadDir, day)
      let date = Date.now()
      // 不存在就创建
      await mkdirp(dir)
      // 返回图片保存的路径 host + IP + 图片名称 + 后缀
      uploadDir = path.join(dir, date + path.extname(file.filename))
      fs.writeFileSync(uploadDir, f)
      uploadDir = uploadDir.split(path.seq).join('/')
    } catch (err) {
    } finally {
      ctx.cleanupRequestFiles()
    }
    ctx.body = {
      code: 200,
      msg: '上传成功',
      data: uploadDir.replace(/app/g, '')
    }
  }
}

module.exports = UpLoadontroller
