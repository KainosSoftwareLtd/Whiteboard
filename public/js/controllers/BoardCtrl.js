angular.module('BoardCtrl', []).controller('BoardCtrl', ['$scope', '$routeParams', 'EasyRTCService', function($scope, $routeParams, EasyRTCService) {

    var roomId = $routeParams.roomId;


    var socket = initSocket();
    var canvas = initCanvas();

    EasyRTCService.init('box0', roomId);
    EasyRTCService.setClientVideoStream('box1')


    function initSocket(){
        var socket = io.connect(null, {
            'connect timeout': 10000,
            'force new connection': true
        });

        if (!socket) {
            throw "io.connect failed";
        }
        else {

            socket.emit('createRoom', roomId);

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
            var data = JSON.stringify(canvas.toDatalessJSON());
            socket.emit('canvas data', data);
        });

        return canvas;
    }

}]);