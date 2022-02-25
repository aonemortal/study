import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/common.scss'
import './plugins/element'
import { Message } from 'element-ui'
import api from './network'
import AsyncComputed from 'vue-async-computed'
import store from "./store/vuex.js"
import ant from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(ant)
Vue.use(AsyncComputed)

Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$Message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// 跳转页面后 滚动条回到最顶部
// router.beforeEach((to, from, next) => {

//   // chrome

//   document.body.scrollTop = 0

//   // firefox

//   document.documentElement.scrollTop = 0

//   // safari

//   window.pageYOffset = 0

//   next()

// })
