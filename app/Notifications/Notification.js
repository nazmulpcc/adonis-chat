'use strict'

const FCM = use('FCM')

class Notification {
  /**
   * Whether to send the title and body in the data payload
   * @type {boolean}
   */
  asData = false
  /**
   * Title of the notification
   * @type {string}
   */
  title = ""
  /**
   * Body of the notification
   * @type {string}
   */
  body = ""

  /**
   * False if the props are to be auto generated
   * @type {boolean|Object}
   */
  payload = {}
  deviceTokens = []

  /**
   * @param title
   * @param body
   */
  constructor(title = "", body = "") {
    if(title instanceof Object){
      this.payload = title
    }else{
      this.title = title
      this.body = body
    }
  }

  /**
   * Add properties in the notification payload
   * @param data
   * @returns {Notification}
   */
  notification(data = {}){
    this.payload.notification = Object.assign(this.payload.notification || {}, data)
    return this
  }

  /**
   * Add properties in the data payload
   * @param data
   */
  data(data = {}){
    this.payload.data = Object.assign(this.payload.data || {}, data)
    return this
  }

  /**
   * Add properties in the generic payload
   * @param data
   */
  add(data = {}){
    this.payload = Object.assign(this.payload || {}, data)
    return this
  }

  /**
   * Set the device tokens to which the notifications will be sent
   * @param tokens
   */
  tokens(tokens = []){
    this.deviceTokens = tokens
    return this
  }

  /**
   * Send the notification
   * @returns {Promise<*|void>}
   */
  async send(){
    let message = this.buildPayload()
    return FCM.messaging().send(message)
  }

  /**
   * Build the whole notification payload
   * @returns {{}}
   */
  buildPayload(){
    let payload = {...this.payload}
    let data = {
      title: this.title,
      body: this.body
    }
    let as = this.asData ? 'data' : 'notification'
    payload[as] = Object.assign(payload[as] || {}, data)
    // payload.tokens = [...(payload.tokens || []), ...this.deviceTokens]
    payload.token = this.deviceTokens[0]
    // payload.click_action = 'FLUTTER_NOTIFICATION_CLICK'
    return payload
  }
}

module.exports = Notification
