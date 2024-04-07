// vp_cai/pages/index/citys.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(this);
        var self = this;


        self.setData({
            oid:options.oid
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    
    // 页面数据加载
    main_load(showLoading) {
        const self = this;
        //console.log("self.data.like "+self.data.like);
        app.util.request({
                url: 'Staff/order',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id,
                        oid:self.data.oid
                },
                success(res) {
                        var data = res.data.data;

                        self.setData({
                                main_loaded: true,
                                now:data.now,
                                order:data.order
                        });
                }
        })
    },


    doOrderDone(){
        const self = this;
        wx.showModal({
            title: '确认已完成该订单',
            content: '我已与客户当面确认，客户认同我已完成该订单内的服务',
            success: function (res) {
                    if (res.confirm) {

                        app.util.request({
                            url: 'Staff/order',
                            showLoading: true,
                            data: {
                                    m: app.mdName,
                                    aid:self.data.area.id,
                                    oid:self.data.oid,
                                    submit:'done'
                            },
                            success(res) {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'success',
                                    duration: 2000,
                                    success: function () {
                                            setTimeout(function () {
                                                    self.main_load(true);
                                            }, 1800);
                                    }
                                });
                            }
                        })

                    }
            }
        });
    },

    doOrderCancel(){
        const self = this;
        wx.showModal({
            title: '确认放弃该订单',
            content: '放弃后，该订单将允许被其他服务人员接单',
            success: function (res) {
                    if (res.confirm) {

                        app.util.request({
                            url: 'Staff/order',
                            showLoading: true,
                            data: {
                                    m: app.mdName,
                                    aid:self.data.area.id,
                                    oid:self.data.oid,
                                    submit:'cancel'
                            },
                            success(res) {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'success',
                                    duration: 2000,
                                    success: function () {
                                            setTimeout(function () {
                                                    wx.navigateBack()
                                            }, 1800);
                                    }
                                });
                            }
                        })

                    }
            }
        });
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