'use strict'

const Config = use('Config')
const Post = use('App/Models/Post')
const Image = use('App/Models/Image')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    return auth.user
      .posts()
      .with('images')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get other users posts
   * @param request
   * @param response
   * @param auth
   * @returns {Promise<Serializer|{total: *, perPage: number, lastPage: number, data: [], page: number}>}
   */
  async nearby({request, response, auth}){
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    return Post.query()
      .with('creator')
      .with('images')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
  }

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store ({ request, response, auth }) {
    const data = request.only(['body', 'lat', 'lng', 'activity', 'people', 'plus'])
    data.user_id = auth.user.id
    const post = await Post.create(data)
    Image.upload(request.file('image'), post)
    return {
      success: true,
      message: 'Post Created',
      data: post
    }
  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PostController
