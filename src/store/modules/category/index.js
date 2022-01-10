import { http } from '../../../api'

const category = {
  namespaced: true,
  state: {
    category: {},
    categoriesList: []
  },
  actions: {
    getCategories: ({ commit }, params) => {
      let url = '/category';
      if (params) {
        const q = new URLSearchParams(params)
        url = url + '?' + q.toString()
      }
      return http.get(url).then(res => {
        commit('setCategoriesList', res.data.data)
        return res.data
      })
    },
    getCategory: ({ commit }, params) => {
      console.log('params', params);
      return http.get(`category/${params}`).then(res => {
        commit('setCategories', res.data.data)
        return res.data
      })
    }
  },
  mutations: {
    setCategoriesList (state, data) {
      state.categoriesList = data
    },
    setCategories (state, data) {
      state.category = data
    },
  },
  getters: {
    categoriesList: state => state.categoriesList,
    category: state => state.category
  }
};

export default category
