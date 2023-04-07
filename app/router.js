'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app
  const _jwt = middleware.jwt(app.config.jwt.secret)
  router.get('/', controller.home.index)
  router.post('/user/register', controller.user.register)
  router.post('/user/login', controller.user.login)
  router.get('/user/test', _jwt, controller.user.test)
  router.get('/user/get_userinfo', _jwt, controller.user.getUserInfo)
  router.post('/user/edit_userinfo', _jwt, controller.user.editUserInfo)
}
