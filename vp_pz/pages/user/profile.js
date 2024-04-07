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

        avatar:''
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


    // 修改禁止提示
    editDisabled:function(e){
        wx.showToast({
            title: '还未到下次修改时间',
            icon: 'none',
            duration: 2000
        });
        return;
    },
    
       // 头像
       onAvatarChange: function () {
        var self = this;

        var url = app.util.url('Common/upload');

        wx.chooseMedia({
            mediaType:['image'],
            sourceType:['album'],
            count: 1,
            success: function (res) {
                    self.setData({
                            "avatar_file": res.tempFiles[0].tempFilePath,
                            "avatar": ''
                    });

                    wx.uploadFile({
                            url: url,
                            filePath: res.tempFiles[0].tempFilePath,
                            name: 'file',
                            formData: {
                                    'path': res.tempFiles[0].tempFilePath,
                            },
                            success: function (ret) {
                                    ret.data = JSON.parse(ret.data);
                                    console.log(ret.data);

                                    if (ret.data.code!=1){
                                            wx.showModal({
                                                    title: '图片上传失败',
                                                    content: ret.data.message,
                                                    showCancel:false,
                                                    success(res) {
                                                            self.setData({
                                                                "avatar_file": '',
                                                                "avatar": ''
                                                            });
                                                    }
                                            });
                                    }else{
                                            self.setData({
                                                "avatar": ret.data.data.path,
                                                "is_changed":true
                                            });
                                    }
                            }
                    });
            }
        });
    },

    onNicknameChange: function () {
        this.setData({
            is_changed:true
        });
    },

    profileSave:function(e){
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


        if (self.data.avatar_file && !self.data.avatar) {
            wx.showToast({
                title: '请稍等，头像图片正在上传',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        // 昵称验证
        if(!e.detail.value.nickname){
            return wx.showToast({
                title: '请设置您的昵称',
                icon: 'none',
                duration: 2000
            });
        }

        app.util.request({
            url: 'User/profile',
            data: {
                    m: app.mdName,
                    submit: 'save',
                    avatar:self.data.avatar,
                    nickname:e.detail.value.nickname
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