// vp_pz/pages/physician/index.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    currentTab: 1, // 1 2 3 4
    list: [],
    meAddressData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getListData(1, 1)
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

  getListData: function (current, tab, name = '') {
    var self = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，可以指定返回的坐标类型
      success: (res) => {
        const latitude = res.latitude; // 纬度，浮点数，范围为 -90~90，负数表示南纬
        const longitude = res.longitude; // 经度，浮点数，范围为 -180~180，负数表示西经
        app.util.request({
          url: 'peihu/list',
          data: {
            name,
            sort: tab
          },
          success(res) {
            const list = res.data?.data?.list || [];
            list.forEach(item => {
              item.jl = self.calculateDistance(Number(item.latitude), Number(item.longitude), Number(latitude), Number(longitude))
            })
            console.log('newlist', list)
            self.setData({
              list
            })
          }
        })
      },
      fail: function () {}
    });
  },

  handleChangeTab: function (event) {
    var self = this;
    var itemId = event.currentTarget.dataset.id;
    if (itemId) {
      self.setData({
        currentTab: Number(itemId)
      })
      self.getListData(1, itemId)
    }
  },

  toPzRequestPage: function () {
    wx.redirectTo({
      url: `../staff/index`,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },

  onNicknameChange: function (event) {
    this.getListData(1, this.currentTab, event.detail.value);
  },

  degreesToRadians: function (degrees) {
    return degrees * Math.PI / 180;
  },

  calculateDistance: function (lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return '-'
    var self = this;
    var earthRadiusKm = 6371;
    var dLat = self.degreesToRadians(lat2 - lat1);
    var dLon = self.degreesToRadians(lon2 - lon1);
    var lat1Rad = self.degreesToRadians(lat1);
    var lat2Rad = self.degreesToRadians(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (earthRadiusKm * c).toFixed(2) + ' km';
  },

  toDetail: function (event) {
    var itemId = event.currentTarget.dataset.id;
    const jl = event.currentTarget.dataset.jl
    console.log('jl', jl)
    wx.navigateTo({
      url: `./detail?id=${itemId}&jl=${jl}`,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  }
})