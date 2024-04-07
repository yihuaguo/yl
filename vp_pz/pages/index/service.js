// vp_cai/pages/index/citys.js
var app = getApp();
var vp = require('../../resource/js/vp.js');
var WxParse = require('../../resource/js/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hospitals: [],
    hospital_index: 0,
    pzId: undefined,
    client: {},

    order: {},

    _serviceModal: false,

    is_xieyi: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this);
    var self = this;

    self.setData({
      pzId: options.dId,
      svid: options.svid,
      hid: options.hid ? options.hid : ''
    });

    app.util.getUserInfo(function (response) {
      self.setData({
        userInfo: response
      });
      app.mdInit(function (cfg, mine, area) {
        self.setData({
          cfg: cfg,
          mine: mine,
          area: area
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
      url: 'Service/order',
      showLoading: showLoading ? true : false,
      data: {
        m: app.mdName,
        aid: self.data.area.id,
        svid: self.data.svid,
        hid: self.data.hid
      },
      success(res) {
        var data = res.data.data;

        var hospitals = data.hospitals;
        hospitals.unshift({
          id: 0,
          name: '',
          service_id: data.service.id,
          service_price: data.service.price
        });
        self.setData({
          main_loaded: true,
          _serviceModal: true,
          now: data.now,
          service: data.service,
          hospitals: hospitals,
          my_staff: data.my_staff
        });

        // 服务HTML
        WxParse.wxParse('data', 'html', data.service.content, self, 5);

        if (self.data.hid > 0) {
          // 自动选中
          for (var i = 0; i < hospitals.length; i++) {
            if (hospitals[i].id == self.data.hid) {
              self.setData({
                hospital_index: i,
                'order.price': hospitals[i].service_price
              });
              break;
            }
          }
        } else {
          self.setData({
            'order.price': data.service.price
          });
        }
      }
    })
  },

  showServiceModal: function () {
    this.setData({
      _serviceModal: true
    });
  },

  hideServiceModal: function () {
    this.setData({
      _serviceModal: false
    });
  },

  onHospitalChange: function (e) {
    var value = parseInt(e.detail.value);
    this.setData({
      hospital_index: value,
      'order.price': this.data.hospitals[value].service_price,
    });
  },


  onStartTimeChanged: function (e) {
    console.log("onStartTimeChanged " + e.detail.value);
    this.setData({
      "order.starttime": e.detail.value
    });
  },

  onClientChange: function (e) {
    wx.navigateTo({
      url: '../index/clients?act=select',
    })
  },

  // 填写收货地址
  onAddressChange: function () {
    const self = this;
    wx.chooseAddress({
      success(res) {
        self.setData({
          "order.address": {
            'userName': res.userName,
            'postalCode': res.postalCode,
            'provinceName': res.provinceName,
            'cityName': res.cityName,
            'countyName': res.countyName,
            'detailInfo': res.detailInfo,
            'nationalCode': res.nationalCode,
            'telNumber': res.telNumber
          }
        });
      }
    })
  },

  onPriceChange: function (e) {
    this.setData({
      'order.price': e.detail.value
    });
  },

  onXieyiChange: function (e) {
    this.setData({
      is_xieyi: !this.data.is_xieyi
    });
  },



  serviceSave: function (e) {
    var self = this;

    if (self.data._is_saving) {
      return;
    }

    if (!this.data.is_xieyi) {
      return wx.showToast({
        title: '请先阅读并同意用户协议和服务协议',
        icon: 'none',
        duration: 2000
      });
    }

    var order = this.data.order;

    // 当前服务
    order.service_id = this.data.service.id;
    order.service_code = this.data.service.code;
    order.service_name = this.data.service.name;
    order.service_stype = this.data.service.stype;

    if (this.data.service.stype < 100) {
      // 医院选择验证
      if (this.data.hospital_index == 0) {
        return wx.showToast({
          title: '请选择医院',
          icon: 'none',
          duration: 2000
        });
      }
      order.hospital_id = this.data.hospitals[this.data.hospital_index].id;
      order.hospital_name = this.data.hospitals[this.data.hospital_index].name;
    }

    // 就诊时间验证
    if (this.data.service.stype != 210) {
      if (!order.starttime) {
        return wx.showToast({
          title: '请选择时间',
          icon: 'none',
          duration: 2000
        });
      }
    }


    if (this.data.service.stype == 10 || this.data.service.stype == 15 || this.data.service.stype == 20) {
      // 就诊人验证
      if (!this.data.client || !this.data.client.id) {
        return wx.showToast({
          title: '请选择就诊人',
          icon: 'none',
          duration: 2000
        });
      }
      order.client_id = this.data.client.id;
      order.client_name = this.data.client.name;
      order.client_sex = this.data.client.sex;
      order.client_age = this.data.client.age;
      order.client_mobile = this.data.client.mobile;
      order.client_idcard = this.data.client.idcard;

      // 接送地址验证
      if (this.data.service.stype == 15) {
        if (!e.detail.value.address) {
          return wx.showToast({
            title: '请填写就诊人所在地址',
            icon: 'none',
            duration: 2000
          });
        }
        order.address = {
          address: e.detail.value.address
        };
      }
    }

    // 收件地址验证
    if (this.data.service.stype == 30 || this.data.service.stype == 40) {
      if (!this.data.order.address) {
        return wx.showToast({
          title: '请选择收件信息',
          icon: 'none',
          duration: 2000
        });
      }
    }

    if (this.data.service.stype == 110) {
      // 服务对象验证
      if (!this.data.client || !this.data.client.id) {
        return wx.showToast({
          title: '请选择服务对象',
          icon: 'none',
          duration: 2000
        });
      }
      order.client_id = this.data.client.id;
      order.client_name = this.data.client.name;
      order.client_sex = this.data.client.sex;
      order.client_age = this.data.client.age;
      order.client_mobile = this.data.client.mobile;
      order.client_idcard = this.data.client.idcard;

      // 服务地址验证
      if (!e.detail.value.address) {
        return wx.showToast({
          title: '请填写服务地址',
          icon: 'none',
          duration: 2000
        });
      }
      order.address = {
        address: e.detail.value.address
      };
    }



    if (this.data.service.stype == 210) {
      // 费用验证
      if (!(this.data.order.price > 0)) {
        return wx.showToast({
          title: '请填写支付费用',
          icon: 'none',
          duration: 2000
        });
      }
    }

    // 联系电话验证
    if (!e.detail.value.tel) {
      return wx.showToast({
        title: '请填写您的联系电话',
        icon: 'none',
        duration: 2000
      });
    }
    order.tel = e.detail.value.tel;

    // 服务需求
    if (e.detail.value.demand) {
      order.demand = e.detail.value.demand;
    }

    // 是否指定服务专员
    // if (this.data.my_staff) {
    //   order.staff_toid = this.data.my_staff.id;
    // }

    order.staff_toid = self.data?.pzId

    // 序列化提交数据对象
    var form = encodeURI(JSON.stringify(order));

    self.setData({
      _is_saving: true
    });

    app.util.request({
      url: 'Order/create',
      data: {
        m: app.mdName,
        aid: self.data.area.id,
        form: form
      },
      complete(res) {
        self.setData({
          _is_saving: false
        });
      },
      success(res) {
        var order_id = res.data.data.order_id;
        var pay_params = res.data.data.pay_params;

        wx.requestPayment({
          'timeStamp': pay_params.timeStamp,
          'nonceStr': pay_params.nonceStr,
          'package': pay_params.package,
          'signType': 'MD5',
          'paySign': pay_params.paySign,
          'success': function (resp) {
            wx.redirectTo({
              url: '../order/order?oid=' + order_id,
            });
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '../order/order?oid=' + order_id,
            });
          }
        })
      }
    })
  },

  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    });
  },

  removeStaff: function (e) {
    var self = this;
    wx.showModal({
      title: '确定重新分配服务专员',
      content: '如果重新分配，您的服务订单将会根据人员调度，随机安排给一位服务人员为您服务',
      success(res) {
        if (res.confirm) {
          self.setData({
            my_staff: null
          });
        }
      }
    });
  }

})