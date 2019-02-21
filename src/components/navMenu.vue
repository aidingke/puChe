<!--
    左侧菜单
    Created by liubf on 2018/01/19
-->
<template>
    <el-row id='navMenu'>
        <el-row class='menuItem'>
            <el-col :span='24'>
                <el-menu :default-active='navSelected' class='el-menu-vertical-demo'>
                    <el-submenu :index='o[0].id' v-for='(o, key) in menuList' :key='key'>
                        <template slot='title'>
                            <!-- <i :class='o[0].icon'></i> -->
                            <span>{{o[0].name}}</span>
                        </template>
                        <el-menu-item @click='jumpRuter(i.path)' :index="'/'+i.path" :data-path='i.path' :data-id='i.id' v-for='(i, v) in o[1]' :key='v'>{{i.name}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
    </el-row>
</template>
<script>
export default {
    name: 'navMenu',
    data () {
        return {

        }
    },
    computed: {
        menuList () {
            return this.$store.state.menuList
        },
        org_name () {
            return this.$store.state.baseInfo.org_name
        }
    },
    created: function () {
        var _this = this
        _this.$store.state.menuList = [
            [
                {
                    'rejectList': '',
                    'id': '2c91808260726e7e01608b62277f0214',
                    'parentId': '2c91808260726e7e01608b6169d00213',
                    'level': 1,
                    'order': '1',
                    'name': '捕车平台',
                    'path': 'bill',
                    'dataRule': '',
                    'icon': 'el-icon-edit'
                },
                [{
                    'rejectList': '',
                    'id': '2c91808260726e7e01608b63f9170215',
                    'parentId': '2c91808260726e7e01608b62277f0214',
                    'level': 2,
                    'order': '1',
                    'name': '车商管理',
                    'path': 'carPlatform/carDealer',
                    'dataRule': ''
                }, {
                    'rejectList': '',
                    'id': '2c91808260726e7e01608b63f9170215',
                    'parentId': '2c91808260726e7e01608b62277f0214',
                    'level': 2,
                    'order': '2',
                    'name': '认证审核',
                    'path': 'carPlatform/certificationAudit',
                    'dataRule': ''
                }, {
                    'rejectList': '',
                    'id': '2c91808260726e7e01608b656f390216',
                    'parentId': '2c91808260726e7e01608b62277f0214',
                    'level': 2,
                    'order': '3',
                    'name': '竞拍管理',
                    'path': 'carPlatform/auctionManage',
                    'dataRule': ''
                }, {
                    'rejectList': '',
                    'id': '2c91808260726e7e01608b65f8730217',
                    'parentId': '2c91808260726e7e01608b62277f0214',
                    'level': 2,
                    'order': '4',
                    'name': '车源审核',
                    'path': 'carPlatform/carAudit',
                    'dataRule': ''
                }, {
                    'rejectList': '',
                    'id': '',
                    'parentId': '',
                    'level': 2,
                    'order': '5',
                    'name': '帮检预约',
                    'path': 'carPlatform/helpCheck',
                    'dataRule': ''
                }, {
                    'rejectList': '',
                    'id': '',
                    'parentId': '',
                    'level': 2,
                    'order': '6',
                    'name': '帮卖管理',
                    'path': 'carPlatform/helpSell',
                    'dataRule': ''
                }]
            ]
        ]
    },
    methods: {
        // 地址跳转
        jumpRuter: function (src) {
            this.$router.push({
                path: ('/' + src)
            })
        }
    },
    props: [
        'navSelected'
    ]
}
</script>
<style lang='less' scoped>
.activeHideMenu #navMenu {
    left: -240px;
}

#navMenu {
    position: fixed;
    left: 0;
    top: 70px;
    bottom: 0;
    width: 240px;
    overflow-x: hidden;
    border-right: 1px solid #d4d4d4;
    background: #fff;
    z-index: 100;
    .fa {
        display: inline-block;
        width: 14px;
        height: 14px;
        text-align: center;
    }
    .el-row.menuItem {
        width: 270px;
        overflow: auto;
        .el-submenu__icon-arrow {
            left: 205px;
            right: auto;
        }
        .el-menu-item {
            height: 46px;
            line-height: 46px;
            i {
                margin-right: 5px;
            }
        }
    }
    .el-menu {
        border-right: 0;
        li {
            width: 240px;
            overflow: hidden;
        }
    }
}
</style>
<style scoped>
#navMenu .el-row.menuItem {
    height: 100%;
}
</style>
