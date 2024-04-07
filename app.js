//const ald = require('./utils/ald-stat.js'); // 阿拉丁统计
var util = require('vp/resource/js/util.js');
App({
        onLaunch: function (res) {
        },
        onShow: function (res) {
        },
        onHide: function () {
        },
        onError: function (msg) {
                console.log(msg)
        },
        //加载工具类
        util: util,
       
        //用户信息，sessionid是用户是否登录的凭证
        userInfo: {
                sessionid: null,
        },
        mdName:'vp_pz',


        // 模块初始化信息（配置和用户信息）
        mine: null,
        area:null,
        reInit:false, // 是否重新加载初始化信息 
        mdInit: function (cb,opts={}, ref = false) {
                var self = this;

       
                // 如果页面参数中含有fcmd相关，需强制更新初始化
                //if (opts.fcmd){
                //    ref=true;
                //}
                
                ref = ref || self.reInit;

                var doInit = function (options = {}) {
                        self.reInit=false;
                        console.log(' ===== init load =====');
                        /****  不采用初始化时统一执行额外命令，改由各业务逻辑自行处理
                        var fcode = "";
                        var fcmd="";  // 来源指令：follow:关注指令（即强制种心）
                        var fuid="";    // 来源用户uid
                        var fbid="";    // 来源书bookid
                        if(options.fcode){
                            fcode = options.fcode;
                        }
                        if(options.scene){
                            fcode = options.scene;
                        }
                        if (fcode){
                            var fcodes = fcode.split('_');
                            fcmd = fcodes[0];
                            if (fcmd=='follow'){
                                fuid = fcodes[1];
                                if (fcodes.length > 2) {
                                    fbid = fcodes[2];
                                }
                            }
                        }
                         */

                        util.request({
                                url: 'app/init',
                                showLoading: false,
                                data: {
                                        m: self.mdName,
                                        //fcmd: options.fcmd ? options.fcmd:'',
                                        aid: options.aid ? options.aid : '',
                                        fuid: options.fuid ? options.fuid : '',
                                        //fbid: options.fbid ? options.fbid : '',
                                        //puid:options.suid ? options.puid : '',
                                },
                                success(res) {
                                        console.log(" ===== init loaded =====");
                                        console.log(res.data);
                                        //wx.setStorageSync('siteConfig', res.data);
                                    self.cfg = res.data.data.cfg;
                                    self.mine = res.data.data.mine;
                                    self.area = res.data.data.area;
                                
                                    // 更新保存最新访问的城市
                                    wx.setStorageSync('VP_AID', self.area.id);

                                    typeof cb == "function" && cb(res.data.data.cfg, res.data.data.mine, res.data.data.area);
                                }
                        })

                };

                var cfg = self.cfg;
                var mine = self.mine;
                var area = self.area;
                if (cfg && mine &&  !ref) {
                        console.log(" ===== init local =====");
                        console.log(cfg);
                        console.log(mine);
                        typeof cb == "function" && cb(cfg,mine,area);
                } else {
                        //调用加载配置接口
                        doInit(opts);
                }
        },

        // 更新我的应用内个人信息
        updateMine: function (cb) {
                var self = this;

                var doUpdate = function () {
                        console.log(' ===== mine update =====');

                        util.request({
                                url: 'User/update',
                                showLoading: false,
                                data: {
                                        m: self.mdName
                                },
                                success(res) {
                                        console.log(" ===== mine updated =====");
                                        console.log(res.data);
                                    self.mine = res.data.data.mine;
                                    typeof cb == "function" && cb(res.data.data.mine);
                                }
                        })

                };

                //调用加载配置接口
                doUpdate(cb);
        },

        // 全局参数（页面间传递用）
        orders_filt:0,
        index_refresh:false,// 是否需要强制刷新首页

  

        appinfo: require('appinfo.js')
});