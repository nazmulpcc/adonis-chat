'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Helpers = use('Helpers')
const Crpto = require("crypto")
const Config = use('Config')
const fs = require('fs')

class Image extends Model {
  static boot(){
    super.boot()
    this.addHook('beforeDelete', async (image) => {
      await fs.unlink(image.path(), () => {})
    })
  }

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

  async update(file, filename = null){
    filename = filename || Crpto.randomBytes(20).toString('hex')
    filename = `${filename}.${file.extname}`
    await fs.unlink(this.path(), () => {})
    await file.move(Helpers.publicPath('uploads/' + this.parent_type), {
      name: filename,
      overwrite: true
    })
    this.name = filename
    return this.save()
  }

  path(){
    return Helpers.publicPath(`uploads/${this.parent_type}/${this.name}`)
  }

  getUrl({name, parent_type}){
    return `${Config.get('app.url')}/uploads/${parent_type}/${name}`
  }
}

module.exports = Image
