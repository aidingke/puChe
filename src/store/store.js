import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    // 菜单列表
    menuList: [],
    // 用户基本信息
    baseInfo: {

    },
    breadcrumb: [],
    // 进登录页
    login: true
}
export default new Vuex.Store({
    state
});
