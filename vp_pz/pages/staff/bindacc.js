// vp_pz/pages/staff/bindacc.js
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
        var self=this;

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

                    self.setData({
                        url:app.appinfo.approot + '/index/vppz/Web/index?appid='+ app.appinfo.appid//;app.util.url('Index/index')+'&m=' + app.mdName

                    });
            });
    });
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    bindload:function(e){
        wx.miniProgram.redirectTo({url: 'index'});
    }
    
})