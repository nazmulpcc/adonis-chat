'use strict'

const Config = use('Config')
const Notification = use('App/Notifications/Notification')
const Validator = use('Validator')
const User = use('App/Models/User')
const Connection = use('App/Models/Connection')

class ConnectionController {
  /**
   * Create a new connection or unblock existing
   * @param request
   * @param response
   * @param auth
   * @returns {Promise<{success: boolean, message: string}|void|*>}
   */
  async connect({request, response, auth}){
    try{
      const target = await User.findBy('id', request.input('user_id'))
      if(! target){
        throw {message: "Invalid Target User", data: []}
      }
      if(await Connection.exists(auth.user, target) || await Connection.make(auth.user, target, true)){
        let appName = Config.get('app.name')
        let notification = new Notification("You have a new Connection!", `${target.name} has connected with you on ${appName}`);
        target.fcm_token && await notification
          .tokens([target.fcm_token])
          .add({
            event: 'connection',
            user_id: target.id
          })
          .send()
        return {
          success: true,
          message: `You are now connected with ${target.name}`
        }
      }
      throw {message: "Cannot connect"}
    }catch(e){
      return response.status(400).send({
        success: false,
        message: e.message,
        data: e.data
      })
    }
  }

  /**
   * Block connection with a user
   * @param request
   * @param response
   * @param auth
   * @returns {Promise<{success: boolean, message: string}|void|*>}
   */
  async disconnect({request, response, auth}){
    try{
      const target = await User.findBy('id', request.input('user_id'))
      if(! target){
        throw {message: "Invalid Target User", data: []}
      }
      if(await Connection.block(auth.user, target)){
        return {
          success: true,
          message: `${target.name} has been blocked`
        }
      }
      throw {message: 'Request Failed', data: []}
    }catch(e){
      return response.status(400).send({
        status: false,
        message: e.message,
        data: e.data
      })
    }
  }
}

module.exports = ConnectionController
