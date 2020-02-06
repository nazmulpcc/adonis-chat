'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AuthCode extends Model {
  /**
   * Generate a new auth code
   * @param user
   * @param type
   * @returns {Promise<boolean|Model>}
   */
  static async generate(user, type){
    if(!user || !user.id){
      return false
    }
    return AuthCode.create({
      user_id: user.id,
      code: this.newCode(),
      type: type
    });
  }

  /**
   * Use a code for the user of given type
   * One successful use, all codes of that type will be deleted
   * @param user
   * @param code
   * @returns {Promise<boolean>}
   */
  static async use(user, code, cleanup = true){
    const target = await AuthCode.query()
      .where('user_id', user.id)
      .where('code', code)
      .first()
    if(target){
      cleanup && await AuthCode.query()
        .where('type', target.type)
        .delete()
      return true
    }else{
      return false
    }
  }

  static newCode(digit = 5){
    const min = Math.pow(10, digit)
    const max = Math.pow(10, digit+1) - 1
    return Math.floor(Math.random() * (max - min)) + min;
  }
  /**
   * Token belongs to a user
   * @returns {BelongsTo}
   */
  user(){
    return this.belongsTo('App/Models/User')
  }
}

module.exports = AuthCode
