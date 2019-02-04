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
    }
  }
})
