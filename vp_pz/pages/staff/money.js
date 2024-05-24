// vp_close/pages/star/home.js
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

    _outcashModal: false
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
      app.mdInit(function (cfg, mine, area) {
        self.setData({
          cfg: cfg,
          mine: mine,
          area: area
        });

        self.main_load(false);
        self.loadList(false);
      });
    });
  },

  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.main_loaded) {
      this.main_load(true);
      this.loadList(true);
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

  /***
   onPullDownRefresh: function () {
           //wx.stopPullDownRefresh()
           this.main_load();
   },
    */

  main_load(showLoading) {
    const self = this;
    app.util.request({
      url: 'Staff/index',
      showLoading: showLoading ? true : false,
      data: {
        m: app.mdName,
        aid: self.data.area.id,
      },
      success(res) {
        var data = res.data.data;
        self.setData({
          main_loaded: true,
          staff: data.staff
        });
      }
    })
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
      url: 'Staff/moneys',
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

  toOutcash() {
    wx.navigateTo({
      url: '../user/outcash?account=staff&money=' + this.data.staff.money,
    })
  },

  /*****
  showOutcashModal(){
          this.setData({_outcashModal:true});
  },

  hideOutcashModal(){
          this.setData({_outcashModal:false});
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
          outcash.mobile=e.detail.value.mobile;

          // 序列化提交数据对象
          var form = encodeURI(JSON.stringify(outcash));

          self.setData({
                  _is_saving:true
          });

          app.util.request({
                  url: 'Staff/outcash',
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
                          wx.showModal({
                                  title: '已提交提现申请',
                                  content: res.data.msg,
                                  showCancel:false,
                                  success(res) {
                                          self.hideOutcashModal();
                                          self.main_load(true);
                                          self.loadList(true);
                                  }
                          });
                  }
          })
  },
   */


})