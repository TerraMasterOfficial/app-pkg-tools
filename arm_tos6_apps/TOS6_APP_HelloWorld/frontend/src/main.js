import Vue from 'vue'
import router from '@/router'
import store from '@/store/index'
import App from '@/App.vue'
import "@/util/scss/reset.scss"
import {
  optionalChaining,
    MakeText,
} from '@/util/util';

Vue.prototype.$optionalChaining = optionalChaining; // 注册可选链
Vue.prototype.MakeText = MakeText;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
