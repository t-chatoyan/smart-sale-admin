import { http } from '../../../api'

const book = {
  namespaced: true,
  state: {
    shop: {},
    shopsList: []
  },
  actions: {
    getShops: ({ commit }, params) => {
      let url = '/shop';
      if (params) {
        const q = new URLSearchParams(params)
        url = url + '?' + q.toString()
      }
      return http.get(url).then(res => {
        commit('setShopsList', res.data.data)
        return res.data
      })
    },
    getShop: ({ commit }, params) => {
      console.log('params', params);
      return http.get(`shop/${params}`).then(res => {
        commit('setShop', res.data.data)
        return res.data
      })
    }
  },
  mutations: {
    setShopsList (state, data) {
      state.shopsList = data
    },
    setShop (state, data) {
      state.shop = data
    },
  },
  getters: {
    shopsList: state => state.shopsList
  }
};

export default book
