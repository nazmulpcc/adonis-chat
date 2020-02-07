'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up () {
    this.create('messages', (table) => {
      table.uuid('uuid').notNullable().primary()
      table.bigInteger('sender_id').notNullable().unsigned().references('id').inTable('users')
      table.bigInteger('receiver_id').notNullable().unsigned().references('id').inTable('users')
      table.text('body', 2000).notNullable()
      table.timestamp('read_at').nullable().defaultTo(null)
      table.timestamps()

      table.index(['sender_id', 'receiver_id'])
    })
  }

  down () {
    this.drop('messages')
  }
}

module.exports = MessageSchema
