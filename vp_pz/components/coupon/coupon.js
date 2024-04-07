var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    couponModal: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  attached: function () {
    this.getData();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showShareModal: function () {
      this.setData({
        couponModal: true
      });
    },
    hideShareModal: function () {
      this.setData({
        couponModal: false
      });
    },
    handleGetCoupon: function (event) {
      var itemId = event.currentTarget.dataset.id;
      if (!itemId) return
      var self = this;
      app.util.request({
        url: 'coupon/get',
        data: {
          id: itemId
        },
        success(res) {
          console.log('res', res)
          self.getData()
        }
      })
    },
    getData: function () {
      app.util.request({
        url: 'coupon/list',
        data: {
          from: 'index'
        },
        success: (res) => {
          const list = res.data?.data?.list || [];
          console.log('--', list)
          this.setData({
            list
          });
        }
      })
    },
  }
})