'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.bigIncrements()
      table.bigInteger('user_id').notNullable().unsigned().references('id').inTable('users')
      table.text('body').notNullable()
      table.decimal('lat').notNullable()
      table.decimal('lng').notNullable()
      table.string('activity', 254).notNullable()
      table.integer('people').unsigned().notNullable()
      table.boolean('plus').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
