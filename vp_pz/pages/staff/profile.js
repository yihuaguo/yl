// vp_pz/pages/staff/profile.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_changed:false
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



        // 页面数据加载
        main_load(showLoading) {
            const self = this;
            //console.log("self.data.like "+self.data.like);
            app.util.request({
                    url: 'Staff/profile',
                    showLoading: showLoading ? true : false,
                    data: {
                            m: app.mdName,
                            aid:self.data.area.id,
                    },
                    success(res) {
                            var data = res.data.data;

                            self.setData({
                                    main_loaded: true,
                                    is_changed:false,
                                    now:data.now,
                                    staff:data.staff
                            });
                    }
            })
        },
        
       // 头像
       onAvatarChange: function () {
            var self = this;

            var url = app.util.url('Common/upload');

            wx.chooseImage({
                    count: 1,
                    success: function (res) {
                            res.tempFilePaths[0],
                                    self.setData({
                                            "staff.avatar_file": res.tempFilePaths[0],
                                            "staff.avatar": ''
                                    });

                            wx.uploadFile({
                                    url: url,
                                    filePath: res.tempFilePaths[0],
                                    name: 'file',
                                    formData: {
                                            'path': res.tempFilePaths[0]
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
                                                                        "staff.avatar_file": '',
                                                                        "staff.avatar": ''
                                                                    });
                                                            }
                                                    });
                                            }else{
                                                    self.setData({
                                                        "staff.avatar": ret.data.data.path,
                                                        is_changed:true
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

        onAgeChange: function () {
            this.setData({
                is_changed:true
            });
        },

        onMobileChange: function () {
            this.setData({
                is_changed:true
            });
        },

        
    staffSave:function(e){
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

        var  staff = this.data.staff;

        if (!staff.avatar) {
            if(staff.avatar_file){
                wx.showToast({
                    title: '请稍等，头像图片正在上传',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }else{
                wx.showToast({
                    title: '请上传头像图片',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
        }

        // 昵称验证
        if(!e.detail.value.nickname){
            return wx.showToast({
                title: '请设置您的昵称',
                icon: 'none',
                duration: 2000
            });
        }
        staff.nickname=e.detail.value.nickname;

        
        // 年龄验证
        if(!e.detail.value.age){
            return wx.showToast({
                title: '请填写您的年龄',
                icon: 'none',
                duration: 2000
            });
        }
        staff.age=e.detail.value.age;
        
        // 手机号验证
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
        staff.mobile=e.detail.value.mobile;

        // 序列化提交数据对象
        var form = encodeURI(JSON.stringify(staff));

        self.setData({
            _is_saving:true
        });

        app.util.request({
                url: 'Staff/profile',
                data: {
                    m: app.mdName,
                    aid:self.data.area.id,
                    submit:'save',
                    form: form
                },
                complete(res){
                    self.setData({
                        _is_saving:false
                    });
                },
                success(res) {
                        
                        wx.showToast({
                                title: res.data.msg,
                                icon: 'success',
                                duration: 2000,
                                success: function () {
                                    setTimeout(function () {
                                       self.main_load();
                                    }, 2000); 
                                }
                        });
                        
                         /***
                    self.setData({
                        "live._id":res.data.data.live._id
                    });
                    self.showSavedModal();
                     */
                }
        })
    },
})