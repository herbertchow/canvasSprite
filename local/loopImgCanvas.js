//兼容
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());

var loopImgCanvas = function(){ //定义单例

    var _class = function(options){//内部类
        this.options=$.extend({
            parent:'body',
            msPerFrame:60,
            imgarr:[],
            loop:true
        },options);
        this.init();
    }
    _class.prototype = {//对象私有方法
        init : function(){//对象初始化
             this.initialize();
             this.addEvent();
             // this.startAni(); //开始动画动画
             // console.log(this);
        },
        //绑定函数
        addEvent:function(){//事件绑定

        },
        //开始动画
        play:function() {
            var self = this;
            self.startAni();
        },
        //动画暂停
        pause:function(type) {
            var self = this;
            self.cancelAni();
        },
        //动画停止
        stop:function(type) {
            var self = this;
            self.cancelAni();
            self.frame = 0;
        },
        //图片处理
        cachefiresImg:function(){
            var self = this;

            for(var i=0;i<self.imgArrayUrl.length;i++){
                // console.log(self.imgarray)
                self.imgarray[i] = new Image();
                self.imgarray[i].src = self.imgArrayUrl[i];
                // console.log(self.imgarray[i].src)
            }
        },
        //动画
        redraw:function() {
            var self = this;
            self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
            self.ctx.globalAlpha=1;
            self.ctx.fillStyle="transparent";
            self.ctx.fillRect(0, 0, self.canvas.width,self.canvas.height);
            self.ctx.drawImage(self.imgarray[self.frame], 0, 0, self.canvas.width,self.canvas.height);
        },
        //动画逻辑
        ani:function(){
            var self = this;
            // console.log(self.ctx)
            // start = requestAnimationFrame(step);
            var delta = Date.now() - self.lastUpdateTime;
            //console.log(Date.now(),lastUpdateTime);
            if (self.acDelta > self.msPerFrame)
            {
                self.acDelta = 0;
                self.redraw();
                // img.src= firesImg[frame];
                self.frame++; 
                if(self.loop){   
                    if(self.frame > self.imgarray.length -1) {
                        self.frame = 0; //当绘制后且帧推进完，计时器就会重置。
                    }
                }else{
                    if(self.frame > self.imgarray.length -1) {
                        self.cancelAni();
                        self.frame = self.imgarray.length-1;
                        return;
                    }
                }

            } else {

                self.acDelta += delta;

            }
            self.lastUpdateTime = Date.now();

            self.interval = requestAnimationFrame(function(){
                self.ani.call(self);   
            }); //报错
            // console.log(self.interval)
        },
        //取消动画
        cancelAni : function(){
            var self = this;
            cancelAnimationFrame(self.interval);
            self.interval = null;
            self.isPlaying = false;
        },
        //开始动画
        startAni:function(){
            var self = this;
            if(!self.interval){
                self.interval = requestAnimationFrame(function(){
                    self.ani.call(self);   
                });
                self.isPlaying =true;
            }
        },
        //初始化
        initialize:function(){
            var self = this;

            self.isPlaying =false;
            self.frame = 1;
            self.lastUpdateTime = 0;
            self.acDelta = 0;
            self.msPerFrame = self.options.msPerFrame;
            self.imgArrayUrl = self.options.imgarr;
            self.imgarray = [];
            self.loop = self.options.loop;

            self.interval = null;  
            self.canvasW = $(self.options.parent).width(),
            self.canvasH = $(self.options.parent).height();

            var _canvas = document.createElement('canvas'); 

            self.canvas = _canvas;
            self.canvas.width = self.canvasW;
            self.canvas.height = self.canvasH;

            $(self.options.parent).append(_canvas);

            self.ctx = self.canvas.getContext("2d");

            //解决canvas在移动端模糊的问题start
            (function(){
                var getPixelRatio = function(context) {
                    var backingStore = context.backingStorePixelRatio ||
                        context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;
                        return ((window.devicePixelRatio || 1) / backingStore);
                };
                self.ratio = getPixelRatio(self.ctx);

                var oldWidth = self.canvas.width; 
                var oldHeight = self.canvas.height; 
                self.canvas.width = oldWidth * self.ratio; 
                self.canvas.height = oldHeight * self.ratio; 
                self.canvas.style.width = oldWidth + 'px'; 
                self.canvas.style.height = oldHeight + 'px'; 
            })()
            //解决canvas在移动端模糊的问题end
            
            self.options.count ?(self.count = self.options.count):(self.count = 0);
            self.options.Alpha ?(self.Alpha = self.options.Alpha):(self.Alpha = 0);
            self.options.speed ?(self.speed = self.options.speed):(self.speed = 4);
            
            self.cachefiresImg();

            //是否自动播放
            if(self.options.auto){
                var self = this;
                if(!self.interval){
                    self.interval = requestAnimationFrame(function(){
                        self.ani.call(self);   
                    });
                    self.isPlaying =true;
                }
            }
        }
    }
    return {
        setting:function(options){//提供给外部调用的方法，修改所有实例的公有参数
             setParam(options);
        },
        //开始动画
        play:_class.play,
        //动画暂停
        pause:_class.pause,
        //动画暂停
        stop:_class.stop,
        create : function(options){//提供给外部调用的方法，创建实例
            return new _class(options);
        }
    }
}();

