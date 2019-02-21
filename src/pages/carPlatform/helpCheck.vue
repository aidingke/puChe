<!--
    帮检预约列表
    Created by liubf on 2018/04/25
-->
<template>
    <div class='helpCheck' v-if="isShow">
        <el-col :span='24' class='searchBar'>
            <el-col :span='3' :xs="11">
                <el-input v-model="searchData.contactUser" placeholder="联系人"></el-input>
            </el-col>
            <el-col :span='3' :xs="11">
                <el-input v-model="searchData.contactTel" placeholder="联系电话"></el-input>
            </el-col>
            <el-col :span='4' :xs="11">
                <el-date-picker v-model="searchData.bookDate" type="date" placeholder="预约时间" value-format="yyyy-MM-dd" :picker-options="startPicker" :editable="false">
                </el-date-picker>
            </el-col>
            <el-col :span='4' :xs="11">
                <el-date-picker v-model="searchData.addTime" type="date" placeholder="下单时间" value-format="yyyy-MM-dd" :picker-options="startPicker" :editable="false">
                </el-date-picker>
            </el-col>
            <el-col :span='2'>
                <el-button type="primary" size="small" @click="searchFun">搜索</el-button>
            </el-col>
        </el-col>
        <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;'>
            <el-table-column prop='id' label='序号'>
            </el-table-column>
            <el-table-column prop='vin' label='车架号'>
            </el-table-column>
            <el-table-column prop='carFullName' label='车系车型'>
            </el-table-column>
            <el-table-column prop='detectionFee' label='检测费(元)'>
            </el-table-column>
            <el-table-column prop='contactUser' label='联系人'>
            </el-table-column>
            <el-table-column prop='contactTel' label='联系人电话'>
            </el-table-column>
            <el-table-column prop='bookDate' label='预约时间'>
            </el-table-column>
            <el-table-column prop='addTime' label='下单时间'>
            </el-table-column>
            <el-table-column prop='orgName' label='预约检测站'>
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope='scope'>
                    <el-button v-if="tableData[scope.$index].orderStatus=='5'" type="primary" size='small' @click='refund(tableData[scope.$index].id)'>退款</el-button>
                    <template v-if="tableData[scope.$index].orderStatus!='5'">-</template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="total>searchData.pageSize" @current-change="currentChange" background layout='prev, pager, next' :total='total' :page-size='searchData.pageSize'>
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'helpCheck',
    data() {
        return {
            isShow: false,
            total: 0,
            startPicker: {
                disabledDate(time) {
                    return time.getTime() >= Date.now();
                }
            },
            search: {
                userId: '',
                userName: '',
                userTel: ''
            },
            searchData: {
                pageNo: 1,
                pageSize: 10,
                contactUser: '',
                contactTel: '',
                bookDate: '',
                addTime: ''
            },
            tableData: []
        }
    },
    created: function() {
        this.$store.state.breadcrumb = [{
            path: '/',
            name: '捕车平台'
        }, {
            name: '帮检预约'
        }];
        this.request();
    },
    methods: {
        refund: function(id) {
            var _this = this;
            this.$confirm('确认退款么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$c.ajax({
                    url: 'buche/api/helpTrade',
                    data: {
                        reqAct: 'applyRefundByManager',
                        id: id
                    },
                    success: function(res) {
                        if (res.retCode === '0') {
                            _this.$message({
                                message: res.retMsg,
                                type: 'success'
                            });
                        } else {
                            _this.$message.error({
                                duration: 1500,
                                message: res.retMsg
                            });
                        }
                    }
                });
            }).catch(() => {

            });
        },
        searchFun: function() {
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
                    reqAct: 'heplDectionList',
                    pageNo: _this.searchData.pageNo,
                    pageSize: _this.searchData.pageSize,
                    contactUser: _this.searchData.contactUser,
                    contactTel: _this.searchData.contactTel,
                    bookDate: _this.searchData.bookDate,
                    addTime: _this.searchData.addTime
                },
                success: function(res) {
                    _this.isShow = true;
                    if (res.retCode === '0') {
                        var arr = [];
                        res.result.bookList.forEach(function(item) {
                            var o = {
                                id: item.id,
                                vin: item.vin,
                                carFullName: item.carFullName,
                                detectionFee: item.detectionFee,
                                contactUser: item.contactUser,
                                contactTel: item.contactTel,
                                bookDate: item.bookDate,
                                addTime: item.addTime,
                                orgName: item.orgName,
                                orderStatus: item.orderStatus
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
.helpCheck {
    .searchBar {
        margin-bottom: 20px;
        .el-col {
            margin-right: 10px;
        }
        button {
            margin-top: 4px;
        }
    }
    .el-date-editor {
        width: 100%;
    }
}
</style>
