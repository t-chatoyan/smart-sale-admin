import { http } from '../../../api'

const product = {
  namespaced: true,
  state: {
    product: {},
    productsList: []
  },
  actions: {
    getProducts: ({ commit }, params) => {
      let url = '/product';
      if (params) {
        const q = new URLSearchParams(params)
        url = url + '?' + q.toString()
      }
      return http.get(url).then(res => {
        commit('setProductsList', res.data.data)
        return res.data
      })
    },
    getProduct: ({ commit }, params) => {
      return http.get(`/product/${params}`).then(res => {
        commit('setProduct', res.data.data)
        return res.data
      })
    },
    createProduct: ({ commit }, params) => {
      return http.post(`/product`, params).then(res => {
        commit('createProduct', res.data.data)
        return res.data
      })
    },
    updateProduct: ({ commit }, params) => {
      return http.post(`/product/${params.id}?_method=put`, params.data).then(res => {
        commit('updateProduct', res.data.data)
        return res.data
      })
    },
    deleteProduct: ({ commit }, params) => {
      return http.delete(`/product/${params.id}`).then(res => {
        commit('deleteProduct', {data: res.data, id: params.id})
        return res.data
      })
    },
    restoreProduct: ({ commit }, params) => {
      return http.get(`/product/${params.id}/restore`).then(res => {
        commit('restoreProduct', {data: res.data, id: params.id})
        return res.data
      })
    },
    deleteProductPhoto: () => {
      console.log('deleteProductPhoto');
    },
  },
  mutations: {
    createProduct (state, data) {
      state.productsList.unshift(data)
    },
    updateProduct (state, data) {
      state.productsList.map(item => {
        if (item.id === data.id) {
          return data
        }
        return item
      })
    },
    deleteProduct (state, data) {
      if (data.data.deleteType === 'delete') {
        state.productsList.map(item => {
          if (item.id === data.id) {
            item.status = 'inactive'
          }
        })
      } else {
        state.productsList = state.productsList.filter(item => item.id !== data.id)
      }
    },
    restoreProduct (state, data) {
      state.productsList.map(item => {
        if (item.id === data.id) {
          item.status = 'active'
        }
      })
    },
    setProductsList (state, data) {
      state.productsList = data.map(item => {
        item.subcategories = item.categories[1];
        item.categories = item.categories[0];
        return item
      })
    },
    setProduct (state, data) {
      state.product = data
    },
  },
  getters: {
    productsList: state => state.productsList,
    product: state => state.product
  }
};

export default product
