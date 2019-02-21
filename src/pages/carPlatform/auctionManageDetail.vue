<!--
    竞拍管理详情
    Created by liubf on 2018/01/19
-->
<template>
    <div class='auctionManageDetail' v-if="isShow">
        <el-alert :title="errorMessage" :closable="false" type="error" center show-icon v-if="errorMessage"></el-alert>
        <el-col :span="24" v-if="!errorMessage">
            <el-col :span="24" class="title">{{title}}</el-col>
            <baseInfoTable :billBaseInfo="billBaseInfo"></baseInfoTable>
            <el-col :span="24" class="title">检测报告</el-col>
            <el-col :span="24" class="report">
                <iframe :src="rptUrl"></iframe>
            </el-col>
            <el-col :span="24" class="auctionManageBtn">
                <el-button v-if="btn[0]" @click="delStatus">{{btnDelText}}</el-button>
                <el-button v-if="btn[1]" type="primary" @click="dialogVisible = true">{{btnSetText}}</el-button>
            </el-col>
            <el-dialog v-if="btn[1]" :title="btnSetText" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :before-close="handleClose">
                <el-form :model='validateForm' :rules='rules' ref='validateForm' label-width="80px">
                    <el-form-item label="竞拍时间" prop='time'>
                        <el-date-picker v-model="validateForm.time" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" v-bind:value="validateForm.time" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="startPicker" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="加价幅度" prop='addPrice'>
                        <el-input placeholder="请输入加价幅度" v-model="validateForm.addPrice" v-bind:value="validateForm.addPrice"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose" size='small'>取 消</el-button>
                    <el-button type="primary" @click="unAudit('validateForm')" size='small'>确 定</el-button>
                </span>
            </el-dialog>
        </el-col>
    </div>
