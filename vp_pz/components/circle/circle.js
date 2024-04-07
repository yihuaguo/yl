// vp_timer/components/circle/circle.js
Component({
        /**
         * 组件的属性列表
         */
        properties: {
                progress: {
                        type: Number,
                        value: 0,
                        observer: function (nd, od) {
                                //console.log("========second=observer========");
                                this.drawCircle(nd*2);

                                /**
                                var t = this.CLOCK_FORMAT(nd);
                                console.log(t);
                                this.setData({
                                        timer: t
                                });
                                 */
                        }
                },

                radius:{
                        type: Number,
                        value: 10,
                        observer: function (nd, od) {
                               this.setData({
                                radius: nd
                                });
                        }
                },
    
                border_bg_width:{
                        type: Number,
                        value: 3,
                        observer: function (nd, od) {
                               this.setData({
                                border_bg_width: nd
                                });
                        }
                },

                bordert_width:{
                        type: Number,
                        value: 4,
                        observer: function (nd, od) {
                               this.setData({
                                bordert_width: nd
                                });
                        }
                },

                bordert_color:{
                        type: String,
                        value: "#03cb9c",
                        observer: function (nd, od) {
                               this.setData({
                                bordert_color: nd
                                });
                        }
                }
        },

        lifetimes: {
                ready() {
                        //console.log("========lifetimes=ready========");
                        this.drawProgressbg();
                },
        },

        /**
         * 组件的初始数据
         */
        data: {

        },

        /**
         * 组件的方法列表
         */
        methods: {
                drawProgressbg: function () {
                        var radius = this.data.radius;
                        var border_bg_width = this.data.border_bg_width;
                        var bordert_width = this.data.bordert_width;
                        var offset = border_bg_width > bordert_width ? border_bg_width : bordert_width;
                        // 使用 wx.createContext 获取绘图上下文 context
                        var ctx = wx.createCanvasContext('canvasProgressbg',this);
                        ctx.setLineWidth(border_bg_width);// 设置圆环的宽度
                        ctx.setStrokeStyle('#EEEEEE'); // 设置圆环的颜色
                        ctx.setLineCap('round') // 设置圆环端点的形状
                        ctx.beginPath();//开始一个新的路径
                       ctx.arc(radius + offset, radius + offset, radius, 0, 2 * Math.PI, false);
                        //设置一个原点(100,100)，半径为90的圆的路径到当前路径
                        ctx.stroke();//对当前路径进行描边
                        ctx.draw();
                },
                drawCircle: function (step) {
                        var radius = this.data.radius;
                        var border_bg_width = this.data.border_bg_width;
                        var bordert_width = this.data.bordert_width;
                        var offset = border_bg_width > bordert_width ? border_bg_width : bordert_width;
                        var bordert_color = this.data.bordert_color;
                        var context = wx.createCanvasContext('canvasProgress', this);

                        if (step == 0) {
                                context.beginPath();
                                context.stroke();
                                context.draw()
                        } else {
                                // 设置渐变
                                var gradient = context.createLinearGradient(200, 100, 100, 200);
                                gradient.addColorStop("0", bordert_color);
                                gradient.addColorStop("0.5", bordert_color);
                                gradient.addColorStop("1.0", bordert_color);

                                context.setLineWidth(bordert_width);
                                context.setStrokeStyle(gradient);
                                context.setLineCap('round')
                                context.beginPath();
                                // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
                                context.arc(radius + offset, radius + offset, radius, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
                                context.stroke();
                                context.draw()
                        }
                },
        },
})
