// vp_pz/pages/staff/team.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _masterModal:false,
        _inviteModal:false
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
                app.mdInit(function (cfg,mine,area) {
                        self.setData({
                                cfg: cfg,
                                mine:mine,
                                area:area
                        });
    
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


       /**
         * 分享
        */
       onShareAppMessage: function () {
            console.log(this.getSharePath());
            return {
                    title: this.data.cfg.share_title?this.data.cfg.share_title:this.data.cfg.name,
                    imageUrl: this.data.cfg.share_image_url,
                    path: this.getSharePath()
            }
        },
        onShareTimeline:function(){
            return {
                title: this.data.cfg.share_title?this.data.cfg.share_title:this.data.cfg.name,
                imageUrl: this.data.cfg.logo_url,
                query:  'aid='+this.data.area.id+'&fuid=' + this.data.mine.id
            }
        },
        getSharePath:function(){
                var page = app.mdName + '/pages/index/index';
                var ps = '?aid='+this.data.area.id+'&fuid=' + this.data.mine.id
                return page + ps;
        },

    showShareModal:function(){
        const self=this;
        wx.hideTabBar({
            //animation:true,
            complete:function(){
                self.setData({
                    _shareModal: true
                });
            }
        });
    },
    hideShareModal:function(){
        this.setData({
          _shareModal: false
        });
        wx.showTabBar();
    },
    

    // 页面数据加载
    main_load(showLoading) {
        const self = this;
        app.util.request({
                url: 'Staff/team',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id
                },
                success(res) {
                    var data = res.data.data;
                    self.setData({
                            main_loaded:true,
                            invite_code:data.invite_code,
                            team:data.team,
                            staff:data.staff,
                            list:data.list
                    });
                }
        })
    },

    doCopy(e){
        wx.setClipboardData({
            data: e.currentTarget.dataset.copy
        })
    },

    showMasterModal(){
        this.setData({_masterModal:true});
    },

    hideMasterModal(){
            this.setData({_masterModal:false});
    },


    showInviteModal(){
        this.setData({_inviteModal:true});
    },

    hideInviteModal(){
            this.setData({_inviteModal:false});
    },

})