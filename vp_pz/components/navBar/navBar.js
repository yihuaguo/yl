// pages/navBar/navBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isCover: {
            type: Boolean,
            value: false
        },
        isNav:{
          type: Boolean,
          value: true
        },
        isHeight: {
            type: Boolean,
            value: true
        },
        isWhite: {
            type: Boolean,
            value: false
        },
        background: {
            type: String,
            value: 'rgba(255, 255, 255, 1)'
        },
        color: {
            type: String,
            value: 'rgba(0, 0, 0, 1)'
        },
        titleText: {
            type: String,
            value: '导航栏',
            observer: function (nd, od) {
              this.setData({
                titleText: nd
              });
            }
        },
        titleImg: {
            type: String,
            value: ''
        },
        backIcon: {
            type: String,
            value: ''
        },
        homeIcon: {
            type: String,
            value: ''
        },
        fontSize: {
            type: Number,
            value: 16
        },
        iconHeight: {
            type: Number,
            value: 19
        },
        iconWidth: {
            type:Number,
            value: 58
        }
    },
    attached: function(){
        var that = this;
        that.setData({
          pages:getCurrentPages().length
        });
        that.setNavSize();
        that.setStyle();
      //console.log("---------------------------------");
      //console.log(getCurrentPages());
        that.triggerEvent('navBarAttached', { 
            statusHeight: that.data.status,
            navHeight: that.data.navHeight,
            navBarHeight: that.data.status + that.data.navHeight 
        });// 单位px
    },
    data: {

    },
    methods: {
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
                url: '/vp_pz/pages/index/index'
              });
            }
            //this.triggerEvent('backOrHome', {back: 1})
        },
        /***
        home: function() {
            this.triggerEvent('home', {});
        }
         */
    }
})
