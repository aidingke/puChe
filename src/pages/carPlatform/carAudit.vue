<!--
    车源审核列表
    Created by liubf on 2018/01/19
-->
<template>
    <div class='carAudit' v-if="isShow">
        <el-col :span="24" class="title">车源审核</el-col>
        <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;'>
            <el-table-column prop='carNo' label='车源编号'>
            </el-table-column>
            <el-table-column prop='userName' label='车辆来源'>
            </el-table-column>
            <el-table-column prop='brand' label='品牌型号'>
            </el-table-column>
            <el-table-column prop='price' label='起拍价(万元)'>
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope='scope'>
                    <el-button type="primary" size='small' @click='lookDetail(tableData[scope.$index].userId)'>审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="total>searchData.pageSize" @current-change="currentChange" background layout='prev, pager, next' :total='total'>
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'carAudit',
    data() {
        return {
            isShow: false,
            total: 0,
            tableData: [{
                userId: '',
                carNo: '',
                userName: '',
                brand: '',
                price: ''
            }],
            searchData: {
                pageNo: 1,
                pageSize: 10
            }
        }
    },
    created: function() {
        this.$store.state.breadcrumb = [{
            path: '/',
            name: '捕车平台'
        }, {
            name: '车源审核'
        }];
        this.request();
    },
    methods: {
        lookDetail(id) {
            location.hash = '#/carPlatform/carAuditDetail?id=' + id;
        },
        // 当前页码改变事件
        currentChange: function(pageNo) {
            this.searchData.pageNo = pageNo;
            this.request();
        },
        request: function() {
            var _this = this;
            _this.$c.ajax({
                url: 'buche/api/manage/car',
                data: {
                    reqAct: 'list',
                    pageNo: _this.searchData.pageNo,
                    pageSize: _this.searchData.pageSize
                },
                success: function(res) {
                    _this.isShow = true;
                    if (res.retCode === '0') {
                        var arr = [];
                        res.result.carList.forEach(function(item) {
                            var o = {
                                userId: item.id,
                                carNo: item.carNo,
                                userName: item.name,
                                brand: item.brand.replace(/其他/g, ''),
                                price: _this.$c.setMoney(item.price)
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
.carAudit {
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
