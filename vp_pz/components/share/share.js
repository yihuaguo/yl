// vp_xx/components/vp_xx/share.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shareModal: {
            type: Boolean,
            value: false
            /****
            ,
            observer: function (nd, od) {
              this.setData({
                titleText: nd
              });
            }
             */
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        //shareModal:false,
        /***
        _shareByPosterModal: false,
        _sharePosterWidth:0,
        _sharePosterHeight:0,
         */
    },


    /**
     * 组件的方法列表
     */
    methods: {


        showShareModal:function(){
            this.setData({shareModal:true});
        },
        hideShareModal:function(){
            this.setData({shareModal:false});
        },


        shareByPoster: function() {
            //this.setData({shareModal:false,_helpModal:false,_shareByPosterModal: true});
            //this.createPoster();
            wx.navigateTo({
              url: '../index/poster',
            })
        },

    }
})
