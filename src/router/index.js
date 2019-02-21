const router = [{
    path: '/login',
    name: '登录',
    component: resolve => require(['../pages/login'], resolve)
}, {
    path: '/',
    name: '捕车平台',
    component: resolve => require(['../pages/'], resolve)
}, {
    path: '/carPlatform/carDealer',
    name: '车商管理',
    meta: { breadNumber: 1 },
    component: resolve => require(['../pages/carPlatform/carDealer'], resolve)
}, {
    path: '/carPlatform/carDealerDetail',
    name: '详情',
    meta: { breadNumber: 2 },
    component: resolve => require(['../pages/carPlatform/carDealerDetail'], resolve)
}, {
    path: '/carPlatform/certificationAudit',
    name: '认证审核',
    meta: { breadNumber: 1 },
    component: resolve => require(['../pages/carPlatform/certificationAudit'], resolve)
}, {
    path: '/carPlatform/certificationAuditDetail',
    name: '详情',
    meta: { breadNumber: 2 },
    component: resolve => require(['../pages/carPlatform/certificationAuditDetail'], resolve)
}, {
    path: '/carPlatform/auctionManage',
    name: '竞拍管理',
    meta: { breadNumber: 1 },
    component: resolve => require(['../pages/carPlatform/auctionManage'], resolve)
}, {
    path: '/carPlatform/auctionManageDetail',
    name: '详情',
    meta: { breadNumber: 2 },
    component: resolve => require(['../pages/carPlatform/auctionManageDetail'], resolve)
}, {
    path: '/carPlatform/carAudit',
    name: '车源审核',
    meta: { breadNumber: 1 },
    component: resolve => require(['../pages/carPlatform/carAudit'], resolve)
}, {
    path: '/carPlatform/carAuditDetail',
    name: '详情',
    meta: { breadNumber: 2 },
    component: resolve => require(['../pages/carPlatform/carAuditDetail'], resolve)
}, {
    path: '/carPlatform/helpCheck',
    name: '帮检预约',
    meta: { breadNumber: 1 },
    component: resolve => require(['../pages/carPlatform/helpCheck'], resolve)
}, {
    path: '/carPlatform/helpSell',
    name: '帮卖管理',
    meta: { breadNumber: 1 },
    component: resolve => require(['../pages/carPlatform/helpSell'], resolve)
}];
export default router;
