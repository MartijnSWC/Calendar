import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import TextareaAutosize from 'vue-textarea-autosize'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import Datetime  from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.component('v-selector', vSelect)
Vue.use(Datetime)
Vue.use(VueAxios, axios)
Vue.use(TextareaAutosize)
Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