// var img_list1 = ['data/bz/eff_04_0000.png','data/bz/eff_04_0001.png','data/bz/eff_04_0002.png','data/bz/eff_04_0003.png','data/bz/eff_04_0004.png','data/bz/eff_04_0005.png','data/bz/eff_04_0006.png','data/bz/eff_04_0007.png','data/bz/eff_04_0008.png','data/bz/eff_04_0009.png'];

//切记图片命名规则，1.png的下一张图应该是11.png，而不是2.png，所以1.png应该改成01.png才对
// var img_list1 = [__uri("data/bz/eff_04_00000.png"),__uri("data/bz/eff_04_00001.png"),__uri("data/bz/eff_04_00002.png"),__uri("data/bz/eff_04_00003.png"),__uri("data/bz/eff_04_00004.png"),__uri("data/bz/eff_04_00005.png"),__uri("data/bz/eff_04_00006.png"),__uri("data/bz/eff_04_00007.png"),__uri("data/bz/eff_04_00008.png"),__uri("data/bz/eff_04_00009.png"),__uri("data/bz/eff_04_00010.png"),__uri("data/bz/eff_04_00011.png"),__uri("data/bz/eff_04_00012.png"),__uri("data/bz/eff_04_00013.png"),__uri("data/bz/eff_04_00014.png"),__uri("data/bz/eff_04_00015.png"),__uri("data/bz/eff_04_00016.png"),__uri("data/bz/eff_04_00017.png"),__uri("data/bz/eff_04_00018.png"),__uri("data/bz/eff_04_00019.png"),__uri("data/bz/eff_04_00020.png"),__uri("data/bz/eff_04_00021.png"),__uri("data/bz/eff_04_00022.png"),__uri("data/bz/eff_04_00023.png"),__uri("data/bz/eff_04_00024.png"),__uri("data/bz/eff_04_00025.png"),__uri("data/bz/eff_04_00026.png"),__uri("data/bz/eff_04_00027.png"),__uri("data/bz/eff_04_00028.png"),__uri("data/bz/eff_04_00029.png"),__uri("data/bz/eff_04_00030.png"),__uri("data/bz/eff_04_00031.png")];
// var img_list2 = [__uri("data/zhz_ani/zhaohuanzhen_00000.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00001.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00002.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00003.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00004.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00005.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00006.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00007.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00008.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00009.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00010.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00011.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00012.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00013.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00014.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00015.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00016.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00017.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00018.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00019.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00020.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00021.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00022.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00023.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00024.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00025.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00026.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00027.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00028.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00029.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00030.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00031.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00032.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00033.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00034.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00035.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00036.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00037.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00038.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00039.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00040.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00041.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00042.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00043.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00044.jpg"),__uri("data/zhz_ani/zhaohuanzhen_00045.jpg")];

// var adV = loopImgCanvas.create({//创建实例1
//     parent:'.canvas-wrap',
//     imgarr:img_list1,
//     msPerFrame:60
// });

// var adV2 = loopImgCanvas.create({//创建实例2
//     parent:'.canvas-wrap2',
//     imgarr:img_list2,
//     msPerFrame:60
// });
