<!--
    竞拍管理列表
    Created by liubf on 2018/01/19
-->
<template>
    <div class='auctionManage' v-if="isShow">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
            <el-tab-pane label="竞拍结束" name="0">
                <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;' :class="{isTabHide:isTabHide}">
                    <el-table-column prop='carNo' label='车源编号'>
                    </el-table-column>
                    <el-table-column prop='source' label='车辆来源'>
                    </el-table-column>
                    <el-table-column prop='brand' label='品牌型号'>
                    </el-table-column>
                    <el-table-column prop='price' label='最终价格(万元)'>
                    </el-table-column>
                    <el-table-column prop='userName' label='竞得商家'>
                    </el-table-column>
                    <el-table-column prop='endTime' label='结束时间'>
                    </el-table-column>
                    <el-table-column label='操作'>
                        <template slot-scope='scope'>
                            <el-button type="primary" size='small' @click='lookDetail(tableData[scope.$index].auctionId)'>查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="竞拍中" name="1">
                <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;' :class="{isTabHide:isTabHide}">
                    <el-table-column prop='carNo' label='车源编号'>
                    </el-table-column>
                    <el-table-column prop='source' label='车辆来源'>
                    </el-table-column>
                    <el-table-column prop='brand' label='品牌型号'>
                    </el-table-column>
                    <el-table-column prop='price' label='当前价格(万元)'>
                    </el-table-column>
                    <el-table-column prop='userName' label='出价商家'>
                    </el-table-column>
                    <el-table-column prop='endTimeVal' label='剩余时间'>
                    </el-table-column>
                    <el-table-column label='操作'>
                        <template slot-scope='scope'>
                            <el-button type="primary" size='small' @click='lookDetail(tableData[scope.$index].auctionId)'>查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="待开拍" name="2">
                <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;' :class="{isTabHide:isTabHide}">
                    <el-table-column prop='carNo' label='车源编号'>
                    </el-table-column>
                    <el-table-column prop='source' label='车辆来源'>
                    </el-table-column>
                    <el-table-column prop='brand' label='品牌型号'>
                    </el-table-column>
                    <el-table-column prop='price' label='起拍价格(万元)'>
                    </el-table-column>
                    <el-table-column prop='startTime' label='开拍时间'>
                    </el-table-column>
                    <el-table-column label='操作'>
                        <template slot-scope='scope'>
                            <el-button type="primary" size='small' @click='lookDetail(tableData[scope.$index].auctionId)'>查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="未安排" name="3">
                <el-table :data='tableData' border style='width: 100%;margin-bottom:20px;' :class="{isTabHide:isTabHide}">
                    <el-table-column prop='carNo' label='车源编号'>
                    </el-table-column>
                    <el-table-column prop='source' label='车辆来源'>
                    </el-table-column>
                    <el-table-column prop='brand' label='品牌型号'>
                    </el-table-column>
                    <el-table-column prop='price' label='起拍价格(万元)'>
                    </el-table-column>
                    <el-table-column label='操作'>
                        <template slot-scope='scope'>
                            <el-button type="primary" size='small' @click='lookDetail(tableData[scope.$index].id)'>设置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-pagination :class="{isTabHide:isTabHide}" v-if="total>searchData.pageSize" @current-change="currentChange" background layout='prev, pager, next' :total='total'>
            </el-pagination>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name: 'auctionManage',
    data() {
        return {
            isShow: true,
            isTabHide: false,
            total: 0,
            activeTab: '0',
            act: 'finished',
            repetition: null,
            timePlay: null,
            tableData: [],
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
            name: '竞拍管理'
        }];
        if (this.$route.query.type) {
            var type = this.$route.query.type;
            this.activeTab = type;
            this.act = type === '0' ? 'finished' : type === '1' ? 'started' : type === '2' ? 'noStart' : 'noArrange';
        }
        this.request();
    },
    destroyed: function() {
        clearInterval(this.timePlay);
        clearTimeout(this.repetition);
    },
    methods: {
        // 查看详情
        lookDetail: function(id) {
            location.hash = '#/carPlatform/auctionManageDetail?id=' + id + '&type=' + (this.$route.query.type || 0);
        },
        // 当前页码改变事件
        currentChange: function(pageNo) {
            this.searchData.pageNo = pageNo;
            this.request();
        },
        // tab点击切换
        handleClick: function(tab, event) {
            var _this = this;
            _this.isTabHide = true;
            _this.searchData.pageNo = 1;
            _this.act = tab.index === '0' ? 'finished' : tab.index === '1' ? 'started' : tab.index === '2' ? 'noStart' : 'noArrange';
            _this.request();
            location.hash = '#/carPlatform/auctionManage?type=' + tab.index;
        },
        // 请求数据
        request: function(load) {
            var _this = this;
            clearInterval(_this.timePlay);
            clearTimeout(_this.repetition);
            _this.$c.ajax({
                loading: load ? '' : true,
                url: 'buche/api/manage/auction',
                data: {
                    reqAct: _this.act,
                    pageNo: _this.searchData.pageNo,
                    pageSize: _this.searchData.pageSize
                },
                success: function(res) {
                    _this.isShow = true;
                    _this.isTabHide = false;
                    if (res.retCode === '0') {
                        var arr = [];
                        res.result.carList.forEach(function(item) {
                            var o = {
                                id: item.id,
                                carNo: item.carNo,
                                auctionId: item.auctionId,
                                source: item.source,
                                brand: item.brand.replace(/其他/g, ''),
                                price: _this.$c.setMoney(item.price),
                                userName: item.userName,
                                startTime: item.startTime,
                                endTime: item.endTime,
                                endTimeValInit: item.endTimeVal,
                                endTimeVal: _this.formatEndTime(item.endTimeVal)
                            }
                            arr.push(o);
                        });
                        _this.total = res.result.totalCnt;
                        _this.tableData = arr;
                        if (_this.act === 'started') {
                            _this.repetitionGet();
                        }
                    } else {
                        _this.$message.error({
                            duration: 1500,
                            message: res.retMsg
                        });
                    }
                }
            });
        },
        // 返回剩余时间
        formatEndTime: function(time) {
            var days = parseInt(time / 86400000);
            var daySurplus = time % 86400000;
            var hours = parseInt(daySurplus / (1000 * 60 * 60));
            var hoursSurplus = daySurplus % (1000 * 60 * 60);
            var minute = parseInt(hoursSurplus / (1000 * 60));
            var minuteSurplus = hoursSurplus % (1000 * 60);
            var second = minuteSurplus / 1000;
            return (days + '天  ' + (hours < 10 ? '0' + hours : hours) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second));
        },
        // 重新获取竞拍中数据
        repetitionGet: function() {
            var _this = this;
            // 剩余时间倒计时
            _this.timePlay = setInterval(function() {
                if (!(_this.act === 'started' && location.hash.indexOf('/auctionManage?') > -1)) {
                    clearInterval(_this.timePlay);
                    clearTimeout(_this.repetition);
                    return false;
                }
                _this.tableData.forEach(function(o) {
                    if (o.endTimeValInit > 0) {
                        o.endTimeValInit = o.endTimeValInit - 1000;
                        _this.$set(o, 'endTimeVal', _this.formatEndTime(o.endTimeValInit));
                    } else {
                        _this.request(true);
                    }
                });
            }, 1000);
            // 每10秒重新获取数据
            _this.repetition = setTimeout(function() {
                if (_this.act === 'started' && location.hash.indexOf('/auctionManage?') > -1) {
                    _this.request(true);
                }
            }, 10000);
        }
    }
}
</script>
<style scoped lang='less'>
.auctionManage {
    .searchBar {
        margin-bottom: 20px;
        .el-col {
            margin-right: 10px;
        }
        button {
            margin-top: 4px;
        }
    }
    .isTabHide {
        opacity: 0;
    }
}
</style>
