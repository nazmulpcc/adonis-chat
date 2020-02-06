'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Drive = use('Drive')
const Crpto = require("crypto")

class Image extends Model {
  static async upload(file, user, type = null, filename = null){
    filename = filename || Crpto.randomBytes(20).toString('hex')
    Drive.put(filename, file)
    return Image.create({
      user_id: user.id,
      type: type,
      path: '',
      name: filename
    });
  }
}

module.exports = Image
