// vp_ju/pages/user/settings.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        account:'',     // 哪个账户（seller,staff）
        money:0         // 账户可提余额
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;

        self.setData({
                account:options.account,
                money:options.money
        });

        app.util.getUserInfo(function (response) {
            self.setData({
                    userInfo: response
            });
            app.mdInit(function (cfg,mine,area) {
                self.setData({
                        cfg: cfg,
                        mine:mine,
                        area:area,
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

    doOutcash:function(e){
        var self = this;

        if(self.data._is_saving){
                return;
        }

        var outcash={};
        outcash.outcash_channel=self.data.cfg.outcash_channel;

        // 提现金额验证
        if(!e.detail.value.money){
                return wx.showToast({
                        title: '请填写提现金额',
                        icon: 'none',
                        duration: 2000
                });
        }
        outcash.money=e.detail.value.money;

        if(outcash.outcash_channel=='wx'){
                // 微信转账
                if(!e.detail.value.account){
                        return wx.showToast({
                                title: '请填写收款微信账号',
                                icon: 'none',
                                duration: 2000
                        });
                }
                outcash.account=e.detail.value.account;

                if(!e.detail.value.realname){
                        return wx.showToast({
                                title: '请填写收款账号真实姓名',
                                icon: 'none',
                                duration: 2000
                        });
                }
                //outcash.name='微信转账';
                outcash.realname=e.detail.value.realname;
        }else if(outcash.outcash_channel=='ali'){
                // 支付宝转账
                if(!e.detail.value.account){
                        return wx.showToast({
                                title: '请填写收款支付宝账号',
                                icon: 'none',
                                duration: 2000
                        });
                }
                outcash.account=e.detail.value.account;

                if(!e.detail.value.realname){
                        return wx.showToast({
                                title: '请填写收款账号真实姓名',
                                icon: 'none',
                                duration: 2000
                        });
                }
                //outcash.name='支付宝转账';
                outcash.realname=e.detail.value.realname;
        }else if(outcash.outcash_channel=='bank'){
                // 银行转账
                if(!e.detail.value.name){
                        return wx.showToast({
                                title: '请填写开户银行',
                                icon: 'none',
                                duration: 2000
                        });
                }
                outcash.name=e.detail.value.name;
                if(!e.detail.value.account){
                        return wx.showToast({
                                title: '请填写银行账号',
                                icon: 'none',
                                duration: 2000
                        });
                }
                outcash.account=e.detail.value.account;

                if(!e.detail.value.realname){
                        return wx.showToast({
                                title: '请填写收款账号真实姓名',
                                icon: 'none',
                                duration: 2000
                        });
                }
                outcash.realname=e.detail.value.realname;
        }else if(outcash.outcash_channel=='wxpay'){
                 // 企业付款
        }

        if(!e.detail.value.mobile){
                return wx.showToast({
                        title: '请填写手机号码',
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
        outcash.mobile=e.detail.value.mobile;

        // 序列化提交数据对象
        var form = encodeURI(JSON.stringify(outcash));

        self.setData({
                _is_saving:true
        });

        var url='';
        if(self.data.account=='seller'){
                url='Seller/outcash';
        }else if(self.data.account=='staff'){
                url='Staff/outcash';
        }

        app.util.request({
                url: url,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id,
                        form: form
                },
                complete(res){
                self.setData({
                        _is_saving:false
                });
                },
                success(res) {
                        app.updateMine(function(mine){
                                self.setData({
                                    mine: mine
                                });
                                wx.showModal({
                                        title: '已提交提现申请',
                                        content: res.data.msg,
                                        showCancel:false,
                                        success(res) {
                                            wx.navigateBack();
                                        }
                                });
                        });
                }
        })
    },

})