'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()
    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

    /**
     * Create a user's social profile after registration
     */
    this.addHook('afterCreate', async (user) => {
      user.social().create({})
    })
  }

  /**
   * Hide fields
   * @returns {string[]}
   */
  static get visible () {
    return ['id', 'name', 'gender', 'picture']
  }
  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }

  codes(){
    return this.hasMany('App/Models/AuthCode')
  }

  social () {
    return this.hasOne('App/Models/Social')
  }

  picture(){
    return this.hasOne('App/Models/Image', 'id', 'parent_id')
      .where('parent_type', this.constructor.name)
      .where('type', 'picture')
  }

  getGender(gender){
    return gender === 0 ? 'male' : 'female'
  }

  verified(){
    return !! this.email_verified_at
  }
}

module.exports = User
