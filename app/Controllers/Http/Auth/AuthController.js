'use strict'

const User = use('App/Models/User')
const Image = use('App/Models/Image')
const { validate } = use('Validator')

class AuthController {
  /**
   * Register a new User
   * @param request
   * @param response
   * @returns {Promise<void|*>}
   */
  async register({request, response}){
    try{
      const data = request.only(['name', 'gender', 'email', 'password'])
      const user = await User.create(data)
      await Image.upload(request.file('picture'), user, 'picture')
      await user.load('picture')
      return {
        success: true,
        message: 'Registration Successful',
        user: user
      }
    }catch (e) {
      console.log(e)
      return response
        .status(e.status)
        .send(e.message)
    }
  }

  /**
   * Login the user
   * @param request
   * @param auth
   * @returns {Promise<{type: string, token: *}|Object|{type: string, token: *, refreshToken: null}>}
   */
  async login({request, response, auth}){
    try{
      const { email, password } = request.all()
      const user = await User.findBy('email', request.input('email'))
      if(! user){
        throw "Invalid Email"
      }
      if(! user.verified()){
        throw "You have to verify your email first"
      }
      const token = await auth.withRefreshToken().attempt(email, password)
      token.success = true
      token.user = {name: user.name, id: user.id}
      return token
    }catch (e) {
      return response.status(400).send({
        success: false,
        message: e
      })
    }
  }

  /**
   * Check if the user is logged in
   * @param auth
   * @returns {Promise<{success: boolean, user: *}|{success: boolean}>}
   */
  async check({ auth }){
    if(auth.check()){
      return {
        success: true,
        user: auth.user
      }
    }else{
      return {
        success: false
      }
    }
  }
}

module.exports = AuthController
