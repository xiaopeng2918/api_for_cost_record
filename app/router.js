'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app
  const _jwt = middleware.jwt(app.config.jwt.secret)
  router.get('/', controller.home.index)
  // user
  router.post('/user/register', controller.user.register)
  router.post('/user/login', controller.user.login)
  router.get('/user/test', _jwt, controller.user.test)
  router.get('/user/get_userinfo', _jwt, controller.user.getUserInfo)
  router.post('/user/edit_userinfo', _jwt, controller.user.editUserInfo)
  router.post('/user/modify_pass', _jwt, controller.user.modifyPass) // 修改用户密码
  // upload
  router.post('/upload', controller.upload.upload)
  //type
  router.get('/type/list', _jwt, controller.type.list)
  //bill
  router.post('/bill/add', _jwt, controller.bill.add)
  router.get('/bill/list', _jwt, controller.bill.list)
  router.get('/bill/detail', _jwt, controller.bill.detail)
  router.post('/bill/update', _jwt, controller.bill.update)
  router.post('/bill/delete', _jwt, controller.bill.delete)

  //data
  router.get('/bill/data', _jwt, controller.bill.data)
}
