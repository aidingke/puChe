import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routeConfig from './router'
import store from './store/store'
// 挂载全局api
import api from './api/api.js'
// 挂载全局常量
import config from './api/config.js'
// element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(config)
Vue.use(api)
Vue.http.options.emulateJSON = true;
// 定义路由
const router = new VueRouter({
    base: '/bucheManage/',
    routes: routeConfig
});

let vm = new Vue({
    el: '#app',
    router,
    store,
    template: '#app',
    render: h => h(App)
});

Vue.use({
    vm
});
