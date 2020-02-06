'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('/register', 'Auth/AuthController.register').validator('StoreUser').as('register')
  Route.post('/login', 'Auth/AuthController.login').as('login')

  Route.post('/forgot', 'Auth/ForgotController.forgot').as('forgot')
  Route.post('/reset', 'Auth/ForgotController.reset').as('reset')

  Route.post('/verify', 'Auth/VerificationController.verify').as('verify')
  Route.post('/verify/request', 'Auth/VerificationController.request').as('verify.request')
}).prefix('/auth').middleware('guest')

Route.post('/auth/check', 'AuthController.check').middleware('auth')
