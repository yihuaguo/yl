// vp_ju/pages/user/settings.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editable:false,
        is_changed:false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;

        app.util.getUserInfo(function (response) {
            self.setData({
                    userInfo: response
            });
            app.mdInit(function (cfg,mine,area) {
                    self.setData({
                            cfg: cfg,
                            mine:mine,
                            avatar:mine.avatar,
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

    onMobileChange: function () {
        this.setData({
            is_changed:true
        });
    },


    // 修改禁止提示
    editDisabled:function(e){
        wx.showToast({
            title: '还未到下次修改时间',
            icon: 'none',
            duration: 2000
        });
        return;
    },
    

    doSave:function(e){
        var self = this;

        if(self.data._is_saving){
            return;
        }

        if(!self.data.is_changed){
            return wx.showToast({
                title: '没有修改',
                icon: 'none',
                duration: 2000
            });
        }


        // 验证
        if(!e.detail.value.mobile){
            return wx.showToast({
                title: '请填写您的手机号',
                icon: 'none',
                duration: 2000
            });
        }

        if(/^1[3-9]\d{9}$/.test(e.detail.value.mobile)==false){
            return wx.showToast({
                    title: '手机号格式填写错误',
                    icon: 'none',
                    duration: 2000
            });
    }
    
        app.util.request({
            url: 'User/mobile',
            data: {
                    m: app.mdName,
                    submit: 'save',
                    mobile:e.detail.value.mobile
            },
            success(res) {
                app.updateMine(function(mine){
                    self.setData({
                        mine: mine
                    });
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            setTimeout(function () {
                               wx.navigateBack();
                            }, 2000); 
                        }
                    });
                });
            }
        });
    },

})