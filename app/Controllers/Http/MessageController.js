'use strict'

const DB = use('Database')
const Validator = use('Validator')
const User = use('App/Models/User')
const Message = use('App/Models/Message')
const Connection = use('App/Models/Connection')

class MessageController {
  async index({request, response, auth}){
    try{
      const target = await User.find(request.params.user)
      if(! target){
        throw {message: 'Invalid Target User', data: []}
      }
      const page = request.input('page', 1)
      const limit = request.input('page', 10)
      return Message.query()
        .where(function () {
          this.where('sender_id', auth.user.id).where('receiver_id', target.id)
        }).orWhere(function () {
          this.where('sender_id', target.id).where('receiver_id', auth.user.id)
        })
        .orderBy('created_at', 'DESC')
        .paginate(page, limit)
    }catch(e){
      return response.status(400).send({
        success: false,
        message: e.message,
        data: e.data
      })
    }
  }

  async store({request, response, auth}){
    try{
      const validation = await Validator.validateAll(request.all(), {
        user_id: 'required|integer',
        message: 'required|min:1|max:1024'
      })
      if(validation.fails()){
        throw { message: 'Invalid Data', data: validation.messages() }
      }
      const target = await User.findBy('id', request.input('user_id'))
      if(!target || ! await Connection.exists(target, auth.user)){
        throw {message: "Invalid Target User", data: []}
      }
      let message
      if(message = await Message.send(auth.user, target, request.input('message'))){
        return {
          success: true,
          message: 'Message Send',
          data: message
        }
      }
      throw {success: false, message: "Message sending failed"}
    }catch(e){
      return response.status(400).send({
        success: false,
        message: e.message,
        data: e.data
      })
    }
  }

  async recent({request, response, auth}){
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const cons = await Connection.query()
      .orderBy('used_at', 'DESC')
      .where(function () {
        this.where('first_user', auth.user.id)
          .orWhere('second_user', auth.user.id)
      })
      .paginate(page, limit)
      .then((r) => r.toJSON())
    const users = []
    for (const connection of cons.data){
      if(connection.first_user !== auth.user.id){
        users.push(connection.first_user)
      }else{
        users.push(connection.second_user)
      }
    }
    cons.data = await User.query()
      .with('picture')
      .whereIn('id', users)
      .fetch()
    return cons
  }
}

module.exports = MessageController
