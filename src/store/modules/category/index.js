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
      return http.get(`category/${params}`).then(res => {
        commit('setCategories', res.data.data)
        return res.data
      })
    },
    deleteCategory: ({ commit }, params) => {
      return http.delete(`/category/${params.id}`).then(res => {
        commit('deleteCategory', {data: res.data, id: params.id})
        return res.data
      })
    },
    restoreCategory: ({ commit }, params) => {
      return http.get(`/category/${params.id}/restore`).then(res => {
        commit('restoreCategory', {data: res.data, id: params.id})
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
    deleteCategory (state, data) {
      if (data.data.deleteType === 'delete') {
        state.categoriesList.map(item => {
          if (item.id === data.id) {
            item.status = 'inactive'
          }
        })
      } else {
        state.categoriesList = state.categoriesList.filter(item => item.id !== data.id)
      }
    },
    restoreCategory (state, data) {
      state.categoriesList.map(item => {
        if (item.id === data.id) {
          item.status = 'active'
        }
      })
    },
  },
  getters: {
    categoriesList: state => state.categoriesList,
    category: state => state.category
  }
};

export default category
