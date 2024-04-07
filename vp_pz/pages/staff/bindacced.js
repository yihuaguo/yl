// vp_pz/pages/staff/bindacc.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        binded:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self=this;

        if(!options.openid){
            wx.showModal({
              title:'绑定失败，请检查应用配置',
              success:function(ret){
                  wx.navigateBack();
              }
            })
        }

        console.log(options.openid);

        this.setData({
            openid:options.openid
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

                    self.dobindacc(true);
            });
        });
        
    },


    // 页面数据加载
    dobindacc(showLoading) {
        const self = this;
        app.util.request({
                url: 'Staff/bindacc',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        openid:self.data.openid
                },
                success(res) {
                        self.setData({binded:true});
                }
        })
    },
    
})