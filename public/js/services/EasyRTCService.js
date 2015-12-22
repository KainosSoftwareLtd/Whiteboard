angular.module('EasyRTCService', []).factory('EasyRTCService', [function() {

    var factory = {};

    factory.init = function(videoId, roomName) {
        easyrtc.enableDebug(true);
        console.log("Initializing.");
        easyrtc.enableAudio(false);
        easyrtc.enableAudioReceive(false);
        easyrtc.setRoomOccupantListener(callEverybodyElse);

        easyrtc.easyApp("kainos-whiteboard", "box0", ["box1", "box2", "box3"], loginSuccess);
        easyrtc.setDisconnectListener( function() {
            easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
        });



    };

    function callEverybodyElse(roomName, otherPeople) {

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






    easyrtc.setOnStreamClosed(function (callerEasyrtcid) {
      //  easyrtc.setVideoObjectSrc(document.getElementById('box1'), "");
    });

    easyrtc.setStreamAcceptor(function(callerId, stream){
        console.log('stream data ' + stream);
        easyrtc.setVideoObjectSrc(document.getElementById('box1'), stream);
    });

    factory.hangUp = function() {
        easyrtc.hangup();
    };

    function roomListener(roomName, occupants, isPrimary){
        //do something on connect / disconnect etc
        console.log('RTC RoomName' + roomName);
    }

    function loginSuccess(easyrtcId) {
        //handle this
        console.log('RTC login succeeded');
    }

    function loginFailure(easyrtcId, error) {
        //handle this
        console.log('RTC login failed ' + error);
    }

    return factory;
}]);