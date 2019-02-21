<!--
    认证审核详情
    Created by liubf on 2018/01/19
-->
<template>
    <div class='certificationAuditDetail' v-if="isShow">
        <el-alert :title="errorMessage" :closable="false" type="error" center show-icon v-if="errorMessage"></el-alert>
        <el-col :span="24" v-if="!errorMessage">
            <el-col :span="24" class="title">基本信息</el-col>
            <baseInfoTable :billBaseInfo="billBaseInfo"></baseInfoTable>
            <el-col :span="24" class="title">账户信息</el-col>
            <el-col :span="24" class="accoundInfo">
                <el-col :span="4" :xs="24">汇款帐号</el-col>
                <el-col :span="20" :xs="24">{{accoundInfo.accountNo}}</el-col>
                <el-col :span="4" :xs="24">开户行</el-col>
                <el-col :span="20" :xs="24">{{accoundInfo.bankName}}</el-col>
                <el-col :span="4" :xs="24">汇款人名称</el-col>
                <el-col :span="20" :xs="24">{{accoundInfo.accountName}}</el-col>
                <el-col :span="4" :xs="24">汇款人流水号</el-col>
                <el-col :span="20" :xs="24">{{accoundInfo.tradeNo}}</el-col>
                <el-col :span="4" :xs="24">汇款日期</el-col>
                <el-col :span="20" :xs="24">{{accoundInfo.tradeDate}}</el-col>
            </el-col>
            <el-col :span="24" class="certificationAuditDetailBtn">
                <el-button @click="dialogVisible = true">不通过</el-button>
                <el-button type="primary" @click="auditPost">通过审核</el-button>
            </el-col>
            <el-dialog title="不通过原因" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :before-close="handleClose">
                <el-form :model='validateForm' :rules='rules' ref='validateForm' class='demo-ruleForm'>
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
    name: 'certificationAuditDetail',
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
            accoundInfo: {
                accountNo: '',
                bankName: '',
                accountName: '',
                tradeNo: '',
                tradeDate: ''
            }
        }
    },
    created: function() {
        var _this = this;
        _this.$store.state.breadcrumb = [{
            path: '/',
            name: '捕车平台'
        }, {
            path: '/carPlatform/certificationAudit',
            name: '认证审核'
        }, {
            name: '详情'
        }];
        _this.$c.ajax({
            url: 'buche/api/manage/dealer',
            data: {
                reqAct: 'checkDetail',
                dealerId: _this.$route.query.id
            },
            success: function(res) {
                _this.isShow = true;
                if (res.retCode === '0') {
                    for (var i = 0; i < 6; i++) {
                        _this.billBaseInfo[i] = {
                            'key': '',
                            'value': ''
                        };
                    }
                    _this.billBaseInfo[0].key = '车商编号';
                    _this.billBaseInfo[0].value = res.result.id;
                    _this.billBaseInfo[1].key = '车商名称';
                    _this.billBaseInfo[1].value = res.result.name;
                    _this.billBaseInfo[2].key = '联系电话';
                    _this.billBaseInfo[2].value = res.result.tel;
                    _this.billBaseInfo[3].key = '车行性质';
                    _this.billBaseInfo[3].value = res.result.type === '0' ? '企业' : '个人';
                    _this.billBaseInfo[4].key = '注册日期';
                    _this.billBaseInfo[4].value = res.result.regDate;
                    _this.billBaseInfo[5].key = '提交日期';
                    _this.billBaseInfo[5].value = res.result.sumbitDate;

                    _this.accoundInfo.accountNo = res.result.accountNo;
                    _this.accoundInfo.bankName = res.result.bankName;
                    _this.accoundInfo.accountName = res.result.accountName;
                    _this.accoundInfo.tradeNo = res.result.tradeNo;
                    _this.accoundInfo.tradeDate = res.result.tradeDate;
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
                dealerId: _this.$route.query.id,
                oper: oper,
                reason: _this.validateForm.unAuditText
            }
            _this.$c.ajax({
                url: 'buche/api/manage/dealer',
                data: o,
                success: function(res) {
                    if (res.retCode === '0') {
                        _this.$message({
                            message: res.retMsg,
                            type: 'success'
                        });
                        location.hash = '#/carPlatform/certificationAudit';
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
.certificationAuditDetail {
    .title {
        font-weight: bold;
        font-size: 16px;
        margin: 10px 10px 20px;
    }
    .accoundInfo {
        border-left: 1px solid #e0e0e0;
        border-top: 1px solid #e0e0e0;
        .el-col {
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
            border-right: 1px solid #e0e0e0;
            min-height: 37px;
        }
    }
    .certificationAuditDetailBtn {
        text-align: center;
        margin: 100px 0 50px;
    }
}
</style>
<style>
.certificationAuditDetail .el-dialog {
    min-width: 320px!important;
}
</style>
