'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImagePostSchema extends Schema {
  up () {
    this.create('image_post', (table) => {
      table.bigInteger('post_id').unsigned().references('id').inTable('posts')
      table.bigInteger('image_id').unsigned().references('id').inTable('images')
    })
  }

  down () {
    this.drop('image_post')
  }
}

module.exports = ImagePostSchema
