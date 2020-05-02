export const state = () => {
  return {
    user: null
  }
}

export const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

export const getters = {
  getUser: state => state.user
}

export const actions = {
  setUserCookie ({ commit }) {
    const user = this.$cookies.get('cookie-user')
    if (typeof user === 'object') {
      commit('setUser', user)
    }
  },
  setUser ({ commit }, user) {
    this.$cookies.set('cookie-user', user)
    this.$apolloHelpers.onLogin(user.token)
    commit('setUser', user)
  },
  removeUser ({ commit }) {
    this.$cookies.removeAll()
    this.$apolloHelpers.onLogout()
    commit('setUser', null)
  }
}
