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
                url: 'Order/detail',
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

    onCounterOver:function(e){
        this.main_load(true);
    },

    doCopy(e){
        wx.setClipboardData({
            data: e.currentTarget.dataset.copy
        })
    },
    
    doPay(e){
        const self = this;

        if(self.data._is_loading){
            return;
        }

        self.setData({
            _is_loading:true
        });

        app.util.request({
            url: 'Order/pay',
            data: {
                m: app.mdName,
                aid:self.data.area.id,
                oid:self.data.oid
            },
            complete(res){
                self.setData({
                    _is_loading:false
                });
            },
            success(res) {
                wx.requestPayment({
                    'timeStamp': res.data.data.timeStamp,
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data.package,
                    'signType': 'MD5',
                    'paySign': res.data.data.paySign,
                    'success': function (resp) {
                            self.main_load(true);
                    },
                    'fail': function (res) {
                            console.log('支付失败');
                            console.log(res);
                    }
                })
            }
        }) 
    },

    doCancel(e){
        const self = this;

        if(self.data._is_doing){
            return;
        }

        wx.showModal({
            title: '确定取消该订单？',
            success (res) {
              if (res.confirm) {
                    self.setData({
                        _is_doing:true
                    });
                    app.util.request({
                        url: 'Order/cancel',
                        data: {
                            m: app.mdName,
                            aid:self.data.area.id,
                            oid:self.data.oid
                        },
                        complete(res){
                            self.setData({
                                _is_doing:false
                            });
                        },
                        success(ret) {
                            wx.showModal({
                                title:'订单已取消',
                                content: ret.data.msg,
                                confirmText: '确定',
                                showCancel: false,
                                success:function(){
                                    self.main_load(true);
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
})