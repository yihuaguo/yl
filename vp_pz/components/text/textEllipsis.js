// vp_cai/components/text/textEllipsis.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        text: {
            type: String,
            value: ''
        },
        maxLines:{
            type: Number,
            value:4
        },
        maxLength:{
            type: Number,
            value:120
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        is_ellipsis:false,
        ellipsised:false
    },

    
    attached(){
        // 根据文字长度判断是否需要缩略显示
        // 换行符超过 maxLines 或 文字数超过 maxLength，则缩略显示
        if(this.data.text){
            var lines = this.data.text.split('\n').length;
            var lens = this.data.text.length;
            console.log(this.data.text);
            console.log(lines);
            console.log(lens);
            if(lines>this.data.maxLines || lens>this.data.maxLength){
                this.setData({
                    is_ellipsis:true,
                    ellipsised:true
                })
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onEllipsisChange(){
            this.setData({
                ellipsised:!this.data.ellipsised
            })
        }
    }
})
