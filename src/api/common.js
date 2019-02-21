/**
 * 全局控制
 * Created by liubf on 2018/01/19
 */
var obj = {
    vue: null, // 初始化

    init: function(Vue) {
        obj.vue = Vue;
        // obj.getBaseInfo();
        obj.bind();
        obj.resizeFun();
    },
    // 事件
    bind: function() {
        // 监听屏幕调整左侧菜单栏
        window.addEventListener('resize', function() {
            obj.resizeFun();
        });
    },
    // 获取用户基本信息
    getBaseInfo: function() {
        obj.vue.$c.ajax({
            loading: false,
            url: 'user/info/getUserInfo',
            data: {},
            success: function(res) {
                if (res.code === 20000) {
                    obj.vue.$store.state.menuList = obj.sort(res.data.depart.menuList);
                    obj.vue.$store.state.baseInfo = res.data;
                }
            },
            error: function(e) {

            }
        })
    },
    // 排序菜单项，按规定顺序输出
    sort: function(data) {
        var icon = { // 一级菜单项对应图标标识
            banner: 'fa fa-files-o',
            bill: 'fa fa-files-o',
            branchShopMng: 'fa fa-sitemap',
            customerMng: 'fa fa-user',
            finance: 'fa fa-cny ',
            item: 'fa fa-inbox',
            orders: 'fa fa-calendar-o',
            ownShopMng: 'fa fa-cog',
            parts: 'fa fa-cogs',
            roleAuth: 'fa fa-tasks',
            staff: 'fa fa-users',
            smsManage: 'fa fa-envelope-o',
            extendWarranty: 'fa fa-shield'
        };
        // 根据order排序
        for (var i = 0; i < data.length - 1; i++) {
            for (var j = 0; j < data.length - 1 - i; j++) {
                if (parseInt(data[j].order) > parseInt(data[j + 1].order)) {
                    var temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                }
            }
        }
        // 根据父子ID对应关系输出
        var arr = [];
        data.forEach(function(v) {
            if (v.level === '1') {
                v.icon = icon[v.path];
                arr.push([v, []]);
            }
        });
        data.forEach(function(v) {
            if (v.level === '2') {
                arr.forEach(function(i) {
                    if (i[0].id === v.parentId) {
                        i[1].push(v);
                    }
                });
            }
        });
        return arr;
    },
    resizeFun: function() {
        var appClass = '';
        var menuIcon = '';
        if (!obj.vue.$c.$('.menuIcon').legnth > 0) {
            return false;
        }
        if (window.innerWidth < 992) {
            appClass = obj.vue.$c.$('#app').getAttribute('class') ? obj.vue.$c.$('#app').getAttribute('class') : '';
            menuIcon = obj.vue.$c.$('.menuIcon')[0].getAttribute('class') ? obj.vue.$c.$('.menuIcon')[0].getAttribute('class') : '';
            if (appClass.indexOf('activeHideMenu') === -1) {
                obj.vue.$c.$('#app').setAttribute('class', appClass + ' activeHideMenu');
            }
            if (menuIcon.indexOf('el-icon-more') === -1) {
                obj.vue.$c.$('.menuIcon')[0].setAttribute('class', menuIcon.replace(/ el-icon-menu/g, '') + ' el-icon-more');
            }
        } else {
            appClass = obj.vue.$c.$('#app').getAttribute('class') ? obj.vue.$c.$('#app').getAttribute('class') : '';
            menuIcon = obj.vue.$c.$('.menuIcon')[0].getAttribute('class') ? obj.vue.$c.$('.menuIcon')[0].getAttribute('class') : '';
            if (appClass && appClass.indexOf('activeHideMenu') > -1) {
                obj.vue.$c.$('#app').setAttribute('class', appClass.replace(/ activeHideMenu/g, ''));
            }
            if (menuIcon.indexOf('el-icon-more') > -1) {
                obj.vue.$c.$('.menuIcon')[0].setAttribute('class', menuIcon.replace(/ el-icon-more/g, '') + ' el-icon-menu');
            }
        }
    }
}
export default obj;
