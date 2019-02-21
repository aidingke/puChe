// see http://vuejs-templates.github.io/webpack for documentation.
// 配置环境
var env = {};
var api = {
    dev : {
        API_URL:'"//192.168.1.200/"',
        IMG_URL:'"http://imgs.static.com/"',
        REPORT_URL:'"http://192.168.1.200/bucheService/report.html?isShare=1&code="'
    },
    test : {
        API_URL:'"//192.168.1.220/"',
        IMG_URL:'"http://imgs.static.com/"',
        REPORT_URL:'"http://192.168.1.200/bucheServiceTest/report.html?isShare=1&code="'
    },
    master : {
        API_URL:'"https://www.51buche.com/"',
        IMG_URL:'"http://img.mhace.cn/"',
        REPORT_URL:'"https://www.51buche.com/bucheService/report.html?isShare=1&code="'
    }
}
if(process.env.NODE_ENV.indexOf('dev')>-1){
    env = api.dev;
}else if(process.env.NODE_ENV.indexOf('test')>-1){
    env = api.test;
}else if(process.env.NODE_ENV.indexOf('master')>-1){
    env = api.master;
}
process.env.API_URL = env.API_URL;
process.env.IMG_URL = env.IMG_URL;
process.env.REPORT_URL = env.REPORT_URL;
// 配置环境 end

