'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.bigIncrements()
      table.string('email', 254).notNullable().unique()
      table.string('name', 254).notNullable()
      table.boolean('gender').defaultTo(0)
      table.string('password', 60).notNullable()
      table.timestamp('email_verified_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
