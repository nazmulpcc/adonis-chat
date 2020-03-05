'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFcmTokenFieldInUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('fcm_token').after('gender')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('fcm_token')
    })
  }
}

module.exports = AddFcmTokenFieldInUsersSchema
