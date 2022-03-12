import { http } from '../../../api'

const dashboard = {
  namespaced: true,
  state: {
    dashboard: {},
  },
  actions: {
    getDashboardData: ({ commit }) => {
      return http.get('/dashboard').then(res => {
        commit('setDashboardData', res.data.data)
        return res.data
      })
    },
  },
  mutations: {
    setDashboardData (state, data) {
      state.dashboard = data
    },
  },
  getters: {
    dashboard: state => state.dashboard,
  }
};

export default dashboard
