<!--
    顶部Bar
    Created by liubf on 2018/01/19
-->
<template>
    <el-row id="navBar">
        <el-col :span="24">
            <img :src="img.logo" style="width: 50px;position: absolute;top: 10px;left: 15px;">
            <i class="menuIcon el-icon-menu" @click="toggleMenu"></i>
            <ul class="navBar_tip">
                <li class="userName navBar_userName">
                    超级管理员(中心站)
                    <div class="navBarMenu">
                        <!-- <span>修改密码</span> -->
                        <span id='logout' @click="logout">安全退出</span>
                    </div>
                </li>
            </ul>
        </el-col>
    </el-row>
</template>
<script>
import logo from '../assets/img/logo.png'
export default {
    name: 'navBar',
    data() {
        return {
            img: {
                logo: logo
            }
        }
    },
    methods: {
        // 展示隐藏菜单栏
        toggleMenu: function() {
            var appClass = this.$c.$('#app').getAttribute('class') ? this.$c.$('#app').getAttribute('class') : '';
            if (appClass && appClass.indexOf('activeHideMenu') > -1) {
                this.$c.$('#app').setAttribute('class', appClass.replace(/ activeHideMenu/g, ''));
            } else {
                this.$c.$('#app').setAttribute('class', appClass + ' activeHideMenu');
            }
        },
        logout: function() {
            this.$c.logout();
        }
    },
    computed: {
        name() {
            var realname = this.$store.state.baseInfo.realname ? this.$store.state.baseInfo.realname + '(' : ''
            var role_name = this.$store.state.baseInfo.role_name ? this.$store.state.baseInfo.role_name + ')' : ''
            return realname + role_name
        }
    }
}
</script>
<style lang="less" scoped>
.activeHideMenu #navBar {
    padding-left: 0;
}

#navBar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 70px;
    background: #4E9BEA;
    z-index: 101;
    .menuIcon {
        font-size: 25px;
        padding: 12px;
        margin-top: 10px;
        margin-left: 62px;
        color: #fff;
        cursor: pointer;
    }
    .navBar_tip {
        float: right;
        font-size: 13px;
        min-height: 70px;
        line-height: 70px;
        color: #fff;
        padding-right: 40px;
        li {
            position: relative;
            display: inline-block;
            margin: 0 5px;
            a {
                color: #f9ff9c;
                text-decoration: none;
            }
            &.bbin {
                label {
                    color: #f9ff9c;
                }
            }
            &.navBar_userName {
                padding: 0 10px;
                cursor: pointer;
                .navBarMenu {
                    display: none;
                    position: absolute;
                    width: 130px;
                    background: #fff;
                    color: #555;
                    padding: 14px 0;
                    padding-left: 0;
                    right: 0;
                    top: 58px;
                    border: 1px solid #dfdfdf;
                    span {
                        display: block;
                        font-size: 14px;
                        text-align: center;
                        line-height: 1;
                        padding: 10px 0;
                        &:hover {
                            background: #dfdfdf;
                            cursor: pointer;
                        }
                    }
                }
            }
            &.navBar_userName:hover {
                background-color: #3d85d0;
                .navBarMenu {
                    display: inline-block;
                }
            }
        }
    }
}

@media screen and (max-width: 460px) {
    #navBar .navBar_tip li {
        display: none;
    }
    #navBar .navBar_tip li:nth-last-child(1) {
        display: block;
    }
    .navBar_tip {
        padding-right: 0!important;
    }
}
</style>
