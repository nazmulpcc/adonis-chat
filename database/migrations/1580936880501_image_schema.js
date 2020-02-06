'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageSchema extends Schema {
  up () {
    this.create('images', (table) => {
      table.bigIncrements()
      table.bigInteger('user_id').unsigned().references('id').inTable('users')
      table.string('type').defaultTo('')
      table.string('path').defaultTo('')
      table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('images')
  }
}

module.exports = ImageSchema
