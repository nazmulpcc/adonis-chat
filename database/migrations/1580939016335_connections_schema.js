'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConnectionsSchema extends Schema {
  up () {
    this.create('connections', (table) => {
      table.bigIncrements('id')
      table.bigInteger('first_user').notNullable().unsigned().references('id').inTable('users')
      table.bigInteger('second_user').notNullable().unsigned().references('id').inTable('users')
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamps()

      table.index(['first_user', 'second_user'])
      table.unique(['first_user', 'second_user'])
    })
  }

  down () {
    this.drop('connections')
  }
}

module.exports = ConnectionsSchema
