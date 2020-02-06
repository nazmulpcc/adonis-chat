'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuthCodeSchema extends Schema {
  up () {
    this.create('auth_codes', (table) => {
      table.bigIncrements()
      table.bigInteger('user_id').unsigned().references('id').inTable('users')
      table.integer('code').unsigned().notNullable()
      table.string('type', 30).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('auth_codes')
  }
}

module.exports = AuthCodeSchema
