'use strict'

const User = use('App/Models/User')
const AuthCode = use('App/Models/AuthCode')
const Validator = use('Validator')
const Mail = use('Mail')
const Config = use('Config')

class ForgotController {
  /**
   * Send code to reset password
   * @returns {Promise<{success: boolean, message: string}|{success: boolean, message: (Array|Null|*)}>}
   */
  async forgot({request}) {
    const validation = await Validator.validateAll(request.all(), {
      email: 'required|email'
    })
    if(validation.fails()){
      return {
        success: false,
        message: validation.messages()
      }
    }
    let user = await User.findBy('email', request.input('email'))
    const verification = await AuthCode.generate(user, 'password_reset')
    Mail.send('emails.auth.forgot', {user, appName: Config.get('app.name'), verification}, (message) => {
      message
        .from(Config.get('mail.from'))
        .to(user.email)
        .subject(`Reset Password For ${Config.get('app.name')}`)
    })
    return {
      success: true,
      message: "Please check your inbox for password reset code."
    }
  }

  /**
   * Verify the reset password code and update password
   * @returns {Promise<{success: boolean, message: string}|void|*>}
   */
  async reset({request, params, response}){
    try {
      const validation = await Validator.validateAll(request.all(), {
        email: 'required|email',
        password: 'required|min:6',
        code: 'required'
      })
      if (validation.fails()) {
        throw validation.messages()
      }
      const user = await User.findBy('email', request.input('email'))
      if(!user){
        throw "Invalid Email"
      }
      if (await AuthCode.use(user, request.input('code'))) {
        user.password = request.input('password')
        if (user.save()) {
          return {
            success: true,
            message: 'Password reset successful'
          }
        }
      } else {
        throw 'Invalid Code'
      }
    }catch (e) {
      response.status(400).send({
        success: false,
        message: e
      })
    }
  }
}

module.exports = ForgotController
