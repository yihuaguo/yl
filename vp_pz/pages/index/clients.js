// vp_cai/pages/index/citys.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isClientAdd:false,

        client:{} // 新增模型
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(this);
        var self = this;


        self.setData({
            act:options.act?options.act:''
        });

        if(options.act=='select'){
            wx.setNavigationBarTitle({
              title: '请选择服务对象',
            })
        }else{
            wx.setNavigationBarTitle({
              title: '服务对象管理',
            })
        }

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

    
    // 页面数据加载
    main_load(showLoading) {
        const self = this;
        //console.log("self.data.like "+self.data.like);
        app.util.request({
                url: 'User/clients',
                showLoading: showLoading ? true : false,
                data: {
                        m: app.mdName,
                        aid:self.data.area.id
                },
                success(res) {
                        var data = res.data.data;
                        self.setData({
                                main_loaded: true,
                                now:data.now,
                                clients:data.clients,
                                isClientAdd:((data.clients && data.clients.length>0)?false:true)
                        });
                }
        })
    },

    onClientSelected:function(e){
        if(this.data.act==''){
            return;
        }
        var index = e.currentTarget.dataset.index
        var client = this.data.clients[index];

        let pages = getCurrentPages();
        if (pages.length >= 2) {
            var prevPage = pages[pages.length - 2]; //上一个页面
            //给pageA页面赋值
            prevPage.setData({
                client:client
            });

            wx.navigateBack();
        }
    },

    removeClient:function(e){
        var self=this;
        var id = e.currentTarget.dataset.id;
        wx.showModal({
                title: '确定移除该服务对象信息？',
                success (res) {
                    if (res.confirm) {
                    app.util.request({
                        url: 'User/client',
                        data: {
                            m: app.mdName,
                            aid:self.data.area.id,
                            submit:'remove',
                            id:id   
                        },
                        success(res) {
                                wx.showToast({
                                        title: res.data.msg,
                                        icon: 'success',
                                        duration: 2000,
                                        success: function () {
                                                setTimeout(function () {
                                                        self.main_load(true);
                                                }, 1800);
                                        }
                                });
                        }
                    });
                    } 
                }
        });
    },


    switchClientAdd:function(e){
        this.setData({
            isClientAdd:!this.data.isClientAdd
        });
    },


    onSexChange:function(e){
        this.setData({
            'client.sex':e.currentTarget.dataset.sex
        });
    },

    
    clientSave:function(e){
        var self = this;

        if(self.data._is_saving){
            return;
        }

        var client = this.data.client;

        if(!e.detail.value.name){
            return wx.showToast({
                title: '请填写就诊人姓名',
                icon: 'none',
                duration: 2000
            });
        }
        client.name=e.detail.value.name;

        if(!(client.sex>0)){
            return wx.showToast({
                title: '请选择服务对象性别',
                icon: 'none',
                duration: 2000
            });
        }
        
        if(!e.detail.value.age){
            return wx.showToast({
                title: '请填写服务对象年龄',
                icon: 'none',
                duration: 2000
            });
        }
        client.age=e.detail.value.age;
        
        if(!e.detail.value.mobile){
            return wx.showToast({
                title: '请填写服务对象手机号',
                icon: 'none',
                duration: 2000
            });
        }
        client.mobile=e.detail.value.mobile;

        // 序列化提交数据对象
        var form = encodeURI(JSON.stringify(client));

        self.setData({
            _is_saving:true
        });

        app.util.request({
                url: 'User/client',
                data: {
                    m: app.mdName,
                    aid:self.data.area.id,
                    submit:'save',
                    form: form
                },
                complete(res){
                    self.setData({
                        _is_saving:false
                    });
                },
                success(res) {
                    wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 2000,
                            success: function () {
                                setTimeout(function () {
                                    self.main_load();
                                }, 2000); 
                            }
                    });   
                }
        })
    },

   

})