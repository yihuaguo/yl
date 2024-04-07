// vp_cai/pages/index/citys.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tag:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(this);
        var self = this;

        var tag = options.tag;
        self.setData({
            tag:tag
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

                    wx.setNavigationBarTitle({
                        title: cfg.name,
                    });
    
                    self.main_load(false);
            });
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    
        /** 暂不考虑该页面分享
         * 分享
        
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
                imageUrl: this.data.cfg.set_app_logo,
                query:   'hid='+this.data.hid+'&aid='+this.data.area.id+'&fuid=' + this.data.mine.id
            }
        },
        getSharePath:function(qccode=false){
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
        */

    // 页面数据加载
    main_load(showLoading) {
        const self = this;
        //console.log("self.data.like "+self.data.like);
        app.util.request({
                url: 'Index/tag',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id,
                        tag:self.data.tag
                },
                success(res) {
                        var data = res.data.data;
                        self.setData({
                                main_loaded: true,
                                now:data.now,
                                services:data.services
                        });
                }
        })
    },

    // 前往服务下单页
    toService:function(e){
        wx.navigateTo({
                url: '../index/service?svid='+e.currentTarget.dataset.svid
        })
    }

})