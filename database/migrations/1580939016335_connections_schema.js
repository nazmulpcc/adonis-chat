'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConnectionsSchema extends Schema {
  up () {
    this.create('connections', (table) => {
      table.bigInteger('first_user').unsigned().references('id').inTable('users')
      table.bigInteger('second_user').unsigned().references('id').inTable('users')
    })
  }

  down () {
    this.drop('connections')
  }
}

module.exports = ConnectionsSchema
