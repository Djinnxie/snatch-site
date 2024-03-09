var supermatrix;
var ts
var tail;
var buf;
$(document).ready(function(){
var options = {
    // scrollFinish:function(){alert("done!")}
    displays:6,
    // scrollFinish:function(){
    //     setTimeout(function(){
    //         supermatrix.textScrollState.addLetters=true;
    //         supermatrix.scroll()
    //     }, 1000);
    // },
    letterFinish:function(){
        // return;
            setTimeout(function(){
                supermatrix.scroll()
            //     if(!supermatrix.options.scrollState.addLetters){
            //         if(tail<buf){
            //             tail++;
            //         }else{
            //             // alert("fin")
            //             tail=0;
            //             supermatrix.options.scrollState.addLetters=true;
            //             // return;
            //         }
            //     }
            //     supermatrix.scroll()
            }, 100);
    }
}
    supermatrix = $("#supermatrix").supermatrix(options);
    tail = 0;
    buf = supermatrix.options.displays*supermatrix.options.matrixOptions.width;
    supermatrix.scroll();
    // ts = setInterval(function(){
    //     supermatrix.scroll()
    // }, 500);
    return;
    // matrix = $("#matrix0").matrix72xx();
    // matrix2 = $("#matrix1").matrix72xx();
    // matrix3 = $("#matrix2").matrix72xx();
    // buffer = $("#buffer").matrix72xx();
    // matrix.clear().setValue("8,0x0,0x7e,0x12,0x12,0x12,0x7e,0x0,0x0")
    // matrix2.clear().setValue("8,0x0,0x7e,0x4a,0x4a,0x4e,0x78,0x0,0x0")
    // buffer.clear().setValue("8,0x4e,0x52,0x62,0x0,0x0,0x0,0x0,0x0");
var count = 4;
function test(dir="l"){
    if(dir=="l"){
        // var chain = [matrix3,matrix2,matrix];
        var chain = [buffer,matrix3,matrix2,matrix];
        buffer.shift({direction:3,target:chain,loop:false});
        count++;
        if(count==5){
            addL();    
            count=0;
        }
        // matrix3.shift({direction:3,target:chain,loop:true});
    }else{
        // var chain = [matrix3,matrix2,matrix];
        var chain = [buffer,matrix,matrix2,matrix3];
        buffer.shift({direction:1,target:chain,loop:true});
    // matrix.shift(1,"0x0",chain,1);
        
    }
}
var letters = [
    // "-1,-1,-1",
    // "0x4e,0x52,0x62",
    // "0x7e,0x6,0x7c",
    // "0x7e,0xa,0x7e",
    // "0x2,0x7e,0x2",
    // "0x7e,0x42,0x42",
    // "0x7e,0x8,0x7e"
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
"0,0,0"             // 11
]                      

var orders = [
    // 1,2,3,4,5,6,0,0
    6,3,0,7,1,2,8,4,5,3,9,10,11
]
var pos = 0;
function addL(){
    if(pos>=orders.length){
        pos=0;
    }
    var letter = "8,-1,-1,-1,-1,-1,"+letters[orders[pos]];    
    buffer.setValue(letter);
    pos++;
}
});