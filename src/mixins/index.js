import Vue from 'vue'
import uuid from 'uuid/v4'

Vue.mixin({
  methods: {
    /**
     * Returns value of given path from given object
     * @param {Object} obj - object on which is deepFind performed
     * @param {String} path - example: 'testKey.random.xyz'
     * @returns {*}
     */
    deepFind (obj, path) {
      let paths = path.split('.')
      for (let key in paths) {
        if (obj[paths[key]] === undefined) {
          return undefined
        } else {
          obj = obj[paths[key]]
        }
      }

      return obj
    },

    /**
     * Decides, which error it is and return error message
     * @param  {String} name - input name
     * @return {Array}
     */
    vErrors (name) {
      const errors = []
      let errorObj = this.deepFind(this.$v, name)

      if (!errorObj.$dirty) return errors

      if (errorObj.hasOwnProperty('numeric')) {
        !errorObj.numeric && errors.push('Field may only contain numeric characters.')
      }
      if (errorObj.hasOwnProperty('sameAsPassword')) {
        !errorObj.sameAsPassword && errors.push('Your passwords does not match.')
      }
      if (errorObj.hasOwnProperty('email')) {
        !errorObj.email && errors.push('Your email is badly formatted.')
      }
      if (errorObj.hasOwnProperty('decimal')) {
        !errorObj.decimal && errors.push('Field may only contain numeric or decimal characters.')
      }
      if (errorObj.hasOwnProperty('required')) {
        !errorObj.required && errors.push('Field is required.')
      }
      return errors
    },

    /**
     * Generates random id
     * @return {String}
     */
    generateRandomId () {
      return uuid()
    },

    /**
     * Skip the first object property name
     * @param  {Object} obj
     * @return {Object}
     */
    avoidIdObjectName (obj) {
      return obj[Object.keys(obj)[0]]
    },

    /**
     * Checks if object is empty
     * @param  {Object}  object
     * @return {Boolean}
     */
    isObjectEmpty (object) {
      return (Object.keys(object).length === 0 && object.constructor === Object)
    },

    /**
     * Replaces space with a dash in a string
     * @param  {String} string
     * @return {String}
     */
    replaceSpaceWithDash (string) {
      let data = string.split(' ')
      data = data.join('-')
      return data
    },

    /**
     * Uncapitalizes a string
     * @param  {String} string
     * @return {String}
     */
    unCapitalize (string) {
      if (!string) return ''
      string = string.toString()
      return string.charAt(0).toLocaleLowerCase() + string.slice(1)
    }
  }
})
