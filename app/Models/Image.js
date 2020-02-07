'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Helpers = use('Helpers')
const Crpto = require("crypto")
const Config = use('Config')

class Image extends Model {
  static get computed () {
    return ['url']
  }
  static get visible () {
    return ['name', 'url']
  }
  /**
   * Upload a new image for the given parent
   * @param file
   * @param parent
   * @param type
   * @param filename
   * @returns {Promise<Model>}
   */
  static async upload(file, parent, type = null, filename = null){
    filename = filename || Crpto.randomBytes(20).toString('hex')
    filename = `${filename}.${file.extname}`
    file.move(Helpers.publicPath('uploads/' + parent.constructor.name), {
      name: filename,
      overwrite: true
    })
    return Image.create({
      parent_type: parent.constructor.name,
      parent_id: parent.id,
      type: type,
      name: filename
    });
  }

  getUrl({name, parent_type}){
    return `${Config.get('app.url')}/uploads/${parent_type}/${name}`
  }
}

module.exports = Image
