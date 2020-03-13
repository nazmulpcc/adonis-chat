'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddWaitingForColumnInConnectionsSchema extends Schema {
  up () {
    this.table('connections', (table) => {
      table.bigInteger('waiting_for').unsigned().nullable().after('used_at')
    })
  }

  down () {
    this.table('connections', (table) => {
      table.dropColumn('waiting_for')
    })
  }
}

module.exports = AddWaitingForColumnInConnectionsSchema
