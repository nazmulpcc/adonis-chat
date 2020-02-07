'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
  static get hidden(){
    return ['updated_at', 'user_id']
  }

  creator(){
    return this.belongsTo('App/Models/User', 'user_id', 'id')
  }
  images(){
    return this.hasMany('App/Models/Image', 'id', 'parent_id')
      .where('parent_type', this.constructor.name)
  }
  getPlus(plus){
    return !! plus
  }
}

module.exports = Post
