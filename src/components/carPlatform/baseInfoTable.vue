<!--
    四格Table
    Created by liubf on 2017/01/20
-->
<template>
    <el-col :span='24' class='baseInfoTable'>
        <table class='table'>
            <tbody>
                <tr v-for="(item,index) in baseInfo" :key="index">
                    <template v-for="(v,i) in item">
                        <td :key="'1'+i" style="width:16.67%;">
                            {{v.key}}
                        </td>
                        <td :key="'2'+i" style="width:33.33%;">
                            {{v.value}}
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>
    </el-col>
</template>
<script>
export default {
    name: 'baseInfoTable',
    computed: {
        baseInfo() {
            return this.setData(this.billBaseInfo);
        }
    },
    methods: {
        setData: function(data) {
            var arrs = [
                []
            ];
            if (!(data instanceof Array)) {
                data = [];
            }
            data.forEach(function(item, index) {
                if (arrs[(arrs.length - 1)].length < 2) {
                    arrs[(arrs.length - 1)].push(item);
                } else {
                    arrs.push([item]);
                }
            });
            return arrs;
        }
    },
    props: [
        'billBaseInfo'
    ]
}
</script>
<style lang="less" scoped>
.baseInfoTable {
    margin-bottom: 20px;
    .table {
        width: 100%;
        border-collapse: collapse;
        border-left: 1px solid #e0e0e0;
        border-top: 1px solid #e0e0e0;
        td {
            width: 25%;
            padding: 13px;
            background-color: #fff;
            border-bottom: 1px solid #e0e0e0;
            border-right: 1px solid #e0e0e0;
            background-color: #fff;
            min-height: 21px;
            word-break: break-all;
            word-wrap: break-word;
        }
    }
}
</style>
