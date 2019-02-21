<!--
    车源审核详情
    Created by liubf on 2018/01/19
-->
<template>
    <div class='carAuditDetail' v-if="isShow">
        <el-alert :title="errorMessage" :closable="false" type="error" center show-icon v-if="errorMessage"></el-alert>
        <el-col :span="24" v-if="!errorMessage">
            <el-col :span="24" class="title">车源审核详情</el-col>
            <baseInfoTable :billBaseInfo="billBaseInfo"></baseInfoTable>
            <el-col :span="24" class="title">检测报告</el-col>
            <el-col :span="24" class="report">
                <iframe :src="rptUrl"></iframe>
            </el-col>
            <el-col :span="24" class="auctionManageBtn">
                <el-button @click="dialogVisible = true">不通过</el-button>
                <el-button type="primary" @click="auditPost">审核通过</el-button>
            </el-col>
            <el-dialog title="不通过原因" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :before-close="handleClose">
                <el-form :model='validateForm' :rules='rules' ref='validateForm'>
                    <el-form-item prop='unAuditText'>
                        <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="validateForm.unAuditText" v-bind:value='validateForm.unAuditText'></el-input>
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
    name: 'carAuditDetail',
    data() {
        return {
            isShow: false,
            errorMessage: '',
            validateForm: {
                unAuditText: ''
            },
            rules: {
                unAuditText: [{
                    required: true,
                    message: '原因不能为空',
                    trigger: 'blur'
                }]
            },
            dialogVisible: false,
            billBaseInfo: [],
            rptUrl: ''
        }
    },
    created: function() {
        var _this = this;
        _this.$store.state.breadcrumb = [{
            path: '/',
            name: '捕车平台'
        }, {
            path: '/carPlatform/carAudit',
            name: '车源审核'
        }, {
            name: '详情'
        }];
        _this.$c.ajax({
            url: 'buche/api/manage/car',
            data: {
                reqAct: 'carDetail',
                id: _this.$route.query.id
            },
            success: function(res) {
                _this.isShow = true;
                if (res.retCode === '0') {
                    _this.rptUrl = _this.CONST.REPORT_URL + res.result.rptUrl;
                    _this.billBaseInfo = [];
                    for (var i = 0; i < 4; i++) {
                        _this.billBaseInfo[i] = {
                            'key': '',
                            'value': ''
                        };
                    }
                    _this.billBaseInfo[0].key = '车源编号';
                    _this.billBaseInfo[0].value = res.result.carNo;
                    _this.billBaseInfo[1].key = '车辆来源';
                    _this.billBaseInfo[1].value = res.result.name;
                    _this.billBaseInfo[2].key = '品牌型号';
                    _this.billBaseInfo[2].value = res.result.brand.replace(/其他/g, '');
                    _this.billBaseInfo[3].key = '起拍价格（万元）';
                    _this.billBaseInfo[3].value = _this.$c.setMoney(res.result.price);
                } else {
                    _this.errorMessage = res.retMsg;
                }
            }
        });
    },
    methods: {
        handleClose: function() {
            this.validateForm.unAuditText = '';
            this.dialogVisible = false;
        },
        unAudit: function(formName) {
            var _this = this;
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.postCheck(0);
                }
            });
        },
        auditPost: function() {
            var _this = this;
            this.$confirm('确认通过审核么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.postCheck(1);
            }).catch(() => {

            });
        },
        postCheck: function(oper) {
            var _this = this;
            var o = {
                reqAct: 'check',
                id: _this.$route.query.id,
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
                        location.hash = '#/carPlatform/carAudit';
                    } else {
                        _this.$message.error({
                            duration: 1500,
                            message: res.retMsg
                        });
                    }
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
.carAuditDetail {
    .title {
        font-weight: bold;
        font-size: 16px;
        margin: 10px 10px 20px;
    }
    .report {
        border: 1px solid #e0e0e0;
        height: 600px;
        iframe {
            border: 0;
            width: 100%;
            height: 600px;
        }
    }
    .auctionManageBtn {
        text-align: center;
        margin: 50px 0 50px;
    }
}
</style>
