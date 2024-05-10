// vp_pz/pages/newDetail/newDetail.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        detail: {},
        hid: '',
        dId: undefined,
        nickname: undefined
    },
    onShareAppMessage() {
        let that = this;
        return {
            title: that.data.detail.name,//自定义标题, 默认值小程序名称（当前小程序名称）
            // path: '/pages/index/index',
            // imageUrl: 'https://www.shuzhiqiang.com/static/favicon.png',//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4（默认值：使用默认截图）
        }
    },
    // 注意：只有定义了此事件处理函数，右上角菜单才会显示“分享到朋友圈”按钮
    onShareTimeline: function () {
        let that = this;
        return {
            title: that.data.detail.name,//自定义标题, 默认值小程序名称（当前小程序名称）
            // imageUrl: 'https://www.shuzhiqiang.com/static/favicon.png',//自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1（默认使用小程序 Logo）
            // query: { path: 'pyq' },//自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分（默认值：当前页面路径携带的参数）
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            id: options.id,
            hid: options.hid
        })
        if (options.dId) {
            this.setData({
                dId: options.dId,
                nickname: options.nickname
            })
        }
        this.getDetail();
    },
    goPay() {
        let canshu = '';
        if(this.data.dId){
            canshu = '&dId=' + this.data.dId + '&nickname=' + this.data.nickname
        }
        wx.navigateTo({
            url: '../index/service?svid=' + this.data.id + '&hid=' + this.data.hid + canshu
        })
    },
    getDetail() {

        app.util.request({
            url: 'service/detail',
            data: {
                id: this.data.id,
                hid: this.data.hid,
            },
            success: res => {
                var data = res.data.data;
                console.log(data);
                this.setData({
                    detail: data.detail
                })
                wx.setNavigationBarTitle({
                    title: data.detail.name,
                })
            }
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})