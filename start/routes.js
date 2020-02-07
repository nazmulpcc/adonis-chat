'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Auth routes
Route.group(() => {
  Route.post('/register', 'Auth/AuthController.register').validator('StoreUser').as('register')
  Route.post('/login', 'Auth/AuthController.login').as('login')

  Route.post('/forgot', 'Auth/ForgotController.forgot').as('forgot')
  Route.post('/reset', 'Auth/ForgotController.reset').as('reset')

  Route.post('/verify', 'Auth/VerificationController.verify').as('verify')
  Route.post('/verify/request', 'Auth/VerificationController.request').as('verify.request')
}).prefix('/auth').middleware('guest')
Route.post('/auth/check', 'Auth/AuthController.check').middleware('auth')

Route.get('/posts/nearby', 'PostController.nearby').middleware('auth')
Route.resource('posts', 'PostController')
  .middleware(['auth'])
  .validator(new Map([
    [['posts.store'], ['StorePost']]
  ]))

// connection routes
Route.group(() => {
  Route.post('/connect', 'ConnectionController.connect')
  Route.post('/disconnect', 'ConnectionController.disconnect')
}).prefix('/connections').middleware('auth')
