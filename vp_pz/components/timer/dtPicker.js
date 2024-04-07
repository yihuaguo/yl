// pages/navBar/navBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /**
        datetime: {
            type: String,
            value: ""
        },
         */
        timestamp:{
            type: Number,
            value: 0,
            observer: function (nd, od) {
                //console.log("VP--->"+nd);
                this.timestampChange(nd);
            }
        },
        emptyText: {
            type: String,
            value: ""
        },
        placeholder: {
            type: String,
            value: ""
        }
    },
    data: {
        now:new Date().getTime(), // 时间戳（毫秒）

        days:null,
        days_text: null,
        hours: null,
        seconds: null,
        range: null,

        value:[0,0,0],
        value_text:null
    },
    attached: function () {
        //console.log("VP-attached");

        //var now = new Date().getTime(); // 时间戳（毫秒）

       
       // 生成近期20天日期
        var days = [''];
        var days_text = [this.data.emptyText];
        for(var i=0;i<20;i++){
            days.push(this.TIME_FORMAT(this.data.now + 86400000 * i,'YYYY-MM-dd'));
            var text = this.TIME_FORMAT(this.data.now + 86400000 * i, 'M月d日');
            if (i == 0) { text +=' （今天）';}
            if (i == 1) { text += ' （明天）'; }
            if (i == 2) { text += ' （后天）'; }
            days_text.push(text);
        }

        var hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        var seconds = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

        var range= [];
        range[0] = days_text;
        range[1] = hours;
        range[2] = seconds;

        this.setData({
            days: days,
            days_text: days_text,
            hours: hours,
            seconds: seconds,
            range: range
        });


        /****
        // 初始化value值，如果传入时间小于今天，则使用当前时间
        var datetime = this.data.datetime;
        if (datetime) {

            var datetime_ts = new Date(datetime.replace(/-/g, '/')).getTime();

            if (datetime_ts < now) {
                datetime_ts = now;
            }
            var date = this.TIME_FORMAT(datetime_ts, 'YYYY-MM-dd');
            var hour = this.TIME_FORMAT(datetime_ts, 'hh');
            var minutes = this.TIME_FORMAT(datetime_ts, 'mm');

            var value = this.data.value;


            for (var i = 0; i < days.length;i++){
                if (date == days[i]){
                    value[0]=i;
                    break;
                }
            }
            for (var i = 0; i < hours.length; i++) {
                if (hour == hours[i]) {
                    value[1] = i;
                    break;
                }
            }
            for (var i = 0; i < seconds.length; i++) {
                if (minutes == seconds[i]) {
                    value[2] = i;
                    break;
                }
            }
            this.setData({
                value: value
            });
            console.log(date);
            console.log(hour);
            console.log(minutes);
        }
         */

        this.timestampChange(this.data.timestamp);
    },

    /****
    attached: function() {
        console.log("attached");

        var days = this.data.days;
        var days_text = this.data.days_text;
        var hours = this.data.hours;
        var seconds = this.data.seconds;

        var range = [];
        range[0] = days_text;
        range[1] = hours;
        range[2] = seconds;
        this.setData({
            range: range
        });

        this.timestampChange(this.data.timestamp);
    },
     */

    methods: {

        timestampChange(timestamp){
            //console.log("VP-timestampChange"+timestamp);
            // 未初始化时不执行
            if(!this.data.days){
                return;
            }

            //var datetime_ts = new Date(datetime.replace(/-/g, '/')).getTime();

            if (timestamp>0){
                var days = this.data.days;
                var days_text = this.data.days_text;
                var hours = this.data.hours;
                var seconds = this.data.seconds;

            // console.log(days);
            // console.log(this.data.range);
           //console.log('VP---F>'+timestamp);
           // console.log('VP---G>'+this.data.now);
                
                if (timestamp < this.data.now) {
                    timestamp = this.data.now;
                }
                var date = this.TIME_FORMAT(timestamp, 'YYYY-MM-dd');
                var hour = this.TIME_FORMAT(timestamp, 'hh');
                var minutes = this.TIME_FORMAT(timestamp, 'mm');
               // console.log('VP---E>'+date+' '+hour+' '+minutes);
                var value = this.data.value;

                for (var i = 0; i < days.length; i++) {
                    if (date == days[i]) {
                        value[0] = i;
                        break;
                    }
                }
                for (var i = 0; i < hours.length; i++) {
                    if (hour == hours[i]) {
                        value[1] = i;
                        break;
                    }
                }
               // console.log('VP---D>'+value[1]);
                for (var i = 0; i < seconds.length; i++) {
                    if (minutes == seconds[i]) {
                        value[2] = i;
                        break;
                    }
                }
                this.setData({
                    value: value
                });
            }

            this.setData({
                value_text: this.getValueText()
            });
           // console.log(date);
           // console.log(hour);
           // console.log(minutes);
        },

        getValueText(){
            console.log(this.data.value);

            var day = this.data.days_text[this.data.value[0]];
            var hour = this.data.hours[this.data.value[1]];
            var second = this.data.seconds[this.data.value[2]];

           //console.log("VP---C>"+day + " " + hour + ":" + second);

            if (this.data.days[this.data.value[0]]==""){
                return day;
            }else{
                return day + " " + hour + ":" + second;
            }
            
        },
        
        doChange: function(e) {
            //console.log('picker发送选择改变，携带值为', e.detail.value);

            this.setData({
                value_text: this.getValueText()
            });

            var day = this.data.days[this.data.value[0]];
            var hour = this.data.hours[this.data.value[1]];
            var second = this.data.seconds[this.data.value[2]];

            var datetime = "";
            if (day){
                datetime = day + " " + hour + ":" + second;
            }
            //console.log("VP---A>"+datetime);
            var timestamp=0;
            if (datetime){
                timestamp = new Date(datetime.replace(/-/g, '/')).getTime();
            }
            //console.log("VP---B>"+timestamp);

            // 把事件和指令传递出去
            this.triggerEvent('dtPickerChanged', {
                value: timestamp
            });
        },

        doColumnChange: function (e) {
            console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

            var value = this.data.value;
            value[e.detail.column] = e.detail.value;
            this.setData({
                value: value
            });

            /****
            var end_times = this.data.end_times;
            if (e.detail.column == 0 && e.detail.value == 0) {
                //this.setData()
                end_times[0] = this.data.date_times[0];
                end_times[1] = [];
                end_times[2] = [];
            } else {
                end_times[0] = this.data.date_times[0];
                end_times[1] = this.data.date_times[1];
                end_times[2] = this.data.date_times[2];
            }
            this.setData({
                end_times: end_times
            });
             */
        },

        TIME_FORMAT: function (t, fmt) {
            var newDate = new Date();
            newDate.setTime(t );
            return newDate.VP_FORMAT(fmt);
        },

        /****
        ts2dt: function(timestamp) {
            var date = new Date(timestamp);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            return Y + M + D + h + m + s;
        },
         */



        // 通过获取系统信息计算导航栏高度
        setNavSize: function() {
            var that = this
                , sysinfo = wx.getSystemInfoSync()
                , statusHeight = sysinfo.statusBarHeight
                , isiOS = sysinfo.system.indexOf('iOS') > -1
                , navHeight;
            if (!isiOS) {
                navHeight = 48;
            } else {
                navHeight = 44;
            }
            that.setData({
                status: statusHeight,
                navHeight: navHeight
            })
        },
        setStyle: function() {
            var that  = this
                , containerStyle
                , textStyle
                , iconStyle;
            containerStyle = [
                'background:' + that.data.background
                ].join(';');
            textStyle = [
                'color:' + that.data.color,
                'font-size:' + that.data.fontSize + 'px'
            ].join(';');
            iconStyle = [
                'width: ' + that.data.iconWidth + 'px',
                'height: ' + that.data.iconHeight + 'px'
            ].join(';');
            that.setData({
                containerStyle: containerStyle,
                textStyle: textStyle,
                iconStyle: iconStyle
            })
        },
        // 返回事件
        backOrHome: function(){
            if(this.data.pages>1){
              wx.navigateBack();
            }else{
              //wx.switchTab(Object object);
              wx.switchTab({
                url: '/vp_wu/pages/index/index'
              });
            }
            //this.triggerEvent('backOrHome', {back: 1})
        },
        /***
        home: function() {
            this.triggerEvent('home', {});
        }
         */
    },




})
