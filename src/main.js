import { createApp } from 'vue'
import './scss/style.scss'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import BootstrapVue3 from 'bootstrap-vue-3'
import CKEditor from '@ckeditor/ckeditor5-vue';

import App from './App.vue'
import axios from 'axios';
import {http} from './api/index';
import router from './router';
import eventBus from './eventBus'
import store from './store'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(CKEditor)
  .use(VueSweetalert2)
  .use(BootstrapVue3);

app.config.globalProperties.$api = http;
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$eventBus = eventBus;
app.mount('#app');