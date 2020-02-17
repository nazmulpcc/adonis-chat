'use strict'

class StoreUser {
  get rules () {
    return {
      name: 'required|max:200',
      email: 'required|email|unique:users,email',
      gender: 'required',
      password: 'required|min:6',
      picture: 'file|file_size:4mb|file_types:image'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send({
      success: false,
      errors: errorMessages
    })
  }
}

module.exports = StoreUser
