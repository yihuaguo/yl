// vp_wu/pages/index/html.js
var app = getApp();
var vp = require('../../resource/js/vp.js');
var WxParse = require('../../resource/js/wxParse/wxParse.js');
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
      // 页面初始化 options为页面跳转所带来的参数
      var self = this;
      //var title = options.title ? options.title:'';
      var cmd = options.cmd ? options.cmd : '';
      var id = options.id ? options.id : '';

      /***
      if (!title){
          if (page =='set_app_guide_fresh'){
                  title='新手指引';
          }else if (page == 'set_app_protocol_resp') {
                  title = '免责声明'; 
          }else if (page == 'set_app_protocol') {
                  title = '使用协议'; 
          } else if (page == 'set_app_qa'){
                  title = '常见问题'; 
          } else if (page == 'set_app_qa_tui'){
                  title = '常见问题'; 
          } else if (page == 'coin_protocol') {
              title = '规则说明';
          } else if (page == 'va_guide'){
                  title = '关于等级';
          } else if (page == 'set_offical_contact') {
                  title = '官方交流群';
          }
      }
       */


      self.setData({
        cmd: cmd,
        id:id
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

              //wx.setNavigationBarTitle({
              //  title: '选择城市'
              //});
              
              self.main_load(false);
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },



  // 页面数据加载
  main_load(showLoading) {
      const self = this;
      app.util.request({
              url: 'Index/html',
              showLoading: showLoading ? true : false,
              data: {
                      m: app.mdName,
                      cmd:self.data.cmd,
                      id:self.data.id
              },
              success(res) {
                      var data = res.data.data;
                      console.log(data);
                      WxParse.wxParse('data', 'html', data.content, self, 5);
                        wx.setNavigationBarTitle({
                          title: data.title
                        })
                      self.setData({
                        server:data.server,
                        main_loaded: true
                      });
              }
      })
  },
})