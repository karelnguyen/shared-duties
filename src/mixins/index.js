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
    }
  }
})
