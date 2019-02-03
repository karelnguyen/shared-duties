/**
 * State
 * @type {Object}
 */
const state = {
  email: ''
}

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  /**
   * Set current user email to store
   * @param {*} state
   * @param {String} payload
   */
  setUserEmail (state, payload) {
    state.email = payload
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
  }
}

export default {
  state,
  mutations,
  actions
}
