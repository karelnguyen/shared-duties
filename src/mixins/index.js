import Vue from 'vue'
import uuid from 'uuid/v4'

Vue.mixin({
  /**
   * Mixin data
   * @returns {object} data
   */
  data () {
    return {
      // GLOBAL_VARIABLE: '{value}'
    }
  },

  methods: {
    /**
     * Generate random id
     * @return {String}
     */
    generateRandomId () {
      return uuid()
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
     * Replace space with a dash in a string
     * @param  {String} string
     * @return {String}
     */
    replaceSpaceWithDash (string) {
      let data = string.split(' ')
      data = data.join('-')
      return data
    },

    /**
     * Uncapitalize a string
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
