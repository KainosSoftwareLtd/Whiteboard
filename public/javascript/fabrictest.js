window.onload = function () {

    var mysocket = io.connect(null, {
        'connect timeout': 10000,
        'force new connection': true
    });

    if (!mysocket) {
        throw "io.connect failed";
    }
    else {
        console.log("application allocated socket ", mysocket);
        easyrtc.useThisSocketConnection(mysocket);
    }

    var canvas = this.__canvas = new fabric.Canvas('c', {
        isDrawingMode: true
    });

    canvas.on('mouse:up', function(options){
        //console.log(JSON.stringify(canvas));
        var x = JSON.stringify(canvas.toDatalessJSON());
        mysocket.emit('canvas data', x);
    });

    mysocket.on('canvas data', function(data) {
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });
};