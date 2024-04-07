// vp/vp_sc/pages/index/index.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

        /**
         * 页面的初始数据
         */
        data: {
                searcher:'',
                search:'',
                
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
                                    area:area,
                                    main_loaded:true
                            });
                        });
                 });
        },

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

        onSearchInput:function(e){
                this.setData({searcher:e.detail.value});
        },

        doSearch:function(e){
                if(!this.data.searcher){
                        wx.showToast({
                                title: '查找内容不能为空',
                                icon: 'none',
                                duration: 2000
                        });
                        return
                }
                this.setData({search:this.data.searcher});

                this.loadList(true);
        },

        // 查找
        loadList: function (isRef) {
                const self = this;
                var start = isRef ? 0 : self.data.start;
                app.util.request({
                        url: 'Index/search',
                        showLoading: this.data.main_loaded?false:true,
                        data: {
                                m: app.mdName,
                                aid:self.data.area.id,
                                search:self.data.search,
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

        // 前往医院
        toHospital:function(e){
                wx.navigateTo({
                        url: '../index/hospital?hid='+e.currentTarget.dataset.hid,
                })
        },
        

})