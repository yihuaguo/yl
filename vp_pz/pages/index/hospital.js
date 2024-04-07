// vp_cai/pages/index/citys.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(this);
        var self = this;

        var hid ='';    // 必须
        var aid = '';   // [非必须]该页面为入口时有效
        var fuid = ''; // [非必须]该页面为入口时有效
        if (options.scene) { // 扫码进入
          var scene = options.scene.split('_');
          hid = scene[0] ? scene[0] : '';
          aid = scene[1] ? scene[1] : '';
          fuid = scene[2] ? scene[2] : '';
        }else{
            hid = options.hid ? options.hid : '';
            aid = options.aid ? options.aid : '';
            fuid = options.fuid ? options.fuid : '';
        }
        self.setData({
            hid:hid,
            aid:aid,
            fuid:fuid
        });

        app.util.getUserInfo(function (response) {
            self.setData({
                    userInfo: response
            });
            app.mdInit(function (cfg,mine,area) {
                    self.setData({
                            cfg: cfg,
                            mine:mine,
                            area:area
                    });

                    self.main_load(false);
            });
        });
        
    },

    
    onNavBarAttached: function (e) {
        this.setData({
                statusHeight: e.detail.statusHeight,
                navHeight: e.detail.navHeight,
                navBarHeight: e.detail.navBarHeight
        });
        console.log("--------------------------------" + e.detail.navBarHeight);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    
        /**
         * 分享
        */
       onShareAppMessage: function () {
            console.log(this.getSharePath());
            return {
                    title: '['+this.data.cfg.name+']'+this.data.hospital.name,//.cfg.share_title,
                    imageUrl: this.data.cfg.share_image_url,
                    path: this.getSharePath()
            }
        },
        onShareTimeline:function(){
            return {
                title: '['+this.data.cfg.name+']'+this.data.hospital.name,//.cfg.share_title,
                imageUrl: this.data.cfg.logo_url,
                query:   'hid='+this.data.hid+'&aid='+this.data.area.id+'&fuid=' + this.data.mine.id
            }
        },
        getSharePath:function(){
                var page = app.mdName + '/pages/index/hospital';
                var ps = '?hid='+ this.data.hid+'&aid='+this.data.area.id+'&fuid=' + this.data.mine.id;
                return page + ps;
        },
        showShareModal:function(){
            const self=this;
            wx.hideTabBar({
                //animation:true,
                complete:function(){
                    self.setData({
                        _shareModal: true
                    });
                }
            });
        },
        hideShareModal:function(){
            this.setData({
              _shareModal: false
            });
            wx.showTabBar();
        },
        
    // 页面数据加载
    main_load(showLoading) {
        const self = this;
        //console.log("self.data.like "+self.data.like);
        app.util.request({
                url: 'Hospital/index',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id,
                        hid:self.data.hid
                },
                success(res) {
                        var data = res.data.data;
                        self.setData({
                                main_loaded: true,
                                now:data.now,
                                hospital:data.hospital,
                                services:data.services
                        });
                }
        })
    },

    // 前往服务下单页
    toService:function(e){
        wx.navigateTo({
                url: '../index/service?svid='+e.currentTarget.dataset.svid+'&hid='+this.data.hospital.id
        })
    },

    // 医院导航
    toMap:function(){
        console.log(this.data.cfg.qmap_key);
        let plugin = requirePlugin('routePlan');
        let key = this.data.cfg.qmap_key;  //使用在腾讯位置服务申请的key
        let referer = app.name;   //调用插件的app的名称
        var point = {
            lng: this.data.hospital.lng,
            lat: this.data.hospital.lat
        }
        //var point = this.bMapTransQQMap(this.data.hospital.lng,this.data.hospital.lat);
        let endPoint = JSON.stringify({  //终点
          'name': this.data.hospital.name,
          'latitude': point.lat,
          'longitude': point.lng,
        });
        wx.navigateTo({
          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint+'&navigation=1'
        });
    },

      bMapTransQQMap:function(lng,lat){
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        let x = lng - 0.0065;
        let y = lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        let lngs = z * Math.cos(theta);
        let lats = z * Math.sin(theta);
        return {
            lng: lngs,
            lat: lats
        }
    }


   

})