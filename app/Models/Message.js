'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const uuid = require("uuid/v4")
const Connection = use('App/Models/Connection')

class Message extends Model {
  /**
   * Set the primary key to uuid
   * @returns {string}
   */
  static get primaryKey () {
    return 'uuid'
  }
  static get incrementing () {
    return false
  }
  static get dates () {
    return super.dates.concat(['read_at'])
  }
  static boot() {
    super.boot()
    this.addHook("beforeCreate", (message) => {
      message.uuid = uuid()
    })
    this.addHook("afterCreate", async (message) => {
      await Connection.use(message.sender_id, message.receiver_id, message.receiver_id)
    })
  }
  static async send(sender, receiver, message){
    let m = await this.create({
      sender_id: sender.id || sender,
      receiver_id: receiver.id || sender,
      body: message
    })
    return m
  }
  sender(){
    return this.belongsTo('App/Models/User')
  }
  receiver(){
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Message
