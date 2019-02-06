import Vue from 'vue'
/**
 * State
 * @type {Object}
 */
const state = {
  email: '',
  ownGroups: [],
  foreignGroups: []
}

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  /**
   * Set user email to store
   * @param {*} state
   * @param {Array} payload
   */
  setUserEmail (state, payload) {
    state.email = payload
  },

  /**
   * Set own groups to store
   * @param {*} state
   * @param {Array} payload
   */
  setOwnGroups (state, payload) {
    Vue.set(state, 'ownGroups', payload)
  },

  /**
   * Set foreign groups to store
   * @param {*} state
   * @param {Array} payload
   */
  setForeignGroups (state, payload) {
    Vue.set(state, 'foreignGroups', payload)
  }
}

/**
 * Actions
 * @type {Object}
 */
const actions = {
  /**
   * Action part of setting current user email
   * @param {*} commit
   * @param {String} payload
   */
  setUserEmail ({ commit }, payload) {
    commit('setUserEmail', payload)
  },

  /**
   * Action part of setting user groups
   * @param {*} commit
   * @param {String} payload
   */
  setOwnGroups ({ commit }, payload) {
    commit('setOwnGroups', payload)
  },

  /**
   * Action part of setting user foreign groups
   * @param {*} commit
   * @param {String} payload
   */
  setForeignGroups ({ commit }, payload) {
    commit('setForeignGroups', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
