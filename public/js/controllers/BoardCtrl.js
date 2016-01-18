angular.module('BoardCtrl', ['color.picker']).controller('BoardCtrl', ['$scope', '$location', function($scope, $location) {


    var roomId =  $location.path().split(/[\s/]+/).pop();
    var maxCALLERS = 4;

    $scope.brushColor = '#41a8c7';
    $scope.brushSize = 5;

    var canvas = initCanvas();

    initRTC();

    function initRTC() {
        //easyrtc.enableDebug(true);
        console.log("Initializing.");

        easyrtc.setRoomOccupantListener(roomListener);
        var connectSuccess = function (myId) {
            console.log("My easyrtcid is " + myId);
        };

        easyrtc.setPeerListener(gotData);

        var connectFailure = function (errorCode, errText) {
            console.log('connection error ' + errText);
        };
        easyrtc.initMediaSource(
            function () {        // success callback
                var selfVideo = document.getElementById("myVideo");
                easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());

                easyrtc.joinRoom(roomId, function(data){
                    console.log('Successfuly connected to room ' + data)
                },
                function(data){
                    console.log('Error connecting to room ' + data);
                });

                easyrtc.connect("kainos-whiteboard", connectSuccess, connectFailure);
            },
            connectFailure
        );
    }


    function gotData(who, msgType, data){
        console.log('got data from ' + who, msgType, data);
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
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

    function initCanvas() {
        var canvas = this.__canvas = new fabric.Canvas('c', {
            isDrawingMode: true,
            width: 1000,
            height: 1000
        });

        canvas.freeDrawingBrush.width = $scope.brushSize;
        canvas.freeDrawingBrush.color = $scope.brushColor;

        canvas.on('mouse:up', function(options){
            var data = JSON.stringify(canvas.toDatalessJSON());

            easyrtc.sendDataWS({'targetRoom': roomId}, 'canvasStuff', data, function(reply) {
                if (reply.msgType === "error") {
                    easyrtc.showError(reply.msgData.errorCode, reply.msgData.errorText);
                }
            });

        });

        return canvas;
    }

    $scope.onColorChange = function($event, color) {
        canvas.freeDrawingBrush.color = color;
    };

    $scope.$watch('brushSize', function() {
        canvas.freeDrawingBrush.width = $scope.brushSize;
    });

    $scope.toggleDrawingMode = function() {
       canvas.isDrawingMode = !canvas.isDrawingMode;
    };



}]);