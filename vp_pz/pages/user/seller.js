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

    _regModal: false
  },

  /**
   * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {

  },


  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;

    app.util.getUserInfo(function (response) {
      self.setData({
        userInfo: response
      });
      app.mdInit(function (cfg, mine, area) {
        self.setData({
          cfg: cfg,
          mine: mine,
          area: area,
          main_loaded: true
        });

        if (!mine.avatar || !mine.nickname) {
          wx.showModal({
            title: '成为推广者需要先完善您的个人资料',
            confirmText: '前往完善',
            cancelText: '取消',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: 'profile'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
          return;
        }

        if (!mine.mobile) {
          wx.showModal({
            title: '成为推广者需要补充您的手机号码',
            confirmText: '前往补充',
            cancelText: '取消',
            success: function (res) {
              if (res.confirm) {
                console.log(123);
                wx.navigateTo({
                  url: 'mobile'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
          return;
        }

        // 如果我还不是推广者
        if (mine.seller_switch == 0) {
          // 关闭
          if (area.seller_reg == 1) {
            wx.showModal({
              title: '目前暂停推广者加入',
              confirmText: '返回',
              showCancel: false,
              success: function () {
                wx.navigateBack();
              }
            });
            return;
          } else {
            self.setData({ _regModal: true });
          }
        }

        //self.main_load(true);
        self.loadList(true);
      });
    });
  },

  toServer: function () {
    wx.navigateTo({
      url: '../index/server',
    })
  },

  toSeller: function () {
    const self = this;
    app.util.request({
      url: 'Seller/reg',
      showLoading: false,
      data: {
        m: app.mdName,
        aid: self.data.area.id
      },
      complete(res) {
        wx.stopPullDownRefresh();
      },
      success(res) {
        app.updateMine(function (mine) {
          self.setData({
            mine: mine
          });
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                self.setData({ _regModal: false });
              }, 2000);
            }
          });
        });
      }
    });
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


  toOutcash() {
    wx.navigateTo({
      url: 'outcash?account=seller&money=' + this.data.mine.sell_money,
    })
  },

  toProfile() {
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


  // 页面数据加载
  loadList(isRef = true) {
    const self = this;
    if (isRef) {
      self.setData({
        start: 0,
        more: 1,
        list: null
      });
    }
    app.util.request({
      url: 'Seller/moneys',
      showLoading: false,
      data: {
        m: app.mdName,
        aid: self.data.area.id,
        start: self.data.start
      },
      complete(res) {
        wx.stopPullDownRefresh();
        self.setData({
          is_loading_more: false
        });
      },
      success(res) {
        console.log(res);
        var data = res.data.data;
        var list = self.data.list ? self.data.list : new Array();
        list = list.concat(data.list);
        self.setData({
          list: list,
          start: data.start,
          more: data.more
        });
      }
    })
  },


  showShareModal() {
    this.setData({ _shareModal: true });
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

})