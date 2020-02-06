'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
  /**
   * Token belongs to a user
   * @returns {BelongsTo}
   */
  user(){
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Token
