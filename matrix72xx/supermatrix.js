// jquery MD_MAX72XX Matrix library
// for generating 

(function ($, window, document, undefined) {
    var pluginName = 'supermatrix',
        // defaults = {
        //     width: 8,
        //     height: 8,
        //     isLocked: false,
        //     isEditable:true,
        //     outputFormat: "hex",
        //     divId:"matr_",
        //     outputTarget: false
        // };
        defaults = {
            displays:3,
            prefix:"supermatrix_",
            scrollFinish:function(){},
            letterFinish:function(){},
            defaultDirection:3,
            matrixOptions:{
                width: 8,
                height: 8,
                isLocked: false,
                isEditable:true,
                outputFormat: "hex",
                divId:"super_matr_",
                outputTarget: false
            },
            scrollState:{
                addLetters:true,
                // letterFinish:this.options.letterFinish,
                // scrollFinish:this.options.scrollFinish,
                letterSpacing:4,
                letterInc:3,
                nextLetter:0,
                loopLetters:true,
                invert:0,
                direction:3,
                loop:false,
                orders:[ 6,3,0,7,1,2,8,4,5,3,9,10,11,11,11,11,11,11,11,11],
                // orders:[ 6,3],//,0,7,1,2,8,4,5,3,9,10,11],
                letters : [
                    "0x7e,0xa,0x7e",    // A 0
                    "0x7e,0x42,0x44",   // C 1
                    "0x7e,0x8,0x7e",    // H 2
                    "0x7e,0x2,0x7c",    // N 3
                    "0x7e,0x1a,0x6e",   // R 4
                    "0x7e,0x40,0x7e",   // U 5
                    "0x4e,0x52,0x66",   // S 6
                    "0x2,0x7e,0x2",     // T 7
                    "0x60,0x60,0x0",    // . 8
                    "0x7e,0x42,0x0",    // [ 9
                    "0x42,0x7e,0x0",    // ] 10
                    "0x0,0x0,0x0"             // 11
                ]                      
            }
        };
    function Plugin(element, options) {
        this.element = element;
        this.displayList = [];
        this.letterInProgress=false;
        this.startBuffer;
        this.endBuffer;
        this.textScrollState = {};
        this.playState;
        this.$el = $(this.element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.startBuffer = this.addDisplay("start");
            for(var v=0;v<this.options.displays;v++){
                matrix = this.addDisplay(v);
                this.displayList.push(matrix);
            }
                // console.log(v);
            this.endBuffer = this.addDisplay("end");
            this.startBuffer.element.addClass("supermatrixBuffer");
            this.endBuffer.element.addClass("supermatrixBuffer");
            return this;
        },
        addDisplay: function(cl){
                var matrixEl=$("<div></div>").addClass(this.options.prefix+cl);
                this.$el.append(matrixEl);
                return matrixEl.matrix72xx(this.options.matrixOptions);
        },
        addLetter:function(){
            options = this.options.scrollState;
            var ret = 0;
            if(!options.addLetters){
                return;
            }
            if(options.nextLetter>=options.orders.length){
                if(options.loopLetters){
                    options.nextLetter=0;
                    options.scrollFinish();
                }else{
                    // alert("stop letters");
                    // console.log("stop letters")
                    // options.letterInc=-1;
                    this.options.scrollState.addLetters=false;
                    ret = 1;
                    options.scrollFinish();
                    return;
                }
            }
            if(options.direction==3){
                var letter = "8,"+options.letters[options.orders[options.nextLetter]]+",-1,-1,-1,-1,-1";    
                // console.log(letter);
            }else if(options.direction==1){
                // var letter = "8,-1,-1,-1,-1,-1,"+options.letters[options.orders[options.orders.length-options.nextLetter]];    
                var n = options.orders.length-options.nextLetter-1;
                // console.log(">>>N",n);
                var letter = "8,-1,-1,-1,-1,-1,"+options.letters[options.orders[n]];    
                // options.letterTarget.setValue(letter);
            }
                options.letterTarget.setValue(letter);
            if(this.options.scrollState.invert){
                options.letterTarget.invert();    
            }
            // this.options.scrollState.invert = !this.options.scrollState.invert

                options.nextLetter++;
            // this.textScrollState = options;
            return ret;
        },
        scroll:function(){//-1){
            // if(this.letterInProgress) return;
            this.letterInProgress=true;
            options = this.options.scrollState;
            if(typeof(this.options.scrollState.letterFinish)==="undefined"){
                this.options.scrollState.letterFinish = this.options.letterFinish;
            }
            if(typeof(this.options.scrollState.scrollFinish)==="undefined"){
                this.options.scrollState.scrollFinish = this.options.scrollFinish;
            }
            // $.extend({}, defaults, this.textScrollState, options);
            if(options.direction==3){
                options.target = [...this.displayList,this.endBuffer].reverse();
                options.letterTarget=this.endBuffer;
             }else if(options.direction==1){
                options.target = [this.startBuffer,...this.displayList];
                options.letterTarget=this.startBuffer;
            }
            var res=0;
            if(options.addLetters&&options.orders.length>0){
                options.letterInc++;
                if(options.letterInc==options.letterSpacing){
                    res = this.addLetter(options);
                    options.letterInc=0;
                }
            }
            // this.textScrollState = options;
            options.target[0].shift(options);
            // if(res) this.options.scrollState.addLetters=false;
            this.letterInProgress=false;
            return this;
        },
        update: function () {
            return this;
        }
    }
    $.fn[pluginName] = function (options) {
        return $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
    }
})(jQuery, window, document);
