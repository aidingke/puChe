<!--
    面包屑
    Created by liubf on 2018/01/22
-->
<template>
    <el-breadcrumb separator-class='el-icon-arrow-right' style='margin:10px 10px 20px;'>
        <template v-for="(o,index) in arr">
            <span :key="index">
                <a @click="toRouter(o.path)" v-if="o.path">{{o.name}}</a>
                <a v-if="!o.path" @click="reload()">{{o.name}}</a>
                <i class="el-breadcrumb__separator el-icon-arrow-right" v-if="(index+1)<arr.length"></i>
            </span>
        </template>
    </el-breadcrumb>
</template>
<script>
export default {
    name: 'breadcrumb',
    computed: {
        arr() {
            return this.$store.state.breadcrumb
        }
    },
    methods: {
        // 前往其它页面
        toRouter: function(path) {
            location.hash = '#' + path;
        },
        // 刷新当前页
        reload: function() {
            var hash = location.hash;
            location.hash = '#/zeroPage';
            setTimeout(function() {
                location.hash = hash;
            }, 50);
        }
    }
}
</script>
<style scope>
a {
    cursor: pointer;
    font-weight: bold;
    color: #555;
}
</style>
