angular.module('BoardCtrl', []).controller('BoardCtrl', ['$scope','EasyRTCService', function($scope, EasyRTCService) {

    var socket = initSocket();
    var canvas = initCanvas();

    EasyRTCService.init('box0', 'roomName');


    function initSocket(){
        var socket = io.connect(null, {
            'connect timeout': 10000,
            'force new connection': true
        });

        if (!socket) {
            throw "io.connect failed";
        }
        else {
            console.log("application allocated socket ", socket);
            easyrtc.useThisSocketConnection(socket);
        }

        socket.on('canvas data', function(data) {
            canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
        });

        return socket;
    }

    function initCanvas() {
        var canvas = this.__canvas = new fabric.Canvas('c', {
            isDrawingMode: true,
            width: 1000,
            height: 1000
        });

        canvas.freeDrawingBrush.width = 10;
        canvas.freeDrawingBrush.color = '#41a8c7';

        canvas.on('mouse:up', function(options){
            //console.log(JSON.stringify(canvas));
            var data = JSON.stringify(canvas.toDatalessJSON());
            socket.emit('canvas data', data);
        });

        return canvas;
    }

}]);