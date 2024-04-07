Component({
 /**
  * 组件的属性列表
  */
 properties: {
          cent: {
                  type: Number,
                  value: 0,
                  observer:function(nd,od){
                      var money = parseFloat(nd / 100);
                          this.setData({
                            cent:nd,
                              money: this.data.short ? money : money.toFixed(2)
                          });
                  }
          },
          short:{
              type: Boolean,
              value: false
          },
            size: {
                type: Number,
                value: 22
            },
          unit: {
                  type: String,
                  value: '¥'
          },
 },

 /**
  * 组件的初始数据
  */
 data: {
  money:''
 },


        //lifetimes: {  此写法2.2.3库才支持
                ready() {
                    var money = parseFloat(this.data.cent / 100);
                 this.setData({
                     money: this.data.short ? money : money.toFixed(2)
                 });
                },
       // },

 /**
  * 组件的方法列表
  */
 methods: {
 }
})
