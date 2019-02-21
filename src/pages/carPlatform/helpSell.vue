<!--
    帮卖管理列表
    Created by liubf on 2018/05/15
-->
<template>
    <div class='helpSell' v-if="isShow">
        <el-col :span='24' class='searchBar'>
            <el-col :span='3' :xs="11">
                <el-input v-model="searchData.carNo" placeholder="车源编号"></el-input>
            </el-col>
            <el-col :span='3' :xs="11">
                <el-select v-model="searchData.status" placeholder="所有状态">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span='2'>
                <el-button type="primary" size="small" @click="request">搜索</el-button>
            </el-col>
        </el-col>
        <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;'>
            <el-table-column prop='carNo' label='车源编号'>
            </el-table-column>
            <el-table-column prop='brand' label='车系车型'>
            </el-table-column>
            <el-table-column prop='name' label='车辆来源'>
            </el-table-column>
            <el-table-column prop='updateTime' label='最后操作时间'>
            </el-table-column>
            <el-table-column prop='statusDes' label='状态'>
            </el-table-column>
            <el-table-column prop='remark' label='操作说明'>
            </el-table-column>
            <el-table-column label='操作' min-width="320px">
                <template slot-scope='scope'>
                    <template v-if="tableData[scope.$index].flag=='1'">
                        <el-button type="primary" size='small' @click='lookCarReport(tableData[scope.$index].code)'>查看车况</el-button>
                        <el-button v-if="tableData[scope.$index].status=='0'" type="success" size='small' @click='auditPost(tableData[scope.$index].id)'>审核通过</el-button>
                        <el-button v-if="tableData[scope.$index].status=='0'" type="warning" size='small' @click="unAuditLayerShow(tableData[scope.$index].id)">审核不通过</el-button>
                    </template>
                    <el-button v-if="tableData[scope.$index].status=='1'||tableData[scope.$index].flag=='0'" type="danger" size='small' @click='soldOut(tableData[scope.$index].id)'>下架</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="dialogVisibleTitle" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :before-close="handleClose">
            <el-form :model='validateForm' :rules='rules' ref='validateForm'>
                <el-form-item prop='unAuditText'>
                    <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="validateForm.unAuditText" v-bind:value='validateForm.unAuditText'></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size='small'>取 消</el-button>
                <el-button type="primary" @click="dialogVisibleSureFun('validateForm')" size='small'>确 定</el-button>
            </span>
        </el-dialog>
        <el-pagination v-if="total>searchData.pageSize" @current-change="currentChange" background layout='prev, pager, next' :total='total' :page-size='searchData.pageSize'>
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'helpSell',
    data() {
        return {
            dialogVisible: false,
            dialogVisibleTitle: '',
            validateForm: {
                id: '',
                unAuditText: ''
            },
            rules: {
                unAuditText: [{
                    required: true,
                    message: '原因不能为空',
                    trigger: 'blur'
                }]
            },
            options: [{
                value: '',
                label: '全部状态'
            }, {
                value: '0',
                label: '待审核'
            }, {
                value: '1',
                label: '审核通过'
            }],
            isShow: false,
            total: 0,
            searchData: {
                pageNo: 1,
                pageSize: 10,
                carNo: '',
                status: ''
            },
            tableData: []
        }
    },
    created: function() {
        this.$store.state.breadcrumb = [{
            path: '/',
            name: '捕车平台'
        }, {
            name: '帮卖管理'
        }];
        this.request();
    },
    methods: {
        // 当前页码改变事件
        currentChange: function(pageNo) {
            this.searchData.pageNo = pageNo;
            this.request();
        },
        // 返回对应状态文案
        statusText: function(n) {
            return n === '0' ? '待审核' : n === '1' ? '审核通过' : '审核不通过';
        },
        // 列表数据请求
        request: function() {
            var _this = this;
            _this.$c.ajax({
                url: 'buche/api/manage/helpSell',
                data: {
                    reqAct: 'list',
                    pageNo: _this.searchData.pageNo,
                    pageSize: _this.searchData.pageSize,
                    carNo: _this.searchData.carNo,
                    status: _this.searchData.status
                },
                success: function(res) {
                    _this.isShow = true;
                    if (res.retCode === '0') {
                        var arr = [];
                        res.result.carList.forEach(function(item) {
                            var o = {
                                id: item.id,
                                carNo: item.carNo || '-',
                                name: item.name || '-',
                                updateTime: item.updateTime || '-',
                                status: item.status,
                                statusDes: _this.statusText(item.status) || '-',
                                remark: item.remark || '-',
                                code: item.rptUrl,
                                flag: item.flag,
                                brand: item.brand
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
        },
        // 查看车况
        lookCarReport: function(code) {
            var _this = this;
            var url = this.CONST.REPORT_URL + code;
            this.$alert('<iframe src="' + url + '" class="helpSellReportClassIframe">', '车况详情', {
                dangerouslyUseHTMLString: true,
                showConfirmButton: false,
                customClass: 'helpSellReportClass'
            }).catch(() => {
                _this.$c.$('.helpSellReportClassIframe')[0].style.width = '99.5%';
            });
            setTimeout(function() {
                _this.$c.$('.helpSellReportClassIframe')[0].style.width = '100%';
            }, 1000);
        },
        // 原因弹窗关闭按钮回调方法
        handleClose: function() {
            this.validateForm.unAuditText = '';
            this.dialogVisible = false;
        },
        // 原因弹窗确定回调方法
        dialogVisibleSureFun: function() {},
        // 不通过审核弹窗
        unAuditLayerShow: function(id) {
            this.dialogVisibleTitle = '审核不通过原因';
            this.dialogVisible = true;
            this.validateForm.id = id;
            this.dialogVisibleSureFun = this.unAudit;
        },
        // 不通过审核操作
        unAudit: function(formName) {
            var _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.postCheck(0, _this.validateForm.id);
                }
            });
        },
        // 通过审核弹窗
        auditPost: function(id) {
            var _this = this;
            this.$confirm('确认通过审核么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.postCheck(1, id);
            }).catch(() => {

            });
        },
        // 审核操作
        postCheck: function(oper, id) {
            var _this = this;
            var o = {
                reqAct: 'check',
                id: id,
                oper: oper,
                reason: _this.validateForm.unAuditText
            }
            _this.$c.ajax({
                url: 'buche/api/manage/car',
                data: o,
                success: function(res) {
                    if (res.retCode === '0') {
                        _this.$message({
                            message: res.retMsg,
                            type: 'success'
                        });
                        _this.reload();
                    } else {
                        _this.$message.error({
                            duration: 1500,
                            message: res.retMsg
                        });
                    }
                }
            });
        },
        // 下架弹窗
        soldOut: function(id) {
            var _this = this;
            _this.dialogVisibleTitle = '下架原因';
            _this.dialogVisible = true;
            _this.validateForm.id = id;
            this.dialogVisibleSureFun = this.soldOutFun;
        },
        // 下架操作
        soldOutFun: function(formName) {
            var _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    var o = {
                        reqAct: 'helpSellsoldOut',
                        carId: _this.validateForm.id,
                        reason: _this.validateForm.unAuditText
                    }
                    _this.$c.ajax({
                        url: 'buche/api/manage/helpSell',
                        data: o,
                        success: function(res) {
                            if (res.retCode === '0') {
                                _this.$message({
                                    message: res.retMsg,
                                    type: 'success'
                                });
                                _this.reload();
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
<style scoped lang='less'>
.helpSell {
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
<style lang="less">
.helpSellReportClass {
    height: 80%;
    width: 401px;
    .el-message-box__content {
        position: relative;
        width: 100%;
        height: 96%;
        padding: 0;
        .el-message-box__message,
        p {
            height: 100%;
        }
        iframe.helpSellReportClassIframe {
            width: 99.5%;
            height: 100%;
            border: 0;
        }
    }
}
</style>
