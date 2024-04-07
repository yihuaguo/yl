// vp_pz/pages/staff/check.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 照片
        images: new Array(),

        // 位置
        postion:null

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(this);
        var self = this;


        self.setData({
            oid:options.oid
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
    
                        self.main_load(false);
                        self.getLocation(false);
                });
         });

    },


    // 页面数据加载
    main_load(showLoading) {
        const self = this;
        app.util.request({
                url: 'Staff/order',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id,
                        submit:'checks',
                        oid:self.data.oid
                },
                success(res) {
                        var data = res.data.data;
                        self.setData({
                                now:data.now,
                                list: data.list,
                                main_loaded: true,
                        });
                }
        })
    },

    
    // 照片处理
    imageAdd: function () {
        var self = this;
        var images = self.data.images

        var url = app.util.url('Common/upload');

        wx.chooseImage({
                count: 9 - images.length,
                success: function (res) {
                        for (var i = 0; i < res.tempFilePaths.length; i++) {
                                images.push(
                                        { file: res.tempFilePaths[i], path: '' }
                                );
                        }

                        self.setData({
                                edited:true,
                                images: images
                        });
                        console.log("--------edited");
                        console.log(images);
                        for (var i = 0; i < images.length; i++) {
                                if (images[i].path == '') {
                                        // var idx=i; // 由于异步上传，i会自增，所以用idx保留
                                        wx.uploadFile({
                                                url: url,
                                                filePath: images[i].file,
                                                name: 'file',
                                                formData: {
                                                        'path': images[i].file
                                                },
                                                success: function (ret) {
                                                        console.log(ret);
                                                        ret.data = JSON.parse(ret.data);
                                                        console.log(ret.data.data);

                                                        if (ret.data.code!=1){
                                                                wx.showModal({
                                                                        title: '图片上传失败',
                                                                        content: ret.data.message,
                                                                        showCancel:false,
                                                                        success(res) {
                                                                                var imgs = self.data.images;
                                                                                for (var j = 0; j < imgs.length; j++) {
                                                                                        if (imgs[j].file == ret.data.data.file) {
                                                                                            imgs.splice(j, 1);
                                                                                            self.setData({
                                                                                              images: imgs
                                                                                            });
                                                                                        }
                                                                                }
                                                                        }
                                                                });
                                                        }else{
                                                                var imgs = self.data.images;
                                                                for (var j = 0; j < imgs.length; j++) {
                                                                        if (imgs[j].file == ret.data.data.file) {
                                                                                imgs[j] = ret.data.data;
                                                                        }
                                                                }

                                                                self.setData({
                                                                        images: imgs
                                                                });
                                                                console.log("--------");
                                                                console.log(imgs);
                                                        }

                                                }
                                        });
                                }
                        }
                }
        });
    },

    imageRemove: function (e) {
            var self = this;
            wx.showModal({
                    title: '操作提示',
                    content: '确定移除这张图片？',
                    success: function (res) {
                            if (res.confirm) {
                                    var idx = e.currentTarget.dataset.idx;
                                    var images = self.data.images;
                                    images.splice(idx, 1);
                                    self.setData({
                                                edited:true,
                                                images: images
                                    });
                            }
                    }
            });
    },


    // 定位
    getLocation(){
        const self = this;
        self.setData({'is_posing':true});
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                    // 定位成功，获取最近的店，并提示是否切换
                    //self.main_load(false);

                    app.util.request({
                            url: 'Index/location',
                            showLoading:false,
                            data: {
                                    m: app.mdName,
                                    submit:'pos',
                                    lat:res.latitude,
                                    lng:res.longitude
                            },
                            complete(){
                                self.setData({'is_posing':false});
                            },
                            success(res2) {
                                    var data = res2.data.data;
                                    console.log("==所在位置==");
                                    console.log(data);
                                    self.setData({'postion':data});
                            }
                    })
            },
            fail(res) {
                        self.setData({'is_posing':false});
                        console.log("fail");
                        console.log(res);
            }
        });
    },

    toSettings(){
        const self = this;
        wx.openSetting({
                success (res) {
                        console.log(res.authSetting);
                        if(res.authSetting['scope.userLocation']){
                                self.getLocation();
                        }
                        // res.authSetting = {
                        //   "scope.userInfo": true,
                        //   "scope.userLocation": true
                        // }
                }
        })
    },


        doSave:function(e){
                var self = this;

                if(self.data._is_saving){
                return;
                }


                var check=e.detail.value;

                var images = self.data.images;
                console.log(images);
                for (var i = 0; i < images.length; i++) {
                        if (images[i].path == '') {
                                wx.showToast({
                                        title: '图片正在上传，请稍后再试',
                                        icon: 'none',
                                        duration: 2000
                                });
                                return;
                        }
                        /*** 不处理，原格式保存
                        else {
                                images.push(self.data.images[i].path);
                        }
                        */
                }
                /***
                if(images.length<1){
                wx.showToast({
                        title: '请至少上传一张商户照片',
                        icon: 'none',
                        duration: 2000
                });
                return;
                }
                 */

                if(!check.content && images.length==0){
                        return wx.showToast({
                                title: '请用照片或文字记录服务进度',
                                icon: 'none',
                                duration: 2000
                        });
                }

                check.images=images;

                check.postion=this.data.postion;


                // 序列化提交数据对象
                var form = encodeURI(JSON.stringify(check));

                self.setData({
                        _is_saving:true
                });

                app.util.request({
                        url: 'Staff/order',
                        data: {
                                m: app.mdName,
                                aid:self.data.area.id,
                                submit:'check',
                                oid:self.data.oid,
                                form:form
                        },
                        complete(res){
                        self.setData({
                                _is_saving:false
                        });
                        },
                        success(res) {
                                app.reInit=true;
                                wx.showModal({
                                        title: res.data.msg,
                                        confirmText: '确定',
                                        showCancel: false,
                                        success:function(){
                                                wx.navigateBack();
                                        }
                                });
                                
                                /***
                                wx.showToast({
                                        title: res.data.message,
                                        icon: 'success',
                                        duration: 2000,
                                        success: function () {
                                        setTimeout(function () {
                                                wx.redirectTo({
                                                        url: '../puber/reg',
                                                });
                                        }, 2000); 
                                        }
                                });
                                
                        
                        self.setData({
                                "live._id":res.data.data.live._id
                        });
                        self.showSavedModal();
                        */
                        }
                })
        },


        checkImagesView:function(e){
                var list = this.data.list;
                for(var i=0;i<list.length;i++){
                        if(list[i].id==e.currentTarget.dataset.id){
                                var imgs=new Array();
                                for(var j=0;j<list[i].images.length;j++){
                                        imgs.push(list[i].images[j].url);
                                }
                                wx.previewImage({
                                        current: e.currentTarget.dataset.src, // 当前显示图片的http链接
                                        urls: imgs// 需要预览的图片http链接列表
                                });
                                break;
                        }
                }
        },

})