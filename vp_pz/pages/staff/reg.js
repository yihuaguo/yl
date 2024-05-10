// vp_pz/pages/staff/reg.js
var app = getApp();
var vp = require('../../resource/js/vp.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_xieyi: false,
    addressData: {}
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


  // 页面数据加载
  main_load(showLoading) {
    const self = this;
    //console.log("self.data.like "+self.data.like);
    app.util.request({
      url: 'Staff/reg',
      showLoading: showLoading ? true : false,
      data: {
        m: app.mdName,
        aid: self.data.area.id
      },
      success(res) {
        var data = res.data.data;

        self.setData({
          main_loaded: true,
          now: data.now,
          staff: data.staff ? data.staff : {}
        });
      }
    })
  },



  // 头像
  onAvatarChange: function () {
    var self = this;

    var url = app.util.url('Common/upload');

    wx.chooseImage({
      count: 1,
      success: function (res) {
        res.tempFilePaths[0],
          self.setData({
            "staff.avatar_file": res.tempFilePaths[0],
            "staff.avatar": ''
          });

        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'path': res.tempFilePaths[0]
          },
          success: function (ret) {
            ret.data = JSON.parse(ret.data);
            console.log(ret.data);

            if (ret.data.code != 1) {
              wx.showModal({
                title: '图片上传失败',
                content: ret.data.message,
                showCancel: false,
                success(res) {
                  self.setData({
                    "staff.avatar_file": '',
                    "staff.avatar": ''
                  });
                }
              });
            } else {
              self.setData({
                "staff.avatar": ret.data.data.path
              });
            }
          }
        });
      }
    });
  },

  // 性别
  onSexChange: function (e) {
    this.setData({
      'staff.sex': e.currentTarget.dataset.sex
    });
  },

  // 身份证正面
  onIdcard1Change: function () {
    var self = this;

    var url = app.util.url('Common/upload');

    wx.chooseImage({
      count: 1,
      success: function (res) {
        res.tempFilePaths[0],
          self.setData({
            "staff.idcard1_file": res.tempFilePaths[0],
            "staff.idcard1": ''
          });

        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'path': res.tempFilePaths[0]
          },
          success: function (ret) {
            ret.data = JSON.parse(ret.data);
            console.log(ret.data);

            if (ret.data.code != 1) {
              wx.showModal({
                title: '图片上传失败',
                content: ret.data.message,
                showCancel: false,
                success(res) {
                  self.setData({
                    "staff.idcard1_file": '',
                    "staff.idcard1": ''
                  });
                }
              });
            } else {
              self.setData({
                "staff.idcard1": ret.data.data.path
              });
            }
          }
        });
      }
    });
  },

  // 身份证反面
  onIdcard2Change: function () {
    var self = this;

    var url = app.util.url('Common/upload');


    wx.chooseImage({
      count: 1,
      success: function (res) {
        res.tempFilePaths[0],
          self.setData({
            "staff.idcard2_file": res.tempFilePaths[0],
            "staff.idcard2": ''
          });

        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'path': res.tempFilePaths[0]
          },
          success: function (ret) {
            ret.data = JSON.parse(ret.data);
            console.log(ret.data);

            if (ret.data.code != 1) {
              wx.showModal({
                title: '图片上传失败',
                content: ret.data.message,
                showCancel: false,
                success(res) {
                  self.setData({
                    "staff.idcard2_file": '',
                    "staff.idcard2": ''
                  });
                }
              });
            } else {
              self.setData({
                "staff.idcard2": ret.data.data.path
              });
            }
          }
        });
      }
    });
  },
//=======
  // 医护证(职业证)
  onYihuImageChange: function () {
    var self = this;
    var url = app.util.url('Common/upload');
    wx.chooseImage({
      count: 1,
      success: function (res) {
        res.tempFilePaths[0],
          self.setData({
            "staff.yihu_image_file": res.tempFilePaths[0],
            "staff.yihu_image": ''
          });

        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'path': res.tempFilePaths[0]
          },
          success: function (ret) {
            ret.data = JSON.parse(ret.data);
            console.log(ret.data);

            if (ret.data.code != 1) {
              wx.showModal({
                title: '图片上传失败',
                content: ret.data.message,
                showCancel: false,
                success(res) {
                  self.setData({
                    "staff.yihu_image_file": '',
                    "staff.yihu_image": ''
                  });
                }
              });
            } else {
              self.setData({
                "staff.yihu_image": ret.data.data.path
              });
            }
          }
        });
      }
    });
  },
  // 健康师证
  onHealthImageChange: function () {
    var self = this;
    var url = app.util.url('Common/upload');
    wx.chooseImage({
      count: 1,
      success: function (res) {
        res.tempFilePaths[0],
          self.setData({
            "staff.health_image_file": res.tempFilePaths[0],
            "staff.health_image": ''
          });

        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'path': res.tempFilePaths[0]
          },
          success: function (ret) {
            ret.data = JSON.parse(ret.data);
            console.log(ret.data);

            if (ret.data.code != 1) {
              wx.showModal({
                title: '图片上传失败',
                content: ret.data.message,
                showCancel: false,
                success(res) {
                  self.setData({
                    "staff.health_image_file": '',
                    "staff.health_image": ''
                  });
                }
              });
            } else {
              self.setData({
                "staff.health_image": ret.data.data.path
              });
            }
          }
        });
      }
    });
  },
  // 营养师证
  onNourImageChange: function () {
    var self = this;

    var url = app.util.url('Common/upload');

    wx.chooseImage({
      count: 1,
      success: function (res) {
        res.tempFilePaths[0],
          self.setData({
            "staff.nourishment_image_file": res.tempFilePaths[0],
            "staff.nourishment_image": ''
          });

        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'path': res.tempFilePaths[0]
          },
          success: function (ret) {
            ret.data = JSON.parse(ret.data);
            console.log(ret.data);

            if (ret.data.code != 1) {
              wx.showModal({
                title: '图片上传失败',
                content: ret.data.message,
                showCancel: false,
                success(res) {
                  self.setData({
                    "staff.nourishment_image_file": '',
                    "staff.nourishment_image": ''
                  });
                }
              });
            } else {
              self.setData({
                "staff.nourishment_image": ret.data.data.path
              });
            }
          }
        });
      }
    });
  },
  // 其他证件
  onOtherImageChange: function () {
    var self = this;

    var url = app.util.url('Common/upload');

    wx.chooseImage({
      count: 1,
      success: function (res) {
        res.tempFilePaths[0],
          self.setData({
            "staff.other_image_file": res.tempFilePaths[0],
            "staff.other_image": ''
          });

        wx.uploadFile({
          url: url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'path': res.tempFilePaths[0]
          },
          success: function (ret) {
            ret.data = JSON.parse(ret.data);
            console.log(ret.data);

            if (ret.data.code != 1) {
              wx.showModal({
                title: '图片上传失败',
                content: ret.data.message,
                showCancel: false,
                success(res) {
                  self.setData({
                    "staff.other_image_file": '',
                    "staff.other_image": ''
                  });
                }
              });
            } else {
              self.setData({
                "staff.other_image": ret.data.data.path
              });
            }
          }
        });
      }
    });
  },
  onXieyiChange: function (e) {
    this.setData({
      is_xieyi: !this.data.is_xieyi
    });
  },

  staffSave: function (e) {
    var self = this;
console.log(self.data.addressData);
    if (!self.data.addressData?.address) {
        return wx.showToast({
            title: '请选择地址',
            icon: 'none',
            duration: 2000
          });
      return
    }

    if (self.data._is_saving) {
      return;
    }

    var staff = this.data.staff;

    console.log(staff);



    if (staff.status != 5 && !this.data.is_xieyi) {
      return wx.showToast({
        title: '请先阅读并同意用户协议和服务协议',
        icon: 'none',
        duration: 2000
      });
    }

    if (self.data.area.staff_reg == 3 && !(self.data.staff.id > 0) && !e.detail.value.invite_code) {
      return wx.showToast({
        title: '请填写邀请码',
        icon: 'none',
        duration: 2000
      });
    }
    staff.invite_code = e.detail.value.invite_code;


    if (!staff.avatar) {
      if (staff.avatar_file) {
        wx.showToast({
          title: '请稍等，头像图片正在上传',
          icon: 'none',
          duration: 2000
        });
        return;
      } else {
        wx.showToast({
          title: '请上传头像图片',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }

    // 昵称验证
    if (!e.detail.value.nickname) {
      return wx.showToast({
        title: '请设置您的昵称',
        icon: 'none',
        duration: 2000
      });
    }
    staff.nickname = e.detail.value.nickname;

    // 性别验证
    if (!(staff.sex > 0)) {
      return wx.showToast({
        title: '请选择您的性别',
        icon: 'none',
        duration: 2000
      });
    }

    // 年龄验证
    if (!e.detail.value.age) {
      return wx.showToast({
        title: '请填写您的年龄',
        icon: 'none',
        duration: 2000
      });
    }
    staff.age = e.detail.value.age;

    // 手机号验证
    if (!e.detail.value.mobile) {
      return wx.showToast({
        title: '请填写您的手机号',
        icon: 'none',
        duration: 2000
      });
    }
    staff.mobile = e.detail.value.mobile;

    // 身份证名称
    if (!e.detail.value.realname) {
      return wx.showToast({
        title: '请填写身份证名称',
        icon: 'none',
        duration: 2000
      });
    }
    staff.realname = e.detail.value.realname;

    // 身份证号
    if (!e.detail.value.idcardnum) {
      return wx.showToast({
        title: '请填写身份号',
        icon: 'none',
        duration: 2000
      });
    }
    staff.idcardnum = e.detail.value.idcardnum;
    staff.desc = e.detail.value.desc;
    staff.language = e.detail.value.language;

    // 身份证上传
    if (!staff.idcard1) {
      if (staff.idcard1_file) {
        wx.showToast({
          title: '请稍等，身份证正在上传',
          icon: 'none',
          duration: 2000
        });
        return;
      } else {
        wx.showToast({
          title: '请上传身份证正面',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }
    if (!staff.idcard2) {
      if (staff.idcard2_file) {
        wx.showToast({
          title: '请稍等，身份证正在上传',
          icon: 'none',
          duration: 2000
        });
        return;
      } else {
        wx.showToast({
          title: '请上传身份证背面',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }

    const {
      address,
      latitude,
      longitude
    } = self.data.addressData

    staff.address = address
    staff.latitude = latitude
    staff.longitude = longitude
    staff.source = 'peihu'

    // 序列化提交数据对象
    var form = encodeURI(JSON.stringify(staff));

    self.setData({
      _is_saving: true
    });

    app.util.request({
      url: 'Staff/reg',
      data: {
        m: app.mdName,
        aid: self.data.area.id,
        submit: 'save',
        form: form,

      },
      complete(res) {
        self.setData({
          _is_saving: false
        });
      },
      success(res) {
        wx.showModal({
          title: '注册成功',
          content: res.data.msg,
          confirmText: '确定',
          showCancel: false,
          success: function () {
            self.main_load(true);
          }
        });

        /***
                    self.setData({
                        "live._id":res.data.data.live._id
                    });
                    self.showSavedModal();
                     */
      }
    })
  },

  showMap: function () {
    var self = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res.latitude, res.longitude, res.address);
        self.setData({
          addressData: {
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        console.log('------',self.addressData);
      },
      fail:res=>{
          console.log(res,'cs');
      }
    })
  },

  // 修改禁止提示
  editDisabled: function (e) {
    wx.showToast({
      title: '正在审核中，不能修改',
      icon: 'none',
      duration: 2000
    });
    return;
  }

})