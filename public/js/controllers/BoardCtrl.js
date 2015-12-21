angular.module('BoardCtrl', []).controller('BoardCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {

    var roomId = $routeParams.roomId;

    var maxCALLERS = 4;

    var socket = initSocket();
    var canvas = initCanvas();
    initRTC();

    function initRTC() {
        //easyrtc.enableDebug(true);
        console.log("Initializing.");

        easyrtc.setRoomOccupantListener(roomListener);
        var connectSuccess = function (myId) {
            console.log("My easyrtcid is " + myId);
        };

        var connectFailure = function (errorCode, errText) {
            console.log(errText);
        };
        easyrtc.initMediaSource(
            function () {        // success callback
                var selfVideo = document.getElementById("myVideo");
                easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                easyrtc.joinRoom(roomId);
                easyrtc.connect("kainos-whiteboard", connectSuccess, connectFailure);
            },
            connectFailure
        );
    }

    easyrtc.setStreamAcceptor( function(callerEasyrtcid, stream) {
        var video = document.getElementById("clientVideo");
        easyrtc.setVideoObjectSrc(video, stream);
    });

    easyrtc.setOnStreamClosed( function (callerEasyrtcid) {
        easyrtc.setVideoObjectSrc(document.getElementById('caller'), "");
    });

    //REF:https://easyrtc.com/docs/guides/easyrtc_client_tutorial.php
    function roomListener(roomName, otherPeople) {

        easyrtc.setRoomOccupantListener(null); // so we're only called once.

        var list = [];
        var connectCount = 0;
        for(var easyrtcid in otherPeople ) {
            list.push(easyrtcid);
        }
        //
        // Connect in reverse order. Latter arriving people are more likely to have
        // empty slots.
        //
        function establishConnection(position) {

            function callSuccess() {

                connectCount++;
                if( connectCount < maxCALLERS && position > 0) {
                    establishConnection(position-1);
                }
            }
            function callFailure(errorCode, errorText) {
                easyrtc.showError(errorCode, errorText);
                if( connectCount < maxCALLERS && position > 0) {
                    establishConnection(position-1);
                }
            }
            easyrtc.call(list[position], callSuccess, callFailure);

        }
        if( list.length > 0) {
            establishConnection(list.length-1);
        }
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