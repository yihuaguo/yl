// avp_hd/components/timer/clock.js
Date.prototype.VP_FORMAT = function (format) {		
        var date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1
                                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
        }
        return format;	
}

Component({
 /**
  * 组件的属性列表
  */
 properties: {
		second: {
                  type: Number,
                  value: 0,
                  observer:function(nd,od){
                          var formater = this.TIME_FORMAT(nd, this.data.nowtime, this.data.format);
                          this.setData({
                           timestamp: nd,
                                  formater: formater
                          });
                  }
          },
		 
          format: {
                  type: String,
                  value: 'MM-dd hh:mm',
                  observer:function(nd,od){
                          var formater = this.TIME_FORMAT(this.data.timestamp, this.data.nowtime, nd);
                          this.setData({
                           format: nd,
                                  formater: formater
                          });
                  }
          },
          sformat: {
                  type: String,
                  value: 'hh:mm:ss',
				  observer:function(nd,ob){
					  this.setData({
						 sformat: nd 
					  });
				  }
          },
          suffix: {
                  type: String,
                  value: '',
				  observer:function(nd,ob){
					  this.setData({
						 suffix: nd 
					  });
				  }				  
          }		  
 },

 /**
  * 组件的初始数据
  */
 data: {
  formater:''
 },


        lifetimes: {
                ready() {
                 var formater = this.TIME_FORMAT(this.data.timestamp, this.data.nowtime, this.data.format);
                 console.log("========lifetimes=ready2========" + this.data.timestamp + " = " + this.data.nowtime + " = " + this.data.format + "= " + formater);
                 this.setData({
                  formater: formater
                 });
                }			
        },	

 /**
  * 组件的方法列表
  */
 methods: {
        TIME_FORMAT: function(ts, fmt){
			var self=this;
			var hh,mm,ss;
			var left;
			var showtime = function () {
				if(ts <= 0){
					clearInterval(run);
					self.triggerEvent('counterOver');
					return self.TIME_SFORMAT(0,self.data.sformat,self.data.suffix);
				}
				left = self.TIME_SFORMAT(ts,self.data.sformat,self.data.suffix);
				return left;
			};

			var run = setInterval(function () {		
				ts -= 1000;
				left = showtime();
				self.setData({
					formater: left
				});
			}, 1000);
			 
        },
	  // 时间格式化 补0 去负数
	  TIME_FORMIN: function(param){
		  if(param < 0){
			  param = 0;
		  }		  
		  if(param < 10){
			  param = '0'+ param;
		  }
		  return param;
	  },
	  // 倒计时时间格式化
	  TIME_SFORMAT: function(ts, sfmt, suffix){
		var self = this;
		var time = {
				"h+": self.TIME_FORMIN(Math.floor(ts / 1000  / 60 / 60 % 24)),
				"m+": self.TIME_FORMIN(Math.floor(ts / 1000 / 60 % 60)),
				"s+": self.TIME_FORMIN(Math.floor(ts / 1000 % 60)),
		};
		for (var k in time) {
				if (new RegExp("(" + k + ")").test(sfmt)) {
						sfmt = sfmt.replace(RegExp.$1, RegExp.$1.length == 1
								? time[k] : ("00" + time[k]).substr(("" + time[k]).length));
				}
		}
		return sfmt+suffix;			  
	  }
 }
})
