// vp/vp_sc/pages/index/index.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

        /**
         * 页面的初始数据
         */
        data: {
                filt:0,
                
                start: 0,
                more: 1,
                list: null,
                is_loading_more: false,
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                console.log(this);
                var self = this;



 
        },

        onReady: function () {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
                var self = this;

                var filt_before=this.data.filt;
                self.setData({
                        filt:app.orders_filt
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

                                // 仅首次或切换tab时刷新列表
                                if(!self.data.main_loaded || filt_before!=self.data.filt){
                                        self.loadList(true);
                                }
                        });
                });
                /****
                if(this.data.main_loaded){
                        this.setData({
                                filt:app.orders_filt
                        });
                        this.loadList(true);
                }
                 */
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

        // 加载我的订单
        loadList: function (isRef) {
                const self = this;
                var start = isRef ? 0 : self.data.start;
                app.util.request({
                        url: 'Order/lists',
                        showLoading: this.data.main_loaded?false:true,
                        data: {
                                m: app.mdName,
                                aid:self.data.area.id,
                                filt:self.data.filt,
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

        // 筛选
        onFilterChange:function(e){
                var filt=e.currentTarget.dataset.filt;
                if(filt==this.data.filt){
                        return;
                }
                this.setData({filt:filt});
                app.orders_filt=filt;
                this.loadList(true);
        },

        toOrder:function(e){
                wx.navigateTo({
                  url: '../order/order?oid='+e.currentTarget.dataset.id,
                })
        },


        onCounterOver:function(e){
                this.loadList(true);
        }

})