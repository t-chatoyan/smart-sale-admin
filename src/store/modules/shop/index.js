import { http } from '../../../api'

const shop = {
  namespaced: true,
  state: {
    shop: {},
    shopsList: [],
    userShopsList: []
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
    getUserShops: ({ commit }) => {
      let url = '/all-shops';
      return http.get(url).then(res => {
        commit('setUserShopsList', res.data.data)
        return res.data
      })
    },
    getShop: ({ commit }, params) => {
      return http.get(`/shop/${params}`).then(res => {
        commit('setShop', res.data.data);
        return res.data
      })
    },
    createShop: ({ commit }, params) => {
      return http.post(`/shop`, params).then(res => {
        commit('createShop', res.data.data);
        return res.data
      })
    },
    updateShop: ({ commit }, params) => {
      return http.post(`/shop-update/${params.id}`, params.data).then(res => {
        commit('updateShop', res.data.data);
        return res.data
      })
    },
    deleteShop: ({ commit }, params) => {
      return http.delete(`/shop/${params.id}`).then(res => {
        commit('deleteShop', {data: res.data, id: params.id});
        return res.data
      })
    },
    deleteBranch: ({ commit }, params) => {
      return http.delete(`/delete-shop-branch/${params.id}`).then(res => {
        commit('deleteBranch', {data: res.data, id: params.id});
        return res.data
      })
    },
    restoreShop: ({ commit }, params) => {
      return http.get(`/shop/${params.id}/restore`).then(res => {
        commit('restoreShop', {data: res.data, id: params.id});
        return res.data
      })
    }
  },
  mutations: {
    setShopsList (state, data) {
      state.shopsList = data
    },
    createShop (state, data) {
      state.shopsList.unshift(data)
      state.userShopsList.unshift(data)
    },
    updateShop (state, data) {
      state.shopsList.map(item => {
        if (item.id === data.id) {
          return data
        }
        return item
      })
      state.userShopsList.map(item => {
        if (item.id === data.id) {
          return data
        }
        return item
      })
    },
    setUserShopsList (state, data) {
      state.userShopsList = data
    },
    setShop (state, data) {
      state.shop = data
    },
    deleteShop (state, data) {
      if (data.data.deleteType === 'delete') {
        state.shopsList.map(item => {
          if (item.id === data.id) {
            item.status = 'inactive'
          }
        });
        state.userShopsList.map(item => {
          if (item.id === data.id) {
            item.status = 'inactive'
          }
        })
      } else {
        state.shopsList = state.shopsList.filter(item => item.id !== data.id)
        state.userShopsList = state.userShopsList.filter(item => item.id !== data.id)
      }
    },
    deleteBranch (state, data) {
      console.log(state, data);
    },
    restoreShop (state, data) {
      state.shopsList.map(item => {
        if (item.id === data.id) {
          item.status = 'active'
        }
      });
      state.userShopsList.map(item => {
        if (item.id === data.id) {
          item.status = 'active'
        }
      })
    },
  },
  getters: {
    shopsList: state => state.shopsList,
    userShopsList: state => state.userShopsList
  }
};

export default shop
