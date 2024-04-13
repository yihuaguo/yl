// vp_pz/pages/user/coupon.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var self = this;
    self.handleGetList()
    wx.setNavigationBarTitle({
      title: '请选择优惠券',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  handleGetList: function () {
    var self = this;
    app.util.request({
      url: 'coupon/my',
      data: {},
      success(res) {
        console.log('res', res)
        const list = res.data?.data?.list || [];
        self.setData({
          list
        })
      }
    })
  },

  handleSelect: function (event) {
    let that = this;
    var itemId = event.currentTarget.dataset.id;
    if (!itemId) return
    let pages = getCurrentPages();
    if (pages.length >= 2) {
      var prevPage = pages[pages.length - 2]; //上一个页面
      //给pageA页面赋值
      prevPage.setData({
        coupon_id:itemId
      });

      wx.navigateBack();
    }
  }
})