<!--
    登录界面
    Created by liubf on 2018/01/19
-->
<template>
    <el-col :span="24" class="login-main">
        <h3><img :src="img.logo">登录系统</h3>
        <el-form :model="loginInfo" status-icon :rules="loginInfoRules" ref="loginInfo" class="loginInfo">
            <el-form-item prop="username">
                <el-input type="text" v-model="loginInfo.username" placeholder="请输入用户名" auto-complete="off" suffix-icon="el-icon-mobile-phone"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginInfo.password" placeholder="请输入密码" auto-complete="off" suffix-icon="el-icon-goods"></el-input>
            </el-form-item>
            <el-form-item style="padding-top:15px;margin-bottom:5px;">
                <el-checkbox v-model="recordUserName">记住用户名</el-checkbox>
                <el-button type="primary" @click="submitForm('loginInfo')" style="float:right;">
                    立即登录
                </el-button>
            </el-form-item>
        </el-form>
    </el-col>
</template>
<script>
import md5 from 'js-md5'
import logo from '../assets/img/logo.png'
export default {
    name: 'login',
    data() {
        return {
            img: {
                logo: logo
            },
            // 是否保存用户名
            recordUserName: true,
            // 账户密码
            loginInfo: {
                username: '',
                password: ''
            },
            // 较验规则
            loginInfoRules: {
                username: [{
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur'
                }]
            }
        }
    },
    created: function() {
        // 复制保存的用户名
        var _this = this;
        _this.loginInfo.username = _this.$c.getCookie('userName') || '';
        document.onkeydown = function(event) {
            var e = event || window.event;
            // 按 Esc
            if (e && e.keyCode === 13) {
                _this.submitForm('loginInfo');
            }
        };
    },
    methods: {
        // 提交登录数据
        submitForm: function(formName) {
            var _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.$c.ajax({
                        loading: false,
                        url: 'buche/api/manage/user',
                        data: {
                            reqAct: 'login',
                            userName: _this.loginInfo.username,
                            password: md5(_this.loginInfo.password).toUpperCase()
                        },
                        success: function(res) {
                            if (res.retCode === '0') {
                                sessionStorage.setItem('token', res.result.token);
                                sessionStorage.setItem('userFullName', res.result.userFullName);
                                if (_this.recordUserName) {
                                    _this.$c.setCookie('userName', _this.loginInfo.username);
                                } else {
                                    _this.$c.setCookie('userName', '');
                                }
                                location.href = '#/';
                                _this.$message.success({
                                    duration: 1500,
                                    message: '登录成功'
                                });
                            } else {
                                _this.$message.error({
                                    duration: 1500,
                                    message: res.retMsg
                                });
                            }
                        }
                    });
                }
            });
        }
    }
};
</script>
<style scoped lang="less">
.login-main {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    margin-top: 150px;
    width: 50%;
    max-width: 400px;
    min-width: 300px;
    padding: 30px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 1px 1px 5px #ababab;
    .el-input__inner {
        height: 45px;
    }
    h3 {
        text-align: center;
        padding-bottom: 30px;
        font-size: 20px;
        img {
            display: inline-block;
            width: 50px;
            vertical-align: middle;
            margin-right: 10px;
        }
    }
}
</style>
