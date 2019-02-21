<!--
    vue模块入口文件
    Created by liubf on 2018/01/19
-->
<template>
    <div id='app' :class="login?'login':'run'">
        <navBar v-if='!login'></navBar>
        <navMenu v-if='!login' :navSelected='navSelected'></navMenu>
        <div id='contain'>
            <breadcrumb v-if='!login'></breadcrumb>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import './assets/css/common.less' // 全局样式
import com from './api/common.js' // 控制全局js
import navBar from './components/navBar.vue' // 顶部导航
import navMenu from './components/navMenu.vue' // 左侧菜单栏
import breadcrumb from './components/breadcrumb.vue' // 面包屑

export default {
    name: 'app',
    data() {
        return {
            navSelected: ''
        }
    },
    computed: {
        login() {
            return this.$store.state.login
        }
    },
    created: function() {
        if (location.hash.indexOf('login') === -1) {
            this.$store.state.login = false;
        }
    },
    mounted: function() {
        var _this = this;
        _this.$vue_api(_this);
        // 监听路由变化
        _this.$router.afterEach((to, from) => {
            if (location.hash.indexOf('login') > -1) {
                this.$store.state.login = true;
            } else {
                this.$store.state.login = false;
            }
            setTimeout(function() {
                _this.navSelected = to.path;
                window.scrollTo(0, 0);
            }, 50);
        });
        // 进入系统，全局控制
        if (!_this.$store.state.login) {
            com.init(_this);
        }
    },
    components: {
        navBar,
        navMenu,
        breadcrumb
    }
}
</script>
<style lang='less' scoped>
.run {
    &.activeHideMenu #contain {
        padding-left: 10px;
    }
    #contain {
        width: 100%;
        padding: 80px 20px 50px 260px;
        box-sizing: border-box;
        background-color: #fff;
    }
}

.login {
    background: #dfe0e2 url('./assets/img/pattern.jpg') repeat;
}
</style>
