'use strict'

const User = use('App/Models/User')

class UserController {
  /**
   * Update user's fcm token
   * @param auth
   * @param request
   * @param response
   * @returns {Promise<{success: *, message: string}>}
   */
  async updateFcmToken({auth, request, response}){
    const success = await User.query()
      .where('id', auth.user.id)
      .update({
      fcm_token: request.input('fcm_token')
    })
    return {
      success,
      message: "Token has been updated"
    }
  }
}

module.exports = UserController
