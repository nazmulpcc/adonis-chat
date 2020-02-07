'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    const user = await User.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'secret',
      gender: 0,
      email_verified_at: new Date()
    })
    await user.tokens().create({
      type: 'jwt_refresh_token',
      token: '9663fdd6-89ab-4d25-be8f-68fa33f32b3c',
      is_revoked: false
    })
  }
}

module.exports = UserSeeder
