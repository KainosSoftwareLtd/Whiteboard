angular.module('BoardCtrl', []).controller('BoardCtrl', ['$scope', '$routeParams', 'EasyRTCService', function($scope, $routeParams, EasyRTCService) {

    var roomId = $routeParams.roomId;


    var socket = initSocket();
    var canvas = initCanvas();



    //EasyRTCService.init('box0', roomId);
    ////EasyRTCService.setClientVideoStream('box1');


    easyrtc.enableDebug(true);
    console.log("Initializing.");
    easyrtc.enableAudio(false);
    easyrtc.enableAudioReceive(false);
    easyrtc.setRoomOccupantListener(callEverybodyElse);

    easyrtc.easyApp("kainos-whiteboard", "box0", ["box1", "box2", "box3"], loginSuccess);
    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });


    function callEverybodyElse(roomName, otherPeople) {

        easyrtc.setRoomOccupantListener(null); // so we're only called once.

        var list = [];
        var connectCount = 0;
        for (var easyrtcid in otherPeople) {
            list.push(easyrtcid);
        }
        //
        // Connect in reverse order. Latter arriving people are more likely to have
        // empty slots.
        //
        function establishConnection(position) {
            function callSuccess() {
                connectCount++;
                if (connectCount < maxCALLERS && position > 0) {
                    establishConnection(position - 1);
                  //  $scope.$apply();
                }
            }

            function callFailure(errorCode, errorText) {
                easyrtc.showError(errorCode, errorText);
                if (connectCount < maxCALLERS && position > 0) {
                    establishConnection(position - 1);
                   // $scope.$apply();
                }
            }

            easyrtc.call(list[position], callSuccess, callFailure);
           // $scope.$apply();

        }

        if (list.length > 0) {
            establishConnection(list.length - 1);
        }

       // $scope.$apply();
    }


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