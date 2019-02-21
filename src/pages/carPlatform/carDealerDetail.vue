<!--
    车商管理详情
    Created by liubf on 2018/01/19
-->
<template>
    <div class='carDealerDetail' v-if="isShow">
        <el-alert :title="errorMessage" :closable="false" type="error" center show-icon v-if="errorMessage"></el-alert>
        <el-col :span="24" v-if="!errorMessage">
            <el-col :span="24" class="title">基本信息</el-col>
            <baseInfoTable :billBaseInfo="billBaseInfo"></baseInfoTable>
            <el-col :span="24" class="title">账户信息</el-col>
            <el-col :span="24" class="accoundInfo">
                <el-col :span="5" :xs="24">可用保证金（元）</el-col>
                <el-col :span="19" :xs="24">{{accoundInfo.avaDeposit}}</el-col>
                <el-col :span="5" :xs="24">冻结中（元）</el-col>
                <el-col :span="19" :xs="24">{{accoundInfo.freeDeposit}}</el-col>
                <el-col :span="5" :xs="24">待支付服务费（元）</el-col>
                <el-col :span="19" :xs="24">{{accoundInfo.unpaidFee}}</el-col>
            </el-col>
            <template v-if="reason">
                <el-col :span="24" class="title">审核不通过</el-col>
                <el-col :span="24" :xs="24" class="reason" v-html="reason"></el-col>
            </template>
        </el-col>
    </div>
</template>
<script>
import baseInfoTable from '../../components/carPlatform/baseInfoTable.vue' // table
export default {
    name: 'carDealerDetail',
    data() {
        return {
            isShow: false,
            errorMessage: '',
            billBaseInfo: [],
            reason: '',
            accoundInfo: {
                avaDeposit: '0.00',
                freeDeposit: '0.00',
                unpaidFee: '0.00'
            }
        }
    },
    created: function() {
        var _this = this;
        _this.$store.state.breadcrumb = [{
            path: '/',
            name: '捕车平台'
        }, {
            path: '/carPlatform/carDealer',
            name: '车商管理'
        }, {
            name: '详情'
        }];
        _this.$c.ajax({
            url: 'buche/api/manage/dealer',
            data: {
                reqAct: 'detail',
                dealerId: _this.$route.query.id
            },
            success: function(res) {
                _this.isShow = true;
                if (res.retCode === '0') {
                    for (var i = 0; i < 7; i++) {
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
                    _this.billBaseInfo[4].key = '是否认证';
                    _this.billBaseInfo[4].value = res.result.isAuth === '0' ? '未认证' : '已认证';
                    _this.billBaseInfo[5].key = '注册日期';
                    _this.billBaseInfo[5].value = res.result.regDate;
                    _this.billBaseInfo[6].key = '认证日期';
                    _this.billBaseInfo[6].value = res.result.authDate;

                    _this.accoundInfo.avaDeposit = _this.$c.setMoney(res.result.avaDeposit);
                    _this.accoundInfo.freeDeposit = _this.$c.setMoney(res.result.freeDeposit);
                    _this.accoundInfo.unpaidFee = _this.$c.setMoney(res.result.unpaidFee);

                    _this.reason = res.result.reason ? res.result.reason.replace(/\n/g, '<br/>') : '';
                } else {
                    _this.errorMessage = res.retMsg;
                }
            }
        });
    },
    components: {
        baseInfoTable
    }
}
</script>
<style scoped lang='less'>
.carDealerDetail {
    .title {
        font-weight: bold;
        font-size: 16px;
        margin: 10px 10px 20px;
    }
    .accoundInfo {
        border-left: 1px solid #e0e0e0;
        border-top: 1px solid #e0e0e0;
        margin-bottom: 20px;
        .el-col {
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
            border-right: 1px solid #e0e0e0;
        }
    }
    .reason {
        padding: 10px;
        border: 1px solid #e0e0e0;
        margin-bottom: 50px;
    }
}
</style>
