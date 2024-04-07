// vp_timer/pages/index/user.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

        /**
         * 页面的初始数据
         */
        data: {
                start: 0,
                more: 1,
                list: null,
                is_loading_more: false,

                order:null,// 当前待派订单,
                _odmanaModal:false,

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


        onReady: function () {
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
                if(this.data.main_loaded){
                        this.main_load(false);
                }
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

        // 页面数据加载
        main_load(showLoading) {
                const self = this;
                app.util.request({
                        url: 'Staff/index',
                        showLoading: showLoading ? true : false,
                        data: {
                                m: app.mdName,
                                aid:self.data.area.id,
                        },
                        success(res) {
                                var data = res.data.data;
                                console.log(data);
                                if(!data.staff || data.staff.status!=20){
                                        wx.redirectTo({
                                          url: 'reg'
                                        })
                                }else{
                                        self.setData({
                                                main_loaded:true,
                                                staff:data.staff,
                                                statistic:data.statistic,
                                                staffs:data.staffs
                                        });

                                        self.loadList(true);
                                }
                        }
                })
        },


        toProfile(){
                wx.navigateTo({
                  url: 'profile',
                })
        },


/**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {
                const self = this;
                if (this.data.is_loading_more || this.data.more == 0) {
                        return;
                }
                self.setData({
                        is_loading_more: true
                });
                this.loadList(false);
        },

        // 加载待接的订单
        loadList: function (isRef) {
                const self = this;
                var start = isRef ? 0 : self.data.start;
                app.util.request({
                        url: 'Staff/orders_client',
                        showLoading: false,
                        data: {
                                m: app.mdName,
                                aid:self.data.area.id,
                                start:start
                        },
                        complete(res) {
                                self.setData({
                                        is_loading_more: false
                                });
                        },
                        success(res) {
                                var data = res.data.data;
                                console.log(data);
                                var list = new Array();
                                if (!isRef) {
                                        list = self.data.list?self.data.list:new Array();
                                }
                                list = list.concat(data.list);
                                self.setData({
                                        now:data.now,
                                        list: list,
                                        start: data.start,
                                        more: data.more,
                                        main_loaded: true,
                                });
                        }
                })
        },

        toOrder:function(e){
                wx.navigateTo({
                  url: '../staff/order?oid='+e.currentTarget.dataset.id,
                })
        },

        getOrder: function (e) {
                var self=this;
                var id=e.currentTarget.dataset.id;

                wx.showModal({
                        title: '确认接单',
                        content:'接单后请尽快与客户联系并确认服务细节',
                        success: function (res) {
                                if (res.confirm) {
                                        app.util.request({
                                                url: 'Staff/order_get',
                                                data: {
                                                        m: app.mdName,
                                                        aid:self.data.area.id,
                                                        oid:id
                                                },
                                                success(res) {
                                                        wx.showModal({
                                                                title: res.data.msg,
                                                                confirmText: '确定',
                                                                showCancel: false,
                                                                success:function(){
                                                                        wx.navigateTo({
                                                                          url: 'order?oid='+id
                                                                        })
                                                                }
                                                        });
                                                }
                                        });
                                }
                        }
                });
        },

        hideOdmanaModal:function(){
                this.setData({
                        _odmanaModal: false
                });
        },
        
        giveOrder: function (e) {
                var index = e.currentTarget.dataset.index;
                var order = this.data.list[index];

                this.setData({
                        order:order,
                        _odmanaModal: true
                });
        },

        doGiveOrder:function(e){
                var self=this;
                var order = this.data.order;
                var nickname = e.currentTarget.dataset.nickname;
                var staff_id = e.currentTarget.dataset.id;
                wx.showModal({
                        title: '确认派单',
                        content:'确定将该订单派给【'+nickname+'】处理？',
                        success: function (res) {
                                if (res.confirm) {
                                        app.util.request({
                                                url: 'Staff/order_give',
                                                data: {
                                                        m: app.mdName,
                                                        aid:self.data.area.id,
                                                        oid:order.id,
                                                        staff_id:staff_id
                                                },
                                                success(res) {
                                                        self.loadList(true);
                                                        self.hideOdmanaModal();
                                                        wx.showModal({
                                                                title: res.data.msg,
                                                                confirmText: '完成',
                                                                showCancel: false
                                                        });
                                                }
                                        });
                                }
                        }
                });
        },

        makePhoneCall:function(e){
                wx.makePhoneCall({
                        phoneNumber: e.currentTarget.dataset.tel
                });
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