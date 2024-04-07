// vp_timer/pages/index/user.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _shareModal: false,
    statistic: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this);
    var self = this;
  },


  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    app.util.getUserInfo(function (response) {
      console.log('response', response)
      self.setData({
        userInfo: response
      });
      app.mdInit(function (cfg, mine, area) {
        self.setData({
          cfg: cfg,
          mine: mine,
          area: area,
          main_loaded: true,
        });

        self.main_load(false);
      });
    });

    // app.util.request({
    //   url: 'User/index',
    //   data: {},
    //   success(res) {
    //     var data = res.data.data;
    //     console.log('data--', data)
    //     self.setData({
    //       statistic: data.statistic,
    //     });
    //   }
    // })
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
   * 分享
   */
  onShareAppMessage: function () {
    console.log(this.getSharePath());
    return {
      title: this.data.cfg.share_title ? this.data.cfg.share_title : this.data.cfg.name,
      imageUrl: this.data.cfg.share_image_url,
      path: this.getSharePath()
    }
  },
  onShareTimeline: function () {
    return {
      title: this.data.cfg.share_title ? this.data.cfg.share_title : this.data.cfg.name,
      imageUrl: this.data.cfg.logo_url,
      query: 'aid=' + this.data.area.id + '&fuid=' + this.data.mine.id
    }
  },
  getSharePath: function () {
    var page = app.mdName + '/pages/index/index';
    var ps = '?aid=' + this.data.area.id + '&fuid=' + this.data.mine.id
    return page + ps;
  },

  // 页面数据加载
  main_load(showLoading) {
    const self = this;
    app.util.request({
      url: 'User/index',
      showLoading: showLoading ? true : false,
      data: {
        m: app.mdName
      },
      complete(res) {
        wx.stopPullDownRefresh();
      },
      success(res) {
        var data = res.data.data;
        console.log('data', data);
        self.setData({
          mine: data.mine,
          statistic: data.statistic,
          staff: data.staff
        });
      }
    })
  },


  toProfile: function () {
    wx.navigateTo({
      url: 'profile',
    })
  },

  toOrders: function (e) {
    app.orders_filt = e.currentTarget.dataset.filt ? e.currentTarget.dataset.filt : 0;
    wx.switchTab({
      url: '../order/index',
    })
  },

  showShareModal() {
    this.setData({
      _shareModal: true
    });
  },

})