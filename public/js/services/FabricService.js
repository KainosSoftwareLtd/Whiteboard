angular.module('FabricService', []).factory('FabricService', [function() {

    var factory = {};
    var canvas;

    factory.init = function(canvasId, width, height, isDrawingMode){

        canvas = this.__canvas;

        return this.__canvas = new fabric.Canvas(canvasId, {
            isDrawingMode: isDrawingMode,
            width: width,
            height: height
        });
    };

    factory.setBrushSize = function(width) {
        canvas.freeDrawingBrush.width = width;
    };

    factory.setBrushColour = function(hexColour) {
        canvas.freeDrawingBrush.color = hexColour;
    };

    return factory;
}]);