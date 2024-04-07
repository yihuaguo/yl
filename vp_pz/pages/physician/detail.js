// vp_pz/pages/physician/detail.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    service: [],
    pzId: undefined,
    meAddressData: {},
    _shareModal: false,
    backgroundImageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAA8CAYAAADSfGxZAAAAAXNSR0IArs4c6QAAAfBJREFUaEPtm01OwlAUhe8pM1iCiatwF0JMXIGOjEYXYPAnBlyBDpypC3BgBDdg4sjEoYkzjZo4IXEAcWDfJa9/FpC2GAaUHkZAH4++j3PPfS33QsY8Ku3jNVVTA2RJBAsiUho3dkbed0X0XVUeAOemu1y/mOS8MDzYAhAxRyJYnGSi2RurryLOYVYgAyDKreYJINuzt6j/n5GqnPaqeztpM0Qg5hFCuPgsMDwQfjjoeRq1fB/HelKYBCAaL/n3hLSfSTvGYEthPkpu6bm7Uv+MfwLFUIO/ZFW5FMG9fW7EffquHtyFMFBuNa4ArKbxnIfjavRR4JxFa1Hz1qvt39rXqLSLEBaRbXZUnd34jxoqA5V28ycHm6VpCdKoYnN4MrhybUHotL4lD/OoYmP4PK0qCMIzUf0iCM8pxRBEECcEQRCDlklFUBFUxMg+Ithic0NFELHooFnSLGmWNEv/LtXo1SfNkmY5eueEWYNZg1mDWYNZIxYFTJ8BDIIgiMHsQEVQEVTEn/9AMjQYGgwNhkZSeQI9gh5Bj6BH0COSCNAjMngES4d8SCwmC8QSlhey4NQvOGUJsi1OZ1H6b1F6EZpWQlNMaFOwQ4oRHimNKz6IIqgiQyuThcHmttjGax5hZOnwswjYABuWBYy7TilaS3QfZ1iQ4itneEUAAAAASUVORK5CYII='
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var self = this;
    const id = self.options?.id
    if (!id) return
    app.util.request({
      url: 'peihu/detail',
      data: {
        id
      },
      success(res) {
        const data = res.data?.data?.detail || {}
        const service = res.data?.data?.service || []

        self.setData({
          pzId: self.options?.id,
          userData: data,
          service,
          backgroundImageUrl: data.avatar_url
        })
      }
    })
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，可以指定返回的坐标类型
      success: function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为 -90~90，负数表示南纬
        var longitude = res.longitude; // 经度，浮点数，范围为 -180~180，负数表示西经
        self.setData({
          meAddressData: {
            latitude,
            longitude
          }
        })
      },
      fail: function () {}
    });
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

  showShareModal() {
    this.setData({
      _shareModal: true
    });
  },

  degreesToRadians: function (degrees) {
    return degrees * Math.PI / 180;
  },

  calculateDistance: function (lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || lon2) return '-'
    var self = this;
    var earthRadiusKm = 6371;
    var dLat = self.degreesToRadians(lat2 - lat1);
    var dLon = self.degreesToRadians(lon2 - lon1);
    var lat1Rad = self.degreesToRadians(lat1);
    var lat2Rad = self.degreesToRadians(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  },

  toService: function (e) {
    wx.navigateTo({
      url: '../index/service?svid=' + e.currentTarget.dataset.svid + '&hid=' + this.data.userData.id +
        '&dId=' + this.data?.pzId
    })
  },
})