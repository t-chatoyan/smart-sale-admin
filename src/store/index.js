import { createStore } from "vuex";
import auth from './modules/auth'
import shop from './modules/shop'
import category from './modules/category'
import product from './modules/product'
import dashboard from './modules/dashboard'
import createPersistedState from "vuex-persistedstate";

const dataState = createPersistedState({
  paths: ['auth']
})


export default createStore({
  modules: {
    shop: shop,
    auth: auth,
    category: category,
    product: product,
    dashboard: dashboard,
  },
  plugins: [dataState]
})
