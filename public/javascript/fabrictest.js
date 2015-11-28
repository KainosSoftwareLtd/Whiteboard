window.onload = function () {
    //var $ = function(id){return document.getElementById(id)};

    var socket = io();

    var canvas = this.__canvas = new fabric.Canvas('c', {
        isDrawingMode: true
    });

    var canvas2 = new fabric.Canvas('c2');

    canvas.on('mouse:up', function(options){
        //console.log(JSON.stringify(canvas));
        var x = JSON.stringify(canvas.toDatalessJSON());
        socket.emit('canvas data', x);
        

    });

    socket.on('canvas data', function(data) {
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });

};