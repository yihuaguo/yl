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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  handleGetList: function () {
    var self = this;
    app.util.request({
      url: 'coupon/list',
      data: {"from":"my"},
      success(res) {
        console.log('res', res)
        const list = res.data?.data?.list || [];
        self.setData({
          list
        })
      }
    })
  },

  handleGetCoupon: function (event) {
    var itemId = event.currentTarget.dataset.id;
    if (!itemId) return
    var self = this;
    app.util.request({
      url: 'coupon/get',
      data: {
        id: itemId
      },
      success(res) {
        console.log('res', res)
        self.handleGetList()
      }
    })
  }
})