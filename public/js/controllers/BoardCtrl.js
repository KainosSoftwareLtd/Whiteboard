angular.module('BoardCtrl', []).controller('BoardCtrl', ['$scope', '$location', function ($scope, $location) {


    var roomId = $location.path().split(/[\s/]+/).pop();
    var maxCallers = 4;

    $scope.brushColor = '#41a8c7';
    $scope.brushSize = 5;
    var brushSizeStep = 5;

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

                easyrtc.joinRoom(roomId, function (data) {
                        console.log('Successfuly connected to room ' + data)
                    },
                    function (data) {
                        console.log('Error connecting to room ' + data);
                    });

                easyrtc.connect("kainos-whiteboard", connectSuccess, connectFailure);
            },
            connectFailure
        );
    }


    function gotData(who, msgType, data) {
        //console.log('got data from ' + who, msgType, data);
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    }


    easyrtc.setStreamAcceptor(function (callerEasyrtcid, stream) {
        var videoElements = angular.element(document.querySelector('#videoStreams')).children();

        for(var i = 1; i < 4; i++) {
            var thisVideo = videoElements.find('video')[i];

            if(thisVideo.id === "") {
                thisVideo.id = callerEasyrtcid;
                easyrtc.setVideoObjectSrc(thisVideo, stream);
                break;
            }
        }
    });

    easyrtc.setOnStreamClosed(function (callerEasyrtcid) {
        var video = document.getElementById(callerEasyrtcid);
        easyrtc.setVideoObjectSrc(video, "");
        video.id = "";
    });


    easyrtc.setDisconnectListener(function(){
       console.log('disconnected ');
    });



    //REF:https://easyrtc.com/docs/guides/easyrtc_client_tutorial.php
    function roomListener(roomName, otherPeople) {

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
                if (connectCount < maxCallers && position > 0) {
                    establishConnection(position - 1);
                }
            }

            function callFailure(errorCode, errorText) {
                easyrtc.showError(errorCode, errorText);
                if (connectCount < maxCallers && position > 0) {
                    establishConnection(position - 1);
                }
            }

            easyrtc.call(list[position], callSuccess, callFailure);
        }

        if (list.length > 0) {
            establishConnection(list.length - 1);
        }
    }

    function initCanvas() {
        var canvas = this.__canvas = new fabric.Canvas('c', {
            width: 1100,
            height: 600
        });

        canvas.freeDrawingBrush.width = $scope.brushSize;
        canvas.freeDrawingBrush.color = $scope.brushColor;

        canvas.on('object:modified', function () {
            sendData();
        });

        return canvas;
    }

    function sendData() {
        var data = JSON.stringify(canvas.toDatalessJSON());

        try {
            easyrtc.sendDataWS({'targetRoom': roomId}, 'canvasStuff', data, function (reply) {
                if (reply.msgType === "error") {
                    easyrtc.showError(reply.msgData.errorCode, reply.msgData.errorText);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    function removeCanvasEventListners() {
        canvas.off('mouse:up');
        canvas.off('mouse:down');
        canvas.off('mouse:move');
    }

    function makeObjectsOnCanvasSelectable(isSelectable) {
        var shapes = canvas.getObjects();
        shapes.forEach(function (object) {
            object.selectable = isSelectable;
        });
    }

    $scope.useMoveTool = function() {
        removeCanvasEventListners();
        makeObjectsOnCanvasSelectable(true);
        canvas.isDrawingMode = false;
    };

    $scope.undo = function(){
        canvas._objects.pop();
        canvas.renderAll();
        sendData();
    };

    $scope.onColorChange = function() {
        canvas.freeDrawingBrush.color = $scope.brushColor;
    };

    $scope.changeBrushSize = function (direction) {
        if(direction === '+') {
            $scope.brushSize += brushSizeStep;
        }
        if(direction === '-' && !($scope.brushSize <= brushSizeStep)) {
            $scope.brushSize -= brushSizeStep;
        }
        canvas.freeDrawingBrush.width =  $scope.brushSize;
    };

    $scope.clearBoard = function() {
        canvas.clear();
        sendData();
    };

    $scope.usePencilTool = function() {
        removeCanvasEventListners();
        makeObjectsOnCanvasSelectable(false);
        canvas.isDrawingMode = true;
        canvas.on('mouse:up', function () {
            sendData();
        });
    };

    $scope.useRectangleTool = function() {
        removeCanvasEventListners();
        makeObjectsOnCanvasSelectable(false);
        canvas.isDrawingMode = false;

        var startX, startY;

        canvas.on('mouse:down', function (options) {
            startX = options.e.offsetX;
            startY = options.e.offsetY;

            var rectangle = new fabric.Rect({
                left: startX,
                top: startY,
                width: 0,
                height: 0,
                fill: 'transparent',
                stroke: $scope.brushColor,
                strokeWidth: $scope.brushSize,
                selectable: false
            });

            canvas.on('mouse:move', function (option) {
                var e = option.e;
                rectangle.set('width', e.offsetX - startX);
                rectangle.set('height', e.offsetY - startY);
                rectangle.setCoords();
            });

            canvas.on('mouse:up', function (options) {
                canvas.off('mouse:move');
                canvas.off('mouse:up');
                canvas.add(rectangle);
                sendData();
            });
        });
    };

}]);