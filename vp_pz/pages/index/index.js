// vp/vp_sc/pages/index/index.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signed: null,
    _signModal: false,

    _shareModal: false,
    _couponModal: false,

    addmy: false,
    noticed: 0, // 我上次关闭的公告的ID，当前公告时间戳大于该数值才显示

    followed: null,
    _followedModal: false,

    cats: null,

    _searchModal: false,
    search: '', // 搜索框中的内容
    searching: '', // 当前搜索的内容

    cat: '',
    start: 0,
    more: 1,
    list: null,
    is_loading_more: false,

    // 当前播放的喇叭
    horn: null,
    horn_audio_playing: false,

    // 当前查看的商户
    puber: null,

    // 管理员
    _shieldModal: false
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.chooseLocation({
    //   success: function (res) {
    //     var latitude = res.latitude; // 用户选择的位置的纬度
    //     var longitude = res.longitude; // 用户选择的位置的经度
    //     var name = res.name; // 位置名称
    //     var address = res.address; // 详细地址
    //     console.log(latitude, longitude, name, address)
    //     // 处理用户选择的位置信息
    //   },
    //   fail: function (err) {
    //     // 处理选择位置失败的情况
    //   }
    // })
    console.log(this);
    var self = this;
    var aid = '';
    var fuid = '';
    var stid = '';
    if (options.scene) { // 扫码进入
      var scene = options.scene.split('_');
      aid = scene[0] ? scene[0] : '';
      fuid = scene[1] ? scene[1] : '';
      stid = scene[2] ? scene[2] : '';
    } else {
      aid = options.aid ? options.aid : '';
      fuid = options.fuid ? options.fuid : '';
      stid = options.stid ? options.stid : '';
    }

    // 如果没有传入aid，则默认进入上次的aid，上次的aid在app.mdInit函数中更新保存
    if (!aid) {
      aid = wx.getStorageSync('VP_AID');
    }


    self.setData({
      aid: aid,
      fuid: fuid,
      stid: stid
    });

    console.log("==获取当前用户信息==");
    app.util.getUserInfo(function (response) {
      console.log("==获取当前用户信息1==");
      console.log(response);
      self.setData({
        userInfo: response
      });
      console.log("==应用初始化：应用配置/应用中用户信息/当前城市信息==");
      app.mdInit(function (cfg, mine, area) {
        self.setData({
          cfg: cfg,
          mine: mine,
          area: area
        });
        console.log(cfg);
        console.log(mine);
        console.log(area);


        console.log("==加载首页数据==");
        self.main_load(false);


        if (!aid) {
          console.log("==无指定城市时，获取当前用户位置自动切换对应城市==");
          // 如果没有aid，则发起位置定位
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              // 定位成功，获取最近的店，并提示是否切换
              //self.main_load(false);

              app.util.request({
                url: 'Index/location',
                showLoading: false,
                data: {
                  m: app.mdName,
                  //cmd:'location',
                  lat: res.latitude,
                  lng: res.longitude
                },
                success(res2) {
                  var data = res2.data.data;
                  console.log("==无指定城市时，定位到用户当前位置所在城市==");
                  console.log(data);

                  // 如果定位城市与当前城市不符，则推荐用户切换
                  if (data.id != area.id) {
                    wx.showModal({
                      title: '切换城市',
                      content: '您当前位于“' + data.name + '”',
                      cancelText: '其他城市',
                      confirmText: '确认进入',
                      success(ret) {
                        if (ret.confirm) {
                          wx.reLaunch({
                            //url: app.mdName + '/pages/index/index?aid='+data.id
                            url: '../index/index?aid=' + data.id
                          });
                        } else {
                          wx.navigateTo({
                            url: '../index/areas'
                          })
                        }
                      }
                    });
                  }
                }
              })
            },
            fail(res) {
              console.log("fail");
              console.log(res);
              // 定位失败，获取默认的店，并提示是否切换
              //self.main_load(false);
            }
          });
        }
      }, {
        aid: self.data.aid,
        fuid: self.data.fuid,
        stid: self.data.fuid
      }, true);
    });


    var menu = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menu: menu
    });
    console.log("menu==>");
    console.log(menu);


  },

  // 顶部导航栏初始化完毕
  onNavBarAttached: function (e) {
    this.setData({
      statusHeight: e.detail.statusHeight,
      navHeight: e.detail.navHeight,
      navBarHeight: e.detail.navBarHeight
    });
    console.log("--------------------------------" + e.detail.navBarHeight);
  },

  onReady: function () {


    var self = this;

    var addmy = wx.getStorageSync('vp_pz_sharer_addmy');
    this.setData({
      addmy: addmy ? false : true
    });

    var noticed = wx.getStorageSync('vp_pz_noticed');
    if (noticed > 0) {
      this.setData({
        noticed: noticed
      });
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;

    console.log("----");
    console.log(self.data.aid);
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


  onSlideTap: function (e) {
    var slide = this.data.slides[e.currentTarget.dataset.index];
    if (!slide) {
      return;
    }
    if (slide.stype == 1) {
      wx.navigateTo({
        url: slide.stype_link,
      });
    } else if (slide.stype == 2) {
      wx.navigateTo({
        url: 'html?cmd=slide&id=' + slide.id
      });
    } else if (slide.stype == 3) {
      console.log(slide.stype_link);
      var link = slide.stype_link.split(":");
      console.log(link);
      wx.navigateToMiniProgram({
        appId: link[0],
        path: link[1]
      });
    } else if (slide.stype == 4) {
      console.log(slide.stype_link);
      var link = slide.stype_link.split(":");
      console.log(link);
      wx.openChannelsActivity({
        finderUserName: link[0],
        feedId: link[1]
      });
    }
  },


  onNav2Tap: function (e) {
    var nav = this.data.nav2s[e.currentTarget.dataset.index];
    if (!nav) {
      return;
    }
    if (nav.stype == 1) {
      wx.navigateTo({
        url: nav.stype_link,
      });
    } else if (nav.stype == 2) {
      wx.navigateTo({
        url: 'html?cmd=nav&id=' + nav.id
      });
    } else if (nav.stype == 3) {
      console.log(nav.stype_link);
      var link = nav.stype_link.split(":");
      console.log(link);
      wx.navigateToMiniProgram({
        appId: link[0],
        path: link[1]
      });
    } else if (nav.stype == 4) {
      console.log(nav.stype_link);
      var link = nav.stype_link.split(":");
      console.log(link);
      wx.openChannelsActivity({
        finderUserName: link[0],
        feedId: link[1]
      });
    }
  },

  onNavTap: function (e) {
    var nav = this.data.navs[e.currentTarget.dataset.index];
    if (!nav) {
      return;
    }
    if (nav.stype == 1) {
      wx.navigateTo({
        url: nav.stype_link,
      });
    } else if (nav.stype == 2) {
      wx.navigateTo({
        url: 'html?cmd=nav&id=' + nav.id
      });
    } else if (nav.stype == 3) {
      console.log(nav.stype_link);
      var link = nav.stype_link.split(":");
      console.log(link);
      wx.navigateToMiniProgram({
        appId: link[0],
        path: link[1]
      });
    } else if (nav.stype == 4) {
      console.log(nav.stype_link);
      var link = nav.stype_link.split(":");
      console.log(link);
      wx.openChannelsActivity({
        finderUserName: link[0],
        feedId: link[1]
      });
    }
  },


  /**
   * 分享
   */
  onShareAppMessage: function () {
    console.log(this.getSharePath());
    return {
      title: this.data.cfg.share_title ? this.data.cfg.share_title : this.data.cfg.name,
      imageUrl: this.data.cfg.share_image_url,
      path: this.getSharePath()
    }
  },
  onShareTimeline: function () {
    return {
      title: this.data.cfg.share_title ? this.data.cfg.share_title : this.data.cfg.name,
      imageUrl: this.data.cfg.logo_url,
      query: 'aid=' + this.data.area.id + '&fuid=' + this.data.mine.id
    }
  },
  getSharePath: function () {
    var page = app.mdName + '/pages/index/index';
    var ps = '?aid=' + this.data.area.id + '&fuid=' + this.data.mine.id
    return page + ps;
  },

  showShareModal() {
    this.setData({
      _shareModal: true
    });
  },

  // 切换区域
  toAreas: function () {
    wx.navigateTo({
      url: '../index/areas',
    })
  },

  // 前往医院
  toHospital: function (e) {
    wx.navigateTo({
      url: '../index/hospital?hid=' + e.currentTarget.dataset.hid,
    })
  },


  // 页面数据加载
  main_load(showLoading) {
    const self = this;
    //console.log("self.data.like "+self.data.like);
    app.util.request({
      url: 'Index/index',
      showLoading: showLoading ? true : false,
      data: {
        m: app.mdName,
        aid: self.data.area.id
      },
      complete(res) {
        wx.stopPullDownRefresh();
      },
      success(res) {
        var data = res.data.data;
        self.setData({
          main_loaded: true,
          now: data.now,
          slides: data.slides,
          nav2s: data.nav2s,
          navs: data.navs,
          hospitals: data.hospitals,
          my_staff: data.my_staff
        });
      }
    })
  },

  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    });
  },

  handleGetList: function () {
    app.util.request({
      url: 'coupon/list',
      data: {
        from: 'index'
      },
      success: (res) => {
        const list = res.data?.data?.list || [];
        if (list.length) {
          this.setData({
            _couponModal: true
          })
        }
      }
    })
  },


  closeAddmy() {
    this.setData({
      addmy: false
    });
    wx.setStorage({
      key: "vp_pz_sharer_addmy",
      data: true
    });
  },


})