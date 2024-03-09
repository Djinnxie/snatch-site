var supermatrix;
var ts
var tail;
var buf;
$(document).ready(function(){
var options = {
    displays:6,
    // scrollFinish:function(){
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
            }, 10);
    }
}
    supermatrix = $("#supermatrix").supermatrix(options);
    // supermatrix.options.scrollState.letters = [
        
    // ]
    tail = 0;
    buf = supermatrix.options.displays*supermatrix.options.matrixOptions.width;
    supermatrix.scroll();
    return;
});