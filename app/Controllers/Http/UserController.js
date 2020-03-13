'use strict'

const User = use('App/Models/User')
const Image = use('App/Models/Image')

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

  async update({auth, request}){
    const data = request.only(['name'])
    const updated = User.query()
      .where('id', auth.user.id)
      .update(data)
    await auth.user.load('picture')
    let picture = auth.user.getRelated('picture')
    if(! picture){
      await Image.upload(request.file('picture'), auth.user, 'picture')
    }else{
      await picture.update(request.file('picture'))
    }
    return {
      success: true,
      message: "Profile Updated"
    }
  }
}

module.exports = UserController
