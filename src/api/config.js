/**
 * 定义全局常量
 * 全局公用常量VUE.CONST对象下,防止全局污染
 * 常量大写命名
 * Created by liubf on 2018/01/19
 */
exports.install = function(Vue, options) {
    Vue.prototype.CONST = {
        /*
         *设置请求域名（webpack里设置）
         *author:liubf
         */
        API_URL: process.env.API_URL,
        /*
         *设置图片地址（webpack里设置）
         *author:liubf
         */
        IMG_URL: process.env.IMG_URL,
        /*
         *设置报告地址（webpack里设置）
         *author:liubf
         */
        REPORT_URL: process.env.REPORT_URL,
        /*
         *返回客户端信息
         *author:liubf
         */
        CLIENTINFO: {
            trident: navigator.userAgent.indexOf('Trident') > -1, // IE内核
            presto: navigator.userAgent.indexOf('Presto') > -1, // opera内核
            webKit: navigator.userAgent.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1, // 火狐内核
            mobile: !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1, // android终端
            iPhone: navigator.userAgent.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: navigator.userAgent.indexOf('iPad') > -1, // 是否iPad
            webApp: navigator.userAgent.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
            weixin: navigator.userAgent.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
            qq: navigator.userAgent.match(/\sQQ/i) === ' qq' // 是否QQ
        }
    }
}
