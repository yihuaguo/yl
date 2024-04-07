// vp_mai/components/timer/timer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
          second: {
                  type: Number,
                  value: 0,
                  observer:function(nd,od){
                          var t = this.CLOCK_FORMAT(nd, this.data.format);
                          this.setData({
                                  second:nd,
                                  timer: t
                          });
                  }
          },
          format: {
                  type: Number,
                  value: 0,
                  observer: function (nd, od) {
                          var t = this.CLOCK_FORMAT(this.data.second,nd);
                          this.setData({
                                  format:nd,
                                  timer: t
                          });
                  }
          }
  },

  /**
   * 组件的初始数据
   */
  data: {
          timer:''
  },

        lifetimes: {
                ready() {
                        var t = this.CLOCK_FORMAT(this.data.second, this.data.format);
                        this.setData({
                                timer: t
                        });
                },
        },

  /**
   * 组件的方法列表
   */
  methods: {
          CLOCK_FORMAT: function (times, format) {
                  var result = '';
                  var days,hour,minute, second;
                  if (times > 0) {
                        days = Math.floor((times) / 86400);
                        if (days>0){
                                //if (hour < 10) {
                                //        hour = "0" + hour;
                                //}
                                days = days;
                        }

                          hour = Math.floor((times) / 3600);
                          if (hour>0){
                                  //if (hour < 10) {
                                  //        hour = "0" + hour;
                                  //}
                                  hour = hour;
                          }

                          minute = Math.floor((times - 3600 * hour) / 60);
                          if (hour>0 && minute < 10) {
                                  minute = "0" + minute;
                          }

                          second = Math.round((times - 60 * minute) % 60);
                          if (minute>0 && second < 10) {
                                  second = "0" + second;
                          }
                          if (format==0){
                                result = (hour > 0 ? (hour + ':'):'')+minute + ':' + second;
                          } else if (format == 1){
                                if(days>0){
                                        result=days + '天';
                                }else if(hour>0){
                                        result=hour + '小时';
                                }else if(minute>0){
                                        result=minute + '分钟';
                                }else{
                                        result=second+'秒';
                                }

                                //result =  (hour > 0 ? (hour + '小时') : '') + (minute > 0 ? (minute + '分') : '')  + second+'秒';
                          }
                  }else{
                        this.triggerEvent('timeUp');
                  }
                  console.log("===" + result);
                  return result;
          }
  }
})
