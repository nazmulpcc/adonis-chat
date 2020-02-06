'use strict';

const AuthCode = use('App/Models/AuthCode');
const User = use('App/Models/User');
const Mail = use('Mail');
const Config = use('Config');

class VerificationController {
  async verify({request, response}){
    try {
      const user = await User.findBy('email', request.input('email'));
      if(! user){
        throw new Error("Invalid Email");
      }
      if(await AuthCode.use(user, request.input('code'))){
        user.email_verified_at = new Date();
        user.save();
        return {
          success: true,
          message: 'Email verification successful.'
        }
      }else{
        throw new Error('Invalid Code')
      }
    }catch (e) {
      return response.status(400).send({
        success: false,
        message: e.message
      })
    }
  }

  async request({request, response}){
    const user = await User.findBy('email', request.input('email'));
    if(! user){
      return {
        success: false,
        message: 'Invalid Email'
      }
    }
    if(user.verified()){
      return {
        success: false,
        message: 'User is already verified'
      }
    }
    const verification = await AuthCode.generate(user, 'email_verification');
    const data = { user, appName: Config.get('app.name'), verification };
    Mail.send('emails.auth.verify', data, (message) => {
      message
        .from(Config.get('mail.from'))
        .to(user.email)
        .subject(`Email Verification for ${data.appName}`)
    });
    return {
      success: true,
      message: 'A new verification email has been sent'
    }
  }
}

module.exports = VerificationController;