</template>
<script>
import baseInfoTable from '../../components/carPlatform/baseInfoTable.vue' // table
export default {
    name: 'auctionManageDetail',
    data() {
        return {
            isShow: false,
            dialogVisible: false,
            errorMessage: '',
            title: '',
            btn: [false, false],
            btnDelText: '',
            btnSetText: '',
            startPicker: {
                disabledDate(time) {
                    return time.getTime() <= Date.now() - 8.64e7;
                }
            },
            validateForm: {
                time: '',
                addPrice: ''
            },
            rules: {
                time: [{
                    required: true,
                    message: '请选择竞拍时间',
                    trigger: 'blur'
                }],
                addPrice: [{
                    required: true,
                    message: '请填写加价幅度',
                    trigger: 'blur'
                }, {
                    validator: this.$c.eVR.money,
                    trigger: 'blur'
                }]
            },
            billBaseInfo: [],
            rptUrl: ''
        }
    },
    created: function() {
        this.request();
    },
    methods: {
        request: function() {
            var _this = this;
            var type = _this.$route.query.type;
            var url = type === '3' ? 'buche/api/manage/car' : 'buche/api/manage/auction';
            var reqAct = type === '3' ? 'carDetail' : 'detail';
            _this.$store.state.breadcrumb = [{
                path: '/',
                name: '捕车平台'
            }, {
                path: '/carPlatform/auctionManage?type=' + type,
                name: '竞拍管理'
            }, {
                name: '详情'
            }];
            _this.setLmit(type);
            _this.$c.ajax({
                url: url,
                data: {
                    reqAct: reqAct,
                    auctionId: _this.$route.query.id,
                    id: _this.$route.query.id
                },
                success: function(res) {
                    _this.isShow = true;
                    if (res.retCode === '0') {
                        _this.rptUrl = _this.CONST.REPORT_URL + res.result.rptUrl;
                        _this.billBaseInfo = [];

                        _this.setObj(_this.billBaseInfo, 0, '车商编号', res.result.id);
                        _this.setObj(_this.billBaseInfo, 1, '品牌型号', res.result.brand.replace(/其他/g, ''));
                        _this.setObj(_this.billBaseInfo, 2, '车商来源', res.result.name);
                        _this.setObj(_this.billBaseInfo, 3, '起拍价格（万元）', _this.$c.setMoney(res.result.startPrice || res.result.price));

                        // 未开拍
                        if (type === '2') {
                            _this.validateForm.time = [res.result.startTime, res.result.endTime];
                            _this.validateForm.addPrice = res.result.raiseRange;
                            _this.setObj(_this.billBaseInfo, 4, '开始时间', res.result.startTime);
                            _this.setObj(_this.billBaseInfo, 5, '结束时间', res.result.endTime);
                            _this.setObj(_this.billBaseInfo, 6, '加价幅度', '￥ ' + _this.$c.setMoney(res.result.raiseRange));
                        }
                        // 竞拍中、竞拍结束
                        if (type === '0' || type === '1') {
                            _this.setObj(_this.billBaseInfo, 4, '加价幅度', '￥ ' + _this.$c.setMoney(res.result.raiseRange));
                            _this.setObj(_this.billBaseInfo, 5, '出价商家', res.result.auctionUser);
                            _this.setObj(_this.billBaseInfo, 6, '当前价格（万元）', _this.$c.setMoney(res.result.currentPrice));
                            _this.setObj(_this.billBaseInfo, 7, '开始时间', res.result.startTime);
                            _this.setObj(_this.billBaseInfo, 8, '结束时间', res.result.endTime);
                        }
                    } else {
                        _this.errorMessage = res.retMsg;
                    }
                }
            });
        },
        // 下架车源、取消拍卖
        delStatus: function() {
            var _this = this;
            this.$confirm('确认' + _this.btnDelText + '么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$c.ajax({
                    url: 'buche/api/manage/auction',
                    data: {
                        reqAct: 'cancel',
                        auctionId: _this.$route.query.id,
                        carId: _this.$route.query.id,
                        oper: _this.$route.query.type === '3' ? '0' : '1'
                    },
                    success: function(res) {
                        if (res.retCode === '0') {
                            _this.$message({
                                message: res.retMsg,
                                type: 'success'
                            });
                            location.hash = '#/carPlatform/auctionManage?type=' + _this.$route.query.type;
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
        // 权限设置
        setLmit: function(type) {
            this.title = type === '3' ? '未安排详情' : type === '2' ? '待开拍详情' : type === '1' ? '竞拍中详情' : '竞拍结束详情';
            // 未安排
            if (type === '3') {
                this.btn = [true, true];
                this.btnSetText = '设置竞拍信息';
                this.btnDelText = '下架车源';
            }
            // 未开拍
            if (type === '2') {
                this.btn = [true, true];
                this.btnSetText = '修改竞拍信息';
                this.btnDelText = '取消拍卖';
            }
        },
        setObj: function(arr, index, key, value) {
            arr[index] = {
                key: key,
                value: value
            }
        },
        // 关闭竞拍信息弹窗
        handleClose: function() {
            this.validateForm.startTime = '';
            this.validateForm.endTime = '';
            this.validateForm.addPrice = '';
            this.dialogVisible = false;
        },
        // 设置、修改竞拍信息
        unAudit: function(formName) {
            var _this = this;
            var type = _this.$route.query.type;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    var o = {
                        reqAct: 'modifyTime',
                        carId: _this.$route.query.id,
                        auctionId: _this.$route.query.id,
                        price: _this.validateForm.addPrice,
                        startTime: _this.validateForm.time[0],
                        endTime: _this.validateForm.time[1]
                    }
                    _this.$c.ajax({
                        url: 'buche/api/manage/auction',
                        data: o,
                        success: function(res) {
                            if (res.retCode === '0') {
                                _this.$message({
                                    message: res.retMsg,
                                    type: 'success'
                                });
                                if (type === '3') {
                                    location.hash = '#/carPlatform/auctionManage?type=' + type;
                                } else {
                                    _this.dialogVisible = false;
                                    _this.$set(_this.billBaseInfo, 4, {
                                        key: '开始时间',
                                        value: _this.validateForm.time[0]
                                    });
                                    _this.$set(_this.billBaseInfo, 5, {
                                        key: '结束时间',
                                        value: _this.validateForm.time[1]
                                    });
                                    _this.$set(_this.billBaseInfo, 6, {
                                        key: '加价幅度',
                                        value: _this.validateForm.addPrice
                                    });
                                }
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
    },
    components: {
        baseInfoTable
    }
}
</script>
<style scoped lang='less'>
.auctionManageDetail {
    .title {
        font-weight: bold;
        font-size: 16px;
        margin: 10px 10px 20px;
    }
    .report {
        border: 1px solid #e0e0e0;
        height: 605px;
        iframe {
            width: 100%;
            height: 600px;
            border: 0;
        }
    }
    .auctionManageBtn {
        text-align: center;
        margin: 50px 0 50px;
    }
}
</style>
<style>
.auctionManageDetail .el-dialog__wrapper .el-dialog {
    min-width: 320px;
}
</style>
