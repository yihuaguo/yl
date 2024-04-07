// vp_cai/pages/index/areas.js
var app = getApp();

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

                    wx.setNavigationBarTitle({
                        title: '选择城市'
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
                url: 'Index/areas',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id
                },
                success(res) {
                        var data = res.data.data;
                        self.setData({
                                main_loaded: true,
                                now:data.now,
                                areas:data.areas
                        });
                }
        })
    },

    switchMarket(e){
        wx.reLaunch({
                url: '../index/index?aid='+e.currentTarget.dataset.id
        });
    }

})