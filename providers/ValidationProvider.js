'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class ValidationProvider extends ServiceProvider {
  async existsFn (data, field, message, args, get) {
    const Database = use('Database')
    const value = get(data, field)
    if (!value) {
      return
    }

    const [table, column] = args

    const row = await Database.table(table).where(column, value).first()
    if (!row) {
      throw `The field ${field} doesn't exist in table ${table}`
    }
  }

  async uniqueFn(data, field, message, args, get){
    const Database = use('Database')
    const value = get(data, field)
    if (!value) {
      return
    }

    const [table, column] = args
    const row = await Database.table(table).where(column, value).first()
    if (row) {
      throw `The ${field} ${value} is already taken`
    }
  }

  boot () {
    const Validator = use('Validator')
    Validator.extend('exists', this.existsFn.bind(this))
    Validator.extend('unique', this.uniqueFn.bind(this))
  }
}

module.exports = ValidationProvider
