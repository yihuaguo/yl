// vp_xx/pages/index/poster.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _create_poster_ed:false
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
                    self.createPoster();
                });
         });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            windowHeight:wx.getSystemInfoSync().windowHeight
        })
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

    
        getSharePath:function(qccode=false){
                var page = app.mdName + '/pages/index/index';
                if(!qccode){
                        var ps = '?aid='+this.data.area.id+'fuid=' + this.data.mine.id
                        return page + ps;
                }else{
                        var scene = this.data.area.id+'_'+this.data.mine.id;
                        return app.util.url('Common/accode')+'&m=' + app.mdName + '&page=' + encodeURIComponent(page) + '&scene=' + scene;
                }
        },

    
    createPoster: function () {
        var that = this;

        app.util.showLoading();
        wx.getImageInfo({
                src: that.data.cfg.share_poster_url,
                fail: function () {
                        wx.hideLoading();
                        wx.showToast({
                                title: '生成失败，未能加载分享图片，请重试',
                                icon: 'none',
                                duration: 2000
                        });
                },
                success: function (resPoster) {
                        var rate = wx.getSystemInfoSync().windowWidth/750;


                        console.log(resPoster);
                        // 640 800 根据封面图大小确定画布大小，宽度不能宽于250，高度不能高于300
                        var pw=640*rate;
                        var ph=960*rate;
                       

                        /** 目前没有二维码权限 使用测试图片*/
                        wx.getImageInfo({
                                src:  that.getSharePath(true),//"https://att.vpower.top/images/12/2020/07/VUWPEtTLDmAtwA8N8Ty4dEAF4eDwTA.jpg",//that.getSharePath(true),//"https://att.vpower.top/images/12/2020/07/VUWPEtTLDmAtwA8N8Ty4dEAF4eDwTA.jpg",//that.getSharePath(true),//"https://att.vpower.top/images/12/2020/07/VUWPEtTLDmAtwA8N8Ty4dEAF4eDwTA.jpg",//that.getSharePath(true), //"https://att.jsxdzj.org/gh_ff94f026c037_258.jpg",//that.data._baoQrUrl,
                                fail: function () {
                                        wx.hideLoading();
                                        wx.showToast({
                                                title: '生成失败，未能加载二维码，请重试',
                                                icon: 'none',
                                                duration: 2000
                                        });
                                },
                                success: function (resAccode) {
                                        var context = wx.createCanvasContext('posterCanvas');
                                        //var tpl = "../../resource/images/coin_bao_tpl.jpg";
                                        //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
                                        //不知道是什么原因，手机环境能正常显示
                                        context.drawImage(resPoster.path, 0, 0, pw, ph);

                                        // 绘制小程序码
                                        vp.VP_CIRCLEIMG(context, resAccode.path, pw/2-50, ph-180, 50);
                                        
                                        //context.drawImage(resAccode.path, pw/2-50, ph-180, 100, 100);

                                        /*****
                                        // 绘制标题
                                        context.setFontSize(14);
                                        context.setFillStyle("#353535");
                                        that.VP_CANVAS_TEXT_ELLIPSIS(context,that.data.live.title,10,ph+22,pw-50-30);
                                        
                                        // 绘制说明
                                        context.setFontSize(10);
                                        context.setFillStyle("#bbbbbb");
                                        //that.VP_CANVAS_TEXT_ELLIPSIS("长按识别订阅提醒",10,ph+30,pw-50-30);
                                        context.fillText("长按二维码订阅开播提醒", 10, ph+40);
                                         */

                                        context.draw();

                                        wx.hideLoading();
                                        that.setData({ _create_poster_ed:true });
                                }
                        });

                }
        });

},

VP_CANVAS_TEXT_ELLIPSIS : function(context,text, x, y, maxWidth) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
        return;
    }

    var canvas = context.canvas;

    if (typeof maxWidth == 'undefined') {
        maxWidth = (canvas && canvas.width) || 300;
    }

    // 字符分隔为数组
    var arrText = text.split('');
    var line = '';

    for (var n = 0; n < arrText.length; n++) {
        var testLine = line + arrText[n];
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            //line = arrText[n];
            line=line+'...';
            break;
        } else {
            context.fillText(line, x, y);
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    //context.fillText(line, x, y);
},

savePoster:function(){
        wx.showLoading({
            title: '正在保存',
            mask: true,
        });
        wx.canvasToTempFilePath({
                canvasId: 'posterCanvas',
                success: function (res) {
                        var tempFilePath = res.tempFilePath;
                        console.log(tempFilePath);
                        wx.saveImageToPhotosAlbum({
                                filePath: tempFilePath,
                                success(res) {
                                        wx.hideLoading();
                                        wx.showToast({
                                            title: '已保存到相册',
                                            icon: 'success',
                                            duration: 2000
                                        });
                                },
                                fail(res) {
                                        wx.hideLoading();
                                        wx.showToast({
                                                title: '图片保存失败，请重试',
                                                icon: 'none',
                                                duration: 2000
                                        });
                                }
                        });

                },
                fail: function (res) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '图片保存失败，请重试',
                            icon: 'none',
                            duration: 2000
                        });
                        console.log(res);
                }
        });
    },
    /** 生成分享图片相关  */
})