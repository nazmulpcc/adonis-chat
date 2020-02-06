'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SocialSchema extends Schema {
  up () {
    this.create('socials', (table) => {
      table.bigIncrements()
      table.bigInteger('user_id').unsigned().references('id').inTable('users')
      table.string('facebook', 30).nullable()
      table.string('google', 40).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('socials')
  }
}

module.exports = SocialSchema
