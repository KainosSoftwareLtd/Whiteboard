describe('Board Controller', function() {

    beforeEach(module('BoardCtrl'));

    var $controller;

    //REF:https://docs.angularjs.org/guide/unit-testing
    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    var $scope, controller;

    beforeEach(function () {
        $scope = {};

        spyOn(easyrtc,'setStreamAcceptor');
        spyOn(easyrtc,'setPeerListener');
        spyOn(easyrtc,'initMediaSource');

        controller = $controller('BoardCtrl', {$scope: $scope});

    });

    it('Should set up easyRTC when the controller is initialised', function(){
        expect(easyrtc.setStreamAcceptor).toHaveBeenCalled();
        expect(easyrtc.setPeerListener).toHaveBeenCalled();
        expect(easyrtc.initMediaSource).toHaveBeenCalled();
    });

    it('sendDataUponJoining should be called alongside setStreamAcceptor', function(){
        expect(easyrtc.setStreamAcceptor).toHaveBeenCalled();
        spyOn(easyrtc, 'sendDataWS');
        $scope.sendDataUponJoining();
        expect(easyrtc.sendDataWS).toHaveBeenCalled();

    });

    it('$scope.onColorChange() should set the brush colour to the current colour pickers colour', function(){
        $scope.brushColor = '#66ff99';
        $scope.onColorChange();

        expect(__canvas.freeDrawingBrush.color).toEqual($scope.brushColor);
    });

    it('$scope.changeBrushSize() should increase the 5pts by the stepsize when increased', function(){
        $scope.brushSize = 5;
        $scope.changeBrushSize('+');
        expect($scope.brushSize).toEqual(10);

        $scope.brushSize = 5;
        $scope.changeBrushSize('+');
        $scope.changeBrushSize('+');
        $scope.changeBrushSize('+');
        $scope.changeBrushSize('+');
        expect($scope.brushSize).toEqual(25);
    });

    it('$scope.changeBrushSize() should decrease the brush by 5pts when decreased', function(){
        $scope.brushSize = 20;
        $scope.changeBrushSize('-');
        expect($scope.brushSize).toEqual(15);

        $scope.changeBrushSize('-');
        $scope.changeBrushSize('-');
        expect($scope.brushSize).toEqual(5);
    });

    it('$scope.changeBrushSize() should stop the brushsize from being smaller than 5pts when decreased', function(){
        $scope.brushSize = 10;
        $scope.changeBrushSize('-');
        expect($scope.brushSize).toEqual(5);

        $scope.changeBrushSize('-');
        $scope.changeBrushSize('-');
        expect($scope.brushSize).toEqual(5);

        $scope.changeBrushSize('+');
        $scope.changeBrushSize('+');
        expect($scope.brushSize).toEqual(15);
    });

    it('$scope.clearBoard() should clear the canvas and update connected clients', function(){
        spyOn(__canvas, 'clear');
        spyOn(easyrtc, 'sendDataWS');

        $scope.clearBoard();

        expect(__canvas.clear).toHaveBeenCalled();
        expect(easyrtc.sendDataWS).toHaveBeenCalled();
    });

    it('$scope.useMoveTool() should remove the canvas event listeners, make all the objects on the canvas selectable' +
        ' and set the canvas drawing mode to false ', function(){
        spyOn(__canvas, 'off');

        var rectangle = new fabric.Rect({
            left: 10,
            top: 20,
            width: 1,
            height: 1,
            selectable: false
        });
        __canvas.add(rectangle);

        $scope.useMoveTool();

        expect(__canvas.off).toHaveBeenCalledWith('mouse:up');
        expect(__canvas.off).toHaveBeenCalledWith('mouse:down');
        expect(__canvas.off).toHaveBeenCalledWith('mouse:move');

        expect(__canvas.getObjects()[0].selectable).toBeTruthy();

        expect(__canvas.isDrawingMode).toBeFalsy();
    });

    it('$scope.undo() should pop the last object off the ' +
        'canvas stack and send an update to the connected clients', function(){

        spyOn(easyrtc, 'sendDataWS');

        var rectangle1 = new fabric.Rect({
            left: 10,
            top: 20,
            width: 1,
            height: 1,
            selectable: false
        });

        var rectangle2 = new fabric.Rect({
            left: 30,
            top: 40,
            width: 2,
            height: 3,
            selectable: false
        });

        __canvas.add(rectangle1);
        __canvas.add(rectangle2);

        expect(__canvas._objects[0]).toEqual(rectangle1);
        expect(__canvas._objects[1]).toEqual(rectangle2);

        $scope.undo();

        expect(__canvas._objects[1]).toBeUndefined();
        expect(__canvas._objects[0]).toEqual(rectangle1);

        $scope.undo();

        expect(__canvas._objects[0]).toBeUndefined();
        expect(__canvas._objects[1]).toBeUndefined();

        expect(easyrtc.sendDataWS).toHaveBeenCalled();
    });

    it('$scope.usePencilTool() should remove all canvas event ' +
        'listeners, stop the objects on the canvas from being selectable, set the' +
        'canvas drawing mode to true and update all connect clients ', function(){

        spyOn(easyrtc, 'sendDataWS');

        var rectangle1 = new fabric.Rect({
            left: 10,
            top: 20,
            width: 1,
            height: 1,
            selectable: false
        });

        var rectangle2 = new fabric.Rect({
            left: 30,
            top: 40,
            width: 2,
            height: 3,
            selectable: false
        });
        __canvas.add(rectangle1);
        __canvas.add(rectangle2);

        spyOn(__canvas, 'off');

        $scope.usePencilTool();

        expect(__canvas.off).toHaveBeenCalledWith('mouse:up');
        expect(__canvas.off).toHaveBeenCalledWith('mouse:down');
        expect(__canvas.off).toHaveBeenCalledWith('mouse:move');

        expect(__canvas.isDrawingMode).toBeTruthy();

        __canvas.fire('mouse:up');
        expect(easyrtc.sendDataWS).toHaveBeenCalled();
    });

    describe('$scope.useRectangleTool', function(){

        beforeEach(function(){
            spyOn(__canvas, 'off');
            spyOn(easyrtc, 'sendDataWS');
            $scope.useRectangleTool();
        });

        it('Should remove all canvas event listeners', function(){
            expect(__canvas.off).toHaveBeenCalledWith('mouse:up');
            expect(__canvas.off).toHaveBeenCalledWith('mouse:down');
            expect(__canvas.off).toHaveBeenCalledWith('mouse:move');
        });

        it('Should stop all objects on the canvas from being selectable', function(){
            expect(__canvas.isDrawingMode).toBeFalsy();
        });

        it('Should draw a rectangle between two points and update all connected clients', function(){
            var options = {};
            options.e = {offsetX:20, offsetY: 30};

            __canvas.fire('mouse:down', options);

            var moveTo = {};
            moveTo.e = {offsetX: 60, offsetY: 90};

            __canvas.fire('mouse:move', moveTo);

            __canvas.fire('mouse:up');
            expect(__canvas._objects[0]).not.toBeUndefined();
            expect(easyrtc.sendDataWS).toHaveBeenCalled();

        });
    });
});