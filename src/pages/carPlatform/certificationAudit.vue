<!--
    认证审核列表
    Created by liubf on 2018/01/19
-->
<template>
    <div class='certificationAudit' v-if="isShow">
        <el-col :span="24" class="title">待审核</el-col>
        <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;'>
            <el-table-column prop='userId' label='车商编号'>
            </el-table-column>
            <el-table-column prop='userName' label='车商名称'>
            </el-table-column>
            <el-table-column prop='userTel' label='联系电话'>
            </el-table-column>
            <el-table-column prop='type' label='车行性质'>
            </el-table-column>
            <el-table-column prop='regDate' label='提交日期'>
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope='scope'>
                    <el-button type="primary" size='small' @click='lookDetail(tableData[scope.$index].userId)'>审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="total>10" @current-change="currentChange" background layout='prev, pager, next' :total='total'>
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'certificationAudit',
    data() {
        return {
            isShow: false,
            total: 0,
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
            name: '认证审核'
        }];
        this.request();
    },
    methods: {
        lookDetail(id) {
            location.hash = '#/carPlatform/certificationAuditDetail?id=' + id;
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
                    reqAct: 'checkList',
                    pageNo: _this.searchData.pageNo,
                    pageSize: _this.searchData.pageSize
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
                                regDate: item.regDate
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
.certificationAudit {
    .title {
        font-weight: bold;
        font-size: 16px;
        margin: 10px 10px 20px;
    }
    .searchBar {
        margin-bottom: 20px;
        .el-col {
            margin-right: 10px;
        }
        button {
            margin-top: 4px;
        }
    }
}
</style>
