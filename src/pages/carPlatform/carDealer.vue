<!--
    车商管理列表
    Created by liubf on 2018/01/19
-->
<template>
    <div class='carDealer' v-if="isShow">
        <el-col :span='24' class='searchBar'>
            <el-col :span='4' :xs="11">
                <el-input v-model="search.userId" placeholder="车商编号"></el-input>
            </el-col>
            <el-col :span='4' :xs="11">
                <el-input v-model="search.userName" placeholder="车商名称"></el-input>
            </el-col>
            <el-col :span='4' :xs="11">
                <el-input v-model="search.userTel" placeholder="联系电话"></el-input>
            </el-col>
            <el-col :span='2'>
                <el-button type="primary" size="small" @click="searchFun">搜索</el-button>
            </el-col>
        </el-col>
        <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;'>
            <el-table-column prop='userId' label='车商编号'>
            </el-table-column>
            <el-table-column prop='userName' label='车商名称'>
            </el-table-column>
            <el-table-column prop='userTel' label='联系电话'>
            </el-table-column>
            <el-table-column prop='type' label='车行性质'>
            </el-table-column>
            <el-table-column prop='isAuth' label='是否认证'>
            </el-table-column>
            <el-table-column prop='regDate' label='注册日期'>
            </el-table-column>
            <el-table-column prop='authDate' label='认证日期'>
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope='scope'>
                    <el-button type="primary" size='small' @click='lookDetail(tableData[scope.$index].userId)'>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="total>searchData.pageSize" @current-change="currentChange" background layout='prev, pager, next' :total='total'>
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'carDealer',
    data() {
        return {
            isShow: false,
            total: 0,
            search: {
                userId: '',
                userName: '',
                userTel: ''
            },
            searchData: {
                pageNo: 1,
                pageSize: 10,
                userId: '',
                userName: '',
                userTel: ''
            },
            tableData: []
        }
    },
    created: function() {
        this.$store.state.breadcrumb = [{
            path: '/',
            name: '捕车平台'
        }, {
            name: '车商管理'
        }];
        this.request();
    },
    methods: {
        lookDetail(id) {
            location.hash = '#/carPlatform/carDealerDetail?id=' + id;
        },
        // 修改搜索条件
        searchFun: function() {
            this.searchData.userId = this.search.userId;
            this.searchData.userName = this.search.userName;
            this.searchData.userTel = this.search.userTel;
            this.searchData.pageNo = 1;
            this.request();
        },
        // 当前页码改变事件
        currentChange: function(pageNo) {
            this.searchData.pageNo = pageNo;
            this.request();
        },
        request: function() {
            var _this = this;
            _this.$c.ajax({
                url: 'buche/api/manage/dealer',
                data: {
                    reqAct: 'list',
                    pageNo: _this.searchData.pageNo,
                    pageSize: _this.searchData.pageSize,
                    id: _this.searchData.userId,
                    name: _this.searchData.userName,
                    tel: _this.searchData.userTel
                },
                success: function(res) {
                    _this.isShow = true;
                    if (res.retCode === '0') {
                        var arr = [];
                        res.result.dealerList.forEach(function(item) {
                            var o = {
                                userId: item.id,
                                userName: item.name,
                                userTel: item.tel,
                                type: item.type === '0' ? '企业' : '个人',
                                isAuth: item.isAuth === '0' ? '未认证' : '已认证',
                                regDate: item.regDate,
                                authDate: item.authDate
                            }
                            arr.push(o);
                        });
                        _this.total = res.result.totalCnt;
                        _this.tableData = arr;
                    } else {
                        _this.$message.error({
                            duration: 1500,
                            message: res.retMsg
                        });
                    }
                }
            });
        }
    }
}
</script>
<style scoped lang='less'>
.carDealer {
    .searchBar {
        margin-bottom: 10px;
        .el-col {
            margin-right: 10px;
            margin-bottom: 10px;
        }
        button {
            margin-top: 4px;
        }
    }
}
</style>
