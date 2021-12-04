import { http } from '../../../api'

const auth = {
  namespaced: true,
  state: {
    user: {},
    isAuthenticated: false,
    token: null
  },
  actions: {
    getNewPassword: ({ commit }, params) => {
      return http.post('/forgot-password', params).then(res => {
        commit('userLogin', res.data)
      })
    },
    login: ({ commit }, params) => {
      return http.post('/login', params).then(res => {
        commit('userLogin', res.data)
      })
    },
    logout: ({ commit }) => {
      return http.get('/logout').then(() => {
        commit('userLogout')
      })
    }
  },
  mutations: {
    userLogin (state, data) {
      const accessToken = data.access_token
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      http.defaults.headers.common.Authorization = accessToken
      state.isAuthenticated = true
      state.token = accessToken
      state.user = data.user
    },
    userLogout (state) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      http.defaults.headers.common.Authorization = ''
      state.isAuthenticated = false
      state.access_token = null
      state.user = null
    },
    setUser (state, data) {
      state.user = data
    }
  },
  getters: {
    user: state => state.user,
    isAuthenticated: state => state.isAuthenticated
  }
}

export default auth
