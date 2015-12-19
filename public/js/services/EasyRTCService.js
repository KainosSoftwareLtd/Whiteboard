angular.module('EasyRTCService', []).factory('EasyRTCService', [function() {

    var factory = {};

    factory.init = function(videoId, roomName) {
        easyrtc.enableDebug(true);
        console.log("Initializing.");
        easyrtc.enableAudio(false);
        easyrtc.enableAudioReceive(false);
        easyrtc.setRoomOccupantListener(roomListener);

        easyrtc.initMediaSource(
            function () {
                var myVideo = document.getElementById(videoId);
                easyrtc.joinRoom(roomName);
                easyrtc.setVideoObjectSrc(myVideo, easyrtc.getLocalStream());
                easyrtc.connect("kainos-whiteboard", loginSuccess, loginFailure);
            },
            function () {
                //handle this
                console.log('Failed to set up video')
            })
    };

    factory.hangUp = function() {
        easyrtc.hangup();
    };

    function roomListener(roomName, occupants, isPrimary){
        //do something on connect / disconnect etc
        console.log(roomName + " " + occupants + " " + isPrimary);
    }

    function loginSuccess(easyrtcId) {
        //handle this
        console.log('login succeeded');
    }

    function loginFailure(easyrtcId, error) {
        //handle this
        console.log('login failed ' + error);
    }

    return factory;
}]);