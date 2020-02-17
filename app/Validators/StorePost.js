'use strict'

class StorePost {
  get rules () {
    return {
      body: 'required|min:2|max:2000',
      lat: 'required|number',
      lng: 'required|number',
      activity: 'required|max:200',
      people: 'required|integer|min:1',
      plus: 'required|boolean',
      image: 'file|file_size:4mb|file_types:image'
    }
  }
  async fails (errorMessages) {
    return this.ctx.response.send({
      success: false,
      message: 'Invalid Data',
      errors: errorMessages
    })
  }
  get sanitizationRules () {
    return {
      email: 'normalize_email',
      people: 'to_int',
      plus: 'to_boolean'
    }
  }
  get validateAll () {
    return true
  }
}

module.exports = StorePost
