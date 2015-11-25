window.onload = function () {
    //var $ = function(id){return document.getElementById(id)};

    var canvas = this.__canvas = new fabric.Canvas('c', {
        isDrawingMode: true
    });

    var canvas2 = new fabric.Canvas('c2');

    canvas.on('mouse:up', function(options){
        //console.log(JSON.stringify(canvas));
        var x = JSON.stringify(canvas.toDatalessJSON());
        console.log(x);
        canvas2.loadFromJSON(x, canvas.renderAll.bind(canvas2));

    });

};