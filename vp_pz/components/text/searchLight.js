// vp_xx/components/text/searchLight.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        text: {
            type: String,
            value: ''
        },
        search:{
            type: String,
            value: '',
            observer:function(nd,od){
                //console.log("==========================searchLight================================");
                if(nd!=od){
                    this.setData({
                        search:nd
                    });
                    this.textSearchLight()
                }
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        texts:new Array()
    },

    ready() {
        this.textSearchLight();
    },

    /**
     * 组件的方法列表
     */
    methods: {
        textSearchLight(){
            //console.log("===textSearchLight===");
            var texts=new Array();
            var text=this.data.text;
            var search=this.data.search;
            if(search){
                texts=text.split(search);
            }
            this.setData({
                texts:texts
            });
        }
    }
})
