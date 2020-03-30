'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Connection extends Model {
  static get dates () {
    return super.dates.concat(['used_at'])
  }

  /**
   * Trigger a use of the connection
   * @returns {Promise<Boolean>}
   */
  async use(wait_for = null){
    this.used_at = new Date()
    this.waiting_for = wait_for
    return this.save()
  }

  static async use(first, second, wait_for = second){
    const pair = this.makePair({first, second})
    return !! await this.query()
      .where('first_user', pair.first)
      .where('second_user', pair.second)
      .update({
        used_at: new Date(),
        waiting_for: wait_for
      })
  }
  /**
   * Get the connection between users
   * @param first
   * @param second
   * @param ignoreBlock
   * @returns {Promise<*>}
   */
  static async get(first, second, ignoreBlock = false){
    const pair = this.makePair({first, second})
    const query = this.query()
      .where('first_user', pair.first)
      .where('second_user', pair.second)
    if(! ignoreBlock){
      query.where('active', true)
    }
    return query.first()
  }

  /**
   * Check if connection exists between two users
   * @param first
   * @param second
   * @param ignoreBlock
   * @returns {Promise<boolean>}
   */
  static async exists(first, second, ignoreBlock = false){
    return !! await this.get(first, second, ignoreBlock)
  }

  /**
   * Make a new connection or unblock existing
   * @param first
   * @param second
   * @param force
   * @returns {Promise<boolean|Model>}
   */
  static async make(first, second, force = false){
    if(!first || !second){
      return false
    }
    const pair = this.makePair({first, second})
    const connection = await this.get(first, second)
    if(connection){
      if(! force){
        return false
      }
      await connection.update({active: true})
      return connection
    }
    return Connection.create({
      first_user: pair.first,
      second_user: pair.second,
      used_at: new Date(),
      active: true
    })
  }

  /**
   * Block a connection beetween two users
   * @param first
   * @param second
   * @returns {Promise<boolean>}
   */
  static async block(first, second){
    return this.changeStatus(first, second, false)
  }

  /**
   * Unblock/Activate a connection between users
   * @param first
   * @param second
   * @returns {Promise<boolean>}
   */
  static async activate(first, second){
    return this.changeStatus(first, second, true)
  }

  /**
   * First User relation
   * @returns {BelongsTo}
   */
  firstUser(){
    return this.belongsTo('App/Models/User', 'first_user')
  }

  /**
   * Second user relation
   * @returns {BelongsTo}
   */
  secondUser(){
    return this.belongsTo('App/Models/User', 'second_user')
  }

  /**
   * Normalize a user instance to id
   * @param user
   * @returns {*}
   */
  static normalizeUserId(user){
    return user.id || user
  }

  /**
   * Change the active status of a connection
   * @param first
   * @param second
   * @param active
   * @returns {boolean}
   */
  static async changeStatus(first, second, active){
    const pair = this.makePair({first, second})
    return !! await this.query()
      .where('first_user', pair.first)
      .where('second_user', pair.second)
      .update({active})
  }

  /**
   * Create a sorted pair of user id
   * All connection is sorted by user id before creating, so the queries become shorter
   * @param first
   * @param second
   * @returns {{first: *, second: *}}
   */
  static makePair({first, second}){
    first = this.normalizeUserId(first)
    second = this.normalizeUserId(second)
    if(first > second){
      return {first: second, second: first}
    }
    return {first, second}
  }
}

module.exports = Connection
