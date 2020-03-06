'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const FireBase = require('firebase-admin')
/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers')


class FirebaseProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('FCM', () => {
      const serviceAccount = require(Helpers.appRoot('google-service-account.json'));
      FireBase.initializeApp({
        credential: FireBase.credential.cert(serviceAccount),
        databaseURL: "https://linkup-2020.firebaseio.com"
      });
      return FireBase
    })
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    //
  }
}

module.exports = FirebaseProvider
