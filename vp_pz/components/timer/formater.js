// vp_timer/components/timer/formater.js
Component({
 /**
  * 组件的属性列表
  */
 properties: {
          timestamp: {
                  type: Number,
                  value: 0,
                  observer:function(nd,od){
                          var formater = this.TIME_FORMAT(nd, this.data.format);
                          this.setData({
                           timestamp: nd,
                                  formater: formater
                          });
                  }
          },
          format: {
                  type: String,
                  value: 'MM-dd hh:mm:ss',
                  observer:function(nd,od){
                          var formater = this.TIME_FORMAT(this.data.timestamp, nd);
                          this.setData({
                           format: nd,
                                  formater: formater
                          });
                  }



          },
 },

 /**
  * 组件的初始数据
  */
 data: {
  formater:''
 },


        lifetimes: {
                ready() {
                 var formater = this.TIME_FORMAT(this.data.timestamp, this.data.format);
                 console.log("========lifetimes=ready2========" + this.data.timestamp + " = " + this.data.format + " = " + formater);
                 this.setData({
                  formater: formater
                 });
                },
        },

 /**
  * 组件的方法列表
  */
 methods: {
        TIME_FORMAT: function(t, fmt){
          var newDate = new Date();
          newDate.setTime(t * 1000);
          return newDate.VP_FORMAT(fmt);
        }
 }
})
