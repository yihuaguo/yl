// vp_pz/pages/index/serve.js
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

        app.util.getUserInfo(function (response) {
            self.setData({
                userInfo: response
            });
            app.mdInit(function (cfg,mine,area) {
                console.log(area);
                self.setData({
                        cfg: cfg,
                        mine:mine,
                        area:area,
                        tels:area.tels_json?JSON.parse(area.tels_json):'',
                        main_loaded:true
                });
                
            });
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    makePhoneCall:function(e){
        wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.tel
        });
    },

    doCopy(e){
        wx.setClipboardData({
            data: e.currentTarget.dataset.copy
        })
    },
})