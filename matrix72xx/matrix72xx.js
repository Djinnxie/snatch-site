// jquery MD_MAX72XX Matrix library
// for generating 

(function ($, window, document, undefined) {
    var pluginName = 'matrix72xx',
        defaults = {
            width: 8,
            height: 8,
            isLocked: false,
            isEditable:true,
            outputFormat: "hex",
            divId:"matr_",
            outputTarget: false
        };
    function Plugin(element, options) {
        this.canUpdate = true;
        this.element = element;
        this.$el = $(this.element);
        this.selection = { x: -1, y: -1 };
        this.options = $.extend({}, defaults, options);
        this.dragState = false;
        this.isLocked = this.options.isLocked;

        this._defaults = defaults;
        this._name = pluginName;
        this.util = {
            getCell: function (x, y) {
                let target = $("#"+this.options.divId+" [data-row=" + x + "] [data-col=" + y + "]");
                return target;
            }
        }
        this.init();
    }

    function Cell(plugin, element, coord, options) {
        var state;
        this.prop = {};
        this.coord = coord;
        this.element = element;
        this.plugin = plugin;
        this.options = options;
        this.isState = false;
        this.enable = function () {
            this.state = true;
            return this;
        }
        this.disable = function () {
            this.state = false;
            return this;
        }
        this.toggle = function () {
            this.state = 2;
            return this;
        }
    }

    Object.defineProperties(Cell.prototype, {
        "state": {
            "get": function () { return this.isState },
            "set": function (val) {
                if (val === 1) val = true;
                if (val === 0) val = false;
                if (typeof (val) == "boolean") {
                    this.isState = val;
                } else if (val == "!" || val == 2) { // toggle
                    this.isState = !this.isState;
                } else {
                    return this.isState;
                }
                this.plugin.update();
                this.element.attr("data-checked", this.isState);
                return this.isState;
            }
        }
    })

    Plugin.prototype = {
        init: function () {
            this.options.divId = this.options.divId+$(".matrix").length; 
            cell = $("<td></td>");
            table = $("<table></table>");
            row = $("<tr></tr>");
            var divID = this.options.divId;
            var divIDSel = "#"+divID;
            table.attr("id", divID);
            table.attr("class", "matrix");
            table.data("matrix", this);
            let currentrow;
            for (i = 0; i < this.options.height; i++) {
                currentrow = row.clone();
                currentrow.attr("data-row", i);
                for (y = 0; y < this.options.width; y++) {
                    currentcell = cell.clone();
                    currentcell.attr("class", "matrixCell");
                    currentcell.data("obj", new Cell(this, currentcell, { x: i, y: y }, {}));
                    currentcell.attr("data-col", y);
                    currentcell.attr("data-checked", "false");
                    currentrow.append(currentcell);
                }
                table.append(currentrow);
            }
            this.$el.addClass("matrixContainer");
            this.$el.append(table);
            if(this.options.isEditable){

            $(document).on("mousedown", divIDSel, function (e) {
                if ($(this).data("matrix").isLocked) return;
                $(this).data("matrix").dragState = true;
            })
            $(document).on("mouseup", divIDSel, function (e) {
                if ($(this).data("matrix").isLocked) return;
                $(this).data("matrix").dragState = false;
            })
            $(document).on("mouseleave", divIDSel, function (e) {
                if ($(this).data("matrix").isLocked) return;
                $(this).data("matrix").dragState = false;
            })
            $(document).on("click", divIDSel+" .matrixCell", function (e) {
                if ($(this).data("obj").isLocked) return;
                // console.log("AAA");
                $(this).data("obj").toggle();
            })
            $(document).on("mouseover", divIDSel+" .matrixCell", function (e) {
                if ($(this).data("obj").isLocked) return;
                if ($(this).data("obj").plugin.dragState) {
                    $(this).data("obj").toggle();
                }
            })
            }
            this.update();
            return this;
        },
        update: function () {
            if (!this.canUpdate) return this;
            var val = this.getValue();
            if (this.options.outputTarget !== false) {
                var outputElement = $(this.options.outputTarget);
                if (outputElement[0].nodeName == "TEXTAREA" || outputElement[0].nodeName == "INPUT") {
                    outputElement.val(val);
                }
                // console.log(outputElement.tagName)
            }
            return this;
        },
        invert: function () {
            this.canUpdate = false;
            for (i = 0; i < this.options.width; i++) {
                for (n = 0; n < this.options.height; n++) {
                    this.cell(n, i).state = 2;
                }
            }
            this.canUpdate = true;
            this.update();
            return this;
        },
        shift: function(oopt){ // this is stupid but eh
            // console.log("shifting");
            // dir up right down left 0 1 2 3  
            var defaults={
                direction:3,
                letterFinish:function(){},
                data:"0x0",
                target:-1,
                loop:false,
                cycles:-1
            }
            var opt = $.extend(defaults,oopt); 
            // console.log(">",oopt);
            // console.log(opt.target);
            // console.log(opt);
            var toSend;
            var current = this.getValue();
            // console.log(current);
            if(opt.loop&&opt.cycles==-1){
                opt.cycles=opt.target.length+1;
            }

            var newTarget;
            if(opt.target.length>0){
                // console.log("shuffling");
                newTarget = opt.target.shift();
                if(opt.loop){
                    // console.log("looping");
                    opt.target.push(newTarget);
                    opt.cycles--;
                    // console.log(opt.cycles);
                }
                newTarget=opt.target[0];
                // console.log(newTarget);
            }else{
                // console.log("returning");
                return;
            }
            current.shift();
            if(opt.direction==1||opt.direction==3){ // the easy ones
                if(opt.direction==1){
                // console.log("moving r");
                    if(opt.loop&&opt.cycles==0){
                        current[0]=opt.data;
                    }else{
                        toSend = current.pop();
                        current.unshift(opt.data);
                    }
                }else{
                // console.log("moving L");
                    if(opt.loop&&opt.cycles==0){
                        current[current.length-1]=opt.data;
                    }else{
                    toSend = current.shift();
                    current.push(opt.data);
                    }
                }
            }
            current.unshift("8");
            // console.log(current);
            this.clear().setValue(current.join(","));
            opt.data=toSend;

            if((opt.cycles>0||!opt.loop)&&typeof(newTarget)!=="undefined"){
                // console.log("passing on");
                newTarget.shift(opt);
            }else{
                opt.letterFinish();
            }
            return this;
        },
        clear: function () {
            this.canUpdate = false;
            for (i = 0; i < this.options.width; i++) {
                for (n = 0; n < this.options.height; n++) {
                    this.cell(n, i).state = false;
                }
            }
            this.canUpdate = true;
            this.update();
            return this;
        },
        setValue: function (value) {
            this.canUpdate = false;
            if (typeof (value) == "string") {
                value = value.split("/")[0];
                value = value.split(",");
            }
            value.shift(1);
                for (l = 0; l < value.length; l++) {
                    if (value[l].includes("x")) {//hex
                        value[l] = parseInt(value[l], 16);
                    }
                }
            for (i = 0; i < this.options.width; i++) {
                var subject = value[i];
                if(subject>=0){

                var total = 0;
                var last = 128;
                for (n = this.options.height - 1; n >= 0; n--) {
                    var v = subject - last;
                    if (v >= 0 && v % 1 == 0) { // +0 != -0 
                        this.cell(n, i).state = true;
                        subject = v;
                    }else{
                        this.cell(n, i).state = false;
                    }
                    last = last / 2;
                }
                }
            }
            this.canUpdate = true;
            this.update();
            return this;
        },
        getValue: function () {
            var output = ["8"]
            for (i = 0; i < this.options.width; i++) {
                var total = 0;
                var last = 1;
                for (n = 0; n < this.options.height; n++) {
                    if (this.cell(n, i).state) {
                        total = total + last;
                    }
                    last = 2 * last;
                }
                if (this.options.outputFormat == "dec") {
                    output.push(total.toString());
                } else { //assume hex
                    output.push("0x" + total.toString(16));
                }
            }
            return output;
        },
        cell: function (x, y) {
            x = x || 0;
            y = y || 0;
            // var target = this.util.getCell(x, y);
            let target = $("#"+this.options.divId+" [data-row=" + x + "] [data-col=" + y + "]");
            return target.data("obj");
        },
        lock: function (lock = 1) {
            if (lock == 2) {
                this.isLocked = !this.isLocked;
            } else if (lock == true || lock == 1) {
                this.isLocked = true;
            } else if (lock == false || lock == 0) {
                this.isLocked = false;
            }
            return this;
        }
    }
    $.fn[pluginName] = function (options) {
        return $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
    }
})(jQuery, window, document);
