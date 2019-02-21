/**
 * 定义全局api
 * 全局公用方法放置在Vue.$c对象下,防止全局污染
 * 驼峰命名
 * Created by liubf on 2018/01/19
 */
exports.install = function(Vue, options) {
    Vue.prototype.$vue_api = function(vueObj) {
        Vue.prototype.$c = {
            /*
             *获取url参数
             *author:liubf
             */
            getQueryString: function(name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return null;
            },
            /*
             *获取js原生对象
             *暂不支持多个选择器
             *author:liubf
             */
            $: function(t) {
                try {
                    var inital = t.substring(0, 1);
                    if (inital === '#') {
                        return document.getElementById(t.substring(1, t.length));
                    } else if (inital === '.') {
                        return document.getElementsByClassName(t.substring(1, t.length));
                    } else {
                        return document.getElementsByTagName(t);
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            /*
             *elementUI validate 较验方法
             *author:liubf
             */
            eVR: {
                vin: function(rule, value, callback) {
                    value = value.replace(/\s/g, '');
                    if (!(/^[\w]{17}/.test(value) && value.replace(/\s+/, '').length === 17)) {
                        callback(new Error('请输入字母或数字的17位车架号'));
                    } else {
                        callback();
                    }
                },
                validatePositiveInt: function(rule, value, callback) {
                    if (!/^[1-9]*[1-9][0-9]*$/.test(value)) {
                        callback(new Error());
                    } else {
                        callback();
                    }
                },
                positiveIntAndFloatPoint: function(rule, value, callback) {
                    if (!/^[1-9]*[1-9][0-9]*$/.test(value)) {
                        if (!/^([0-9]*\.[0-9]+)$/.test(value)) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                },
                productYear: function(rule, value, callback) {
                    var nowYear = String(new Date().getFullYear());
                    var regExpYear = new RegExp('^19[8-9][0-9]|20[0-' + nowYear.substring(2, 3) + '][0-' + nowYear.substring(3, 4) + ']|200[0-9]$');
                    if (!regExpYear.test(value)) {
                        callback(new Error('生产年份不在范围内(1980-' + nowYear + ')'));
                    } else {
                        callback();
                    }
                },
                money: function(rule, value, callback) {
                    if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                        callback(new Error('请输入正确的金额'));
                    } else {
                        callback();
                    }
                }
            },
            //  过滤器
            filter: {
                /*
                 * 过滤空格
                 * @params string str 需要过滤的字符串
                 * return 过滤后的str
                 * author qjy 2018/01/04
                 */
                trim: function(str) {
                    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
                }

            },
            /*
             *请求方法
             *author:liubf
             */
            ajax: function(options) {
                var loading = null;
                options = options || {};
                // 缺省值
                var defaults = {
                    loading: true, // 是否加载loading
                    type: 'post', // 默认post请求
                    url: '', // 必填，请求路径
                    data: {}, // 传参
                    lock: false, // 默认false不加锁，传点击对象dom
                    success: function(res) {
                        // 成功后回调
                    },
                    error: function(e) {
                        // 失败后回调
                    }
                };
                //  传进来的对象添加缺省值给未定义字段
                for (var option in defaults) {
                    if (typeof options[option] === 'undefined') {
                        if (typeof defaults[option] === 'string') {
                            options[option] = this.filter.trim(defaults[option]);
                        } else {
                            options[option] = defaults[option];
                        }
                    }
                }
                if (options.loading) {
                    loading = vueObj.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.1)'
                    });
                }
                if (!options.token) {
                    options.data.token = sessionStorage.getItem('token');
                } else {
                    options.data.token = options.token;
                }
                options.data.accId = 'h5';
                options.url = vueObj.CONST.API_URL + options.url;
                // 是否加锁
                if (options.lock) {
                    if (options.lock.target.getAttribute('data-lock') === 'true') {
                        return false;
                    } else {
                        options.lock.target.setAttribute('data-lock', 'true');
                    }
                }
                // 发起请求
                returnHttp(options.type).then(function(res) {
                    if (res.body.retCode === 'COMMON016' || res.body.retCode === 'COMMON002') {
                        if (options.loading) {
                            loading.close();
                        }
                        vueObj.$c.logout();
                        return false;
                    }
                    unlock(function() {
                        if (options.success) {
                            options.success(res.body);
                        }
                    });
                }, function(e) {
                    unlock(function() {
                        if (options.error) {
                            options.error(e);
                        }
                    });
                });
                // 返回请求对象
                function returnHttp(api) {
                    return api === 'get' ? Vue.http.get(options.url, {
                        emulateJSON: true,
                        params: {
                            reqData: JSON.stringify(options.data)
                        }
                    }) : Vue.http.post(options.url, {
                        reqData: JSON.stringify(options.data)
                    }, {
                        emulateJSON: true
                    });
                }
                // 回调并解锁
                function unlock(callback) {
                    if (options.loading) {
                        setTimeout(function() {
                            loading.close();
                            callback();
                        }, 300);
                    } else {
                        callback();
                    }
                    // 解锁
                    if (options.lock) {
                        setTimeout(function() {
                            options.lock.target.setAttribute('data-lock', '');
                        }, 1000);
                    }
                }
            },
            /*
             *获取cookie
             *author:liubf
             */
            getCookie: function(name) {
                var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
                var arr = document.cookie.match(reg);
                if (arr) {
                    return unescape(arr[2]);
                } else {
                    return null;
                }
            },
            /*
             *设置cookie
             *author:liubf
             */
            setCookie: function(name, value, expireTime) {
                var exp = new Date();
                var time = expireTime || exp.getTime() + (60 * 200000);
                exp.setTime(time); // 过期时间2分钟
                document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
            },
            /*
             *退出登录
             *author:liubf
             */
            logout: function() {
                var loading = vueObj.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0)'
                });
                sessionStorage.setItem('token', '');
                setTimeout(function() {
                    loading.close();
                    location.href = '#/login';
                }, 500);
            },
            /*
             *设置金钱格式
             *author:liubf
             */
            setMoney: function(m) {
                if (typeof parseInt(m) === 'number' && !isNaN(parseInt(m))) {
                    var arr = m.toString().split('.');
                    if (arr.length === 1) {
                        m = m + '.00';
                    } else if (arr[1].toString().length === 1) {
                        m = m + '0';
                    } else if (arr[1].toString().length > 2) {
                        m = arr[0] + '.' + arr[1].substring(0, 2);
                    }
                }
                return m;
            }
        }
    }
};
