// vp_pz/pages/staff/card.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _shareModal:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(this);
        var self = this;

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

    // 页面数据加载
    main_load(showLoading) {
        const self = this;
        app.util.request({
                url: 'Staff/card',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id,
                },
                success(res) {
                        var data = res.data.data;
                        self.setData({
                                main_loaded:true,
                                staff:data.staff,
                                users:data.users
                        });
                }
        })
    },


        
        /**
         * 分享
        */
       onShareAppMessage: function () {
        console.log(this.getSharePath());
        return {
                title: this.data.cfg.share_title?this.data.cfg.share_title:this.data.cfg.name,
                imageUrl: this.data.cfg.share_image_url,
                path: this.getSharePath()
        }
        },
        onShareTimeline:function(){
                return {
                title: this.data.cfg.share_title?this.data.cfg.share_title:this.data.cfg.name,
                imageUrl: this.data.cfg.logo_url,
                query:  'aid='+this.data.area.id+'&fuid=' + this.data.mine.id+'&stid='+this.data.staff.id
                }
        },
        getSharePath:function(){
                var page = app.mdName + '/pages/index/index';
                var ps = '?aid='+this.data.area.id+'&fuid=' + this.data.mine.id+'&stid='+this.data.staff.id
                return page + ps;
        },

        showShareModal(){
                this.setData({_shareModal:true});
        },
        
})