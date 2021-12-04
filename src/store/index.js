import { createStore } from "vuex";
import auth from './modules/auth'
import shop from './modules/shop'
import createPersistedState from "vuex-persistedstate";

const dataState = createPersistedState({
  paths: ['auth']
})


export default createStore({
  modules: {
    shop: shop,
    auth: auth
  },
  plugins: [dataState]
})
