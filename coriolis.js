// +46769439404

//##############################################################################################################
//
//      VIGTIGT: se dette eksempel for hvordan tilføjede objekter grupperes og centreres på canvas'et: 
//      http://paperjs.org/reference/group/#group
// 
//      Cirkel placeres på canvas via mus (andet eksempel fra oven):
//      http://paperjs.org/tutorials/project-items/transforming-items/
// 
//      SVG'er i paper.js:
//      http://stackoverflow.com/questions/27031945/animating-path-segments-of-an-imported-svg-in-paper-js
//
//##############################################################################################################


// https://packagecontrol.io/packages/Comment-Snippets

//############################################################################################################## 
//                                      15-11-2016 - Problemer på telefon:
//##############################################################################################################
// 
// (1) Når man trykker på "<" eller ">", så sår registrere objektet ikke at man løfter fingeren fra "<" eller ">" - hvilket gåt at flvet heletiden rotere.
//
// (2) Developer mode på oneplus two giver følgende fejl når objektet loader:
//          Handling of 'touchstart' input event was delayed for 2147483647 ms due to main thread being busy. Consider marking event handler as 'passive' to make the page more responive.
//
//     Google-søgning på problemet giver følegde forklaring om "Passive Event Listeners":
//          http://stackoverflow.com/questions/39152877/consider-marking-event-handler-as-passive-to-make-the-page-more-responive


var memObj = jsonData.memObj; // Object that keeps track of the black and red dot (e.g. start and stop position) between each student tries (while reset=false), until the treset is set to true.

var JQ = jQuery;

detectBootstrapBreakpoints(); // This function call has to be here, due to the use of $(document).ready() and $(window).resize() inside the function.

JQ(document).ready(function() {
    // getAjaxData("GET", "json/quizData.json", false, "json"); 
    // getAjaxData("GET", "json/carouselDataTest_4_small.json", false, "json");
    console.log("jsonData: " + JSON.stringify(jsonData));

    JQ('#header').prepend(jsonData.header);
    JQ('#instruction').prepend(instruction('Turen går fra ' + memObj.takeoffLocation + ' til ' + memObj.landingLocation + '. ' + jsonData.instruction));
    JQ('#explanation').prepend(explanation(jsonData.explanation));

    // debugger;  // <------ Debugging in paper.js: http://stackoverflow.com/questions/24272396/console-access-of-paper-js-objects

    rotateCheck(); // "Rotate you screen" message!

    setBootstrapRules();
});


JQ(window).resize(function() {
    project.clear();
    main();

    // if (bootstrapcolObj[bootstrapBreakpointSize] <= bootstrapcolObj['sm']){
    //     JQ('.canvasControl_left').removeClass('floatLeft').addClass('floatRight');
    //     JQ('#overlayControls').addClass('smallView');
    // } else {
    //     JQ('.canvasControl_left').removeClass('floatRight').addClass('floatLeft');
    //     JQ('#overlayControls').removeClass('smallView');
    // }

    setBootstrapRules();
});


JQ(document).on('click', "#tryAgain", function(event) { // This is needed since quick clicks does not fire "mouseup" and "mousedown" realiably.
    project.clear();
    main();
});


$(document).on('click', "#reload", function() {
    location.reload();
});


JQ(document).on('click', ".canvasControl_go", function(event) { // This is needed since quick clicks does not fire "mouseup" and "mousedown" realiably.
    console.log('canvasControl_go - CLICK');
    event.key = 'space';
    tool.onKeyDown(event);
});



/*----------  Check om det er mobil device)----------*/

if (jQuery.browser.mobile ==true) {
    
    //================   Event litserners for pressing "left"  ================

    JQ(document).on(' touchend', ".canvasControl_left", function(event) {
        console.log('canvasControl_left - MOUSEUP');
        clearTimeout(timerId);
        tool.onKeyUp();
    });

    JQ(document).on(' touchstart', ".canvasControl_left", function(event) {
        console.log('canvasControl_left - KEYDOWN');

        window.timerId = setInterval(function() {
            event.key = 'left';
            tool.onKeyDown(event);
        }, 100);

    });


    //================   Event litserners for pressing "right"  ================

    JQ(document).on(' touchend', ".canvasControl_right", function(event) {
        console.log('canvasControl_right - MOUSEUP, comrade');
        clearTimeout(timerId);
        tool.onKeyUp();
    });

    JQ(document).on(' touchstart', ".canvasControl_right", function(event) {
        console.log('canvasControl_right - MOUSEDOWN, comrade');

        window.timerId = setInterval(function() {
            event.key = 'right';
            tool.onKeyDown(event);
        }, 100);

    });


/*----------  Hvis det er desktop: ----------*/
} else {


    //================   Event litserners for pressing "left"  ================

    JQ(document).on('mouseup', ".canvasControl_left", function(event) {
        console.log('canvasControl_left - MOUSEUP');
        clearTimeout(timerId);
        tool.onKeyUp();
    });

    JQ(document).on('mousedown', ".canvasControl_left", function(event) {
        console.log('canvasControl_left - KEYDOWN');

        window.timerId = setInterval(function() {
            event.key = 'left';
            tool.onKeyDown(event);
        }, 100);

    });

    JQ(document).on('click', ".canvasControl_left", function(event) { // This is needed since quick clicks does not fire "mouseup" and "mousedown" realiably.
        console.log('canvasControl_left - CLICK');
        event.key = 'left';
        tool.onKeyDown(event);
    });


    //================   Event litserners for pressing "right"  ================

    JQ(document).on('mouseup', ".canvasControl_right", function(event) {
        console.log('canvasControl_right - MOUSEUP');
        clearTimeout(timerId);
        tool.onKeyUp();
    });

    JQ(document).on('mousedown', ".canvasControl_right", function(event) {
        console.log('canvasControl_right - MOUSEDOWN');

        window.timerId = setInterval(function() {
            event.key = 'right';
            tool.onKeyDown(event);
        }, 100);

    });


    JQ(document).on('click', ".canvasControl_right", function(event) { // This is needed since quick clicks does not fire "mouseup" and "mousedown" realiably.
        console.log('canvasControl_right - CLICK');
        event.key = 'right';
        tool.onKeyDown(event);
    });

}
    //##############################################################################################################
    //                  FUNCTIONS
    //##############################################################################################################



function shuffelArray(ItemArray) {
    var NumOfItems = ItemArray.length;
    var NewArray = ItemArray.slice(); // Copy the array...
    var Item2;
    var TempItem1;
    var TempItem2;
    for (var Item1 = 0; Item1 < NumOfItems; Item1++) {
        Item2 = Math.floor(Math.random() * NumOfItems);
        TempItem1 = NewArray[Item1];
        TempItem2 = NewArray[Item2];
        NewArray[Item2] = TempItem1;
        NewArray[Item1] = TempItem2;
    }
    return NewArray;
}


function returnRandomLocation() {

    if (typeof(memObj.locationMem) === 'undefined') {
        memObj.locationMem = [];
        for (var i = 0; i < memObj.location.length; i++) { // Sort all points acording to distance relative to the first point in the array

            var point1 = memObj.location[0].point;
            var point2 = memObj.location[i].point;
            var dist = distance(point1, point2);
            console.log('returnRandomLocation - dist: ' + dist);
            if ((memObj.minDist <= distance(point1, point2)) && (distance(point1, point2) <= memObj.maxDist)) {
                memObj.locationMem.push(i);
            }
        }
    }
    memObj.locationMem = shuffelArray(memObj.locationMem); // Make the order of points random.
    console.log('returnRandomLocation - memObj.locationMem: ' + memObj.locationMem);
    var index = memObj.locationMem.splice(0, 1)[0];
    console.log('returnRandomLocation - index: ' + index);
    return index; // Returns a random index number of the memObj.location array.
}


function test_setAllLocations() {
    for (var i = 0; i < memObj.location.length; i++) {
        var vec = new Point(memObj.location[i].point.x, memObj.location[i].point.y) * ratio + view.center;
        var path = new Path.Circle(vec, 20 * ratio);
        path.fillColor = 'yellow';
        group.addChild(path);
    }
}



function detectBootstrapBreakpoints() {
    if (typeof(bootstrapBreakpointSize) === 'undefined') {
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize defined.');
        window.bootstrapBreakpointSize = null;
        window.bootstrapcolObj = { xs: 0, sm: 1, md: 2, lg: 3 };
    }

    JQ(document).ready(function() {
        console.log('detectBootstrapBreakpoints - document.ready.');
        JQ('body').append('<div id="bootstrapBreakpointWrapper"> <span class="visible-xs-block"> </span> <span class="visible-sm-block"></span> <span class="visible-md-block"> </span> <span class="visible-lg-block"> </span> </div>');
        bootstrapBreakpointSize = JQ("#bootstrapBreakpointWrapper>span:visible").prop('class').split('-')[1];
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize: ' + bootstrapBreakpointSize);
    });

    JQ(window).on('resize', function() {
        console.log('detectBootstrapBreakpoints - window.resize.');
        bootstrapBreakpointSize = JQ("#bootstrapBreakpointWrapper>span:visible").prop('class').split('-')[1];
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize: ' + bootstrapBreakpointSize + ', typeof(bootstrapBreakpointSize): ' + typeof(bootstrapBreakpointSize));
    });
}


function setBootstrapRules() {
    console.log('setBootstrapRules - bootstrapBreakpointSize: ' + bootstrapBreakpointSize + ', bootstrapcolObj[' + bootstrapcolObj[bootstrapBreakpointSize] + ']: ' + bootstrapcolObj[bootstrapBreakpointSize] + ', bootstrapcolObj["sm"]: ' + bootstrapcolObj['sm']);
    if (bootstrapcolObj[bootstrapBreakpointSize] <= bootstrapcolObj['sm']) {
        // $('.canvasControl_left').removeClass('floatLeft').addClass('floatRight');
        $('.canvasControl_left').removeClass('floatRight').addClass('floatLeft');
        $('#overlayControls').addClass('smallView');
    } else {
        // $('.canvasControl_left').removeClass('floatRight').addClass('floatLeft');
        $('.canvasControl_left').removeClass('floatLeft').addClass('floatRight');
        $('#overlayControls').removeClass('smallView');
    }
}


// If isStepSlow() is not called after 
function isStepSlow(milliSec) {

    if (typeof(timerId) === 'undefined') {
        window.timerId = true;
    }

    // var bool = (timerId===null)?true:false;
    console.log('isStepSlow  - timerId: ' + timerId + ', typeof(timerId): ' + typeof(timerId));

    if (timerId !== null) {
        clearTimeout(timerId);
        bool = false;
    }
    timerId = setTimeout(timerAction, milliSec);


    function timerAction() {
        timerId = null;
        bool = true;
    }

    return bool;
}


function turnAngle(direction, event) {

    if (typeof(timerId) === 'undefined') {
        window.timerId = true;
    }

    console.log('turnAngle  - timerId: ' + timerId + ', typeof(timerId): ' + typeof(timerId));

    if (timerId !== null) {
        timerAction(direction, event);
    }

    function timerAction(direction, event) {
        console.log('turnAngle  - timerAction - CALLED!');
        event.key = direction;
        tool.onKeyDown(event);
        clearTimeout(timerId);
        timerId = setTimeout(timerAction, 100);
    }
}


function initCannonAngle(angle) {
    if (angle == 'center') { // center of the circle 
        var angleVec = view.center - cObj.cannonPoint;
        var vec2 = new Point(212 * ratio).rotate(angleVec.angle - 45) + view.center; // -45 degrees because Point(212*ratio) equals the vector (212*ratio, 212*ratio) which is at a 45 degree angle relative to (0,0) eg. the upper-left-corner.
        console.log('initCannonAngle - vec - center: ' + JSON.stringify(vec2));
    }
    if (angle == 'random') {
        var vec2 = new Point(212 * ratio).rotate(Math.round(360 * Math.random())) + view.center;
        console.log('initCannonAngle - vec - random: ' + JSON.stringify(vec2));
    }
    // vec2 = vec2*ratio;
    var path = new Path.Circle(vec2, 5);
    // path.fillColor = 'blue';
    group.addChild(path);
    cObj.cannonAngle = vec2;
    cObj.cannonAnglePath = path;
    blueDot = path;

    // path = Path.Line(cObj.cannonPoint, cObj.cannonAngle);                    // <-------  OK!!!, but this expression does not keep track of the rotation.
    path = Path.Line(cObj.cannonPath.position, cObj.cannonAnglePath.position); // <-------  OK!!! - this keeps track of the rotation. Always use this expression!
    path.strokeColor = 'black';
    path.dashArray = [10, 12]; // Makes the line dashed...
    group.addChild(path);
    cObj.cannonLinePath = path;

    cObj.cannonBallFlightVector = cObj.cannonAnglePath.position - cObj.cannonPath.position;
    raster_flyingObject.rotate(cObj.cannonBallFlightVector.angle + 90);
    console.log('initCannonAngle - cObj.cannonBallFlightVector.angle: ' + cObj.cannonBallFlightVector.angle);

    console.log('initCannonAngle - cObj.cannonLinePath: ' + JSON.stringify(cObj));

}


function calcFlyingObjectAngleStep(angle) {
    // // var angleVec = cObj.cannonAnglePath.position - cObj.cannonPath.position;  // This is wrong, since angleVec.angle gives the (correct) angel of angleVec, but Point(212) at MARK (#1#) below is relative to the center of the green spinning circle/the world.
    // var angleVec = cObj.cannonAnglePath.position - view.center;                  // This is correct: we find the angle relative to the center of the green spinning circle/the world, and in MARK (#1#) below calculates the new vector relative to the center the world.
    // console.log('alterCannonAngle - angleVec.angle: ' + angleVec.angle);
    // var angleNew1 = angleVec.angle + angle;  // <-------------------------  IMPORTANT: Times one!!!
    // var angleNew2 = angleVec.angle + angle*2;  // <-------------------------  IMPORTANT: Times two!!!

    // console.log('alterCannonAngle - cObj.angle: ' + cObj.angle + ', angle: ' + angle);

    // var vec2 = new Point(212*ratio).rotate(angleNew1-45) + view.center;  // MARK (#1#) 
    // var path2 = new Path.Circle(vec2, 5);

    // var vec3 = new Point(212*ratio).rotate(angleNew2-45) + view.center;  // MARK (#1#) 
    // var path3 = new Path.Circle(vec2, 5);

    // var resAngel = vec2.angle-vec3.angle;
    // console.log('calcFlyingObjectAngleStep - resAngel: ' + resAngel);

    // return resAngel;

}

function returnPointOnLand() {
    // getPixel(point)
}


function calcWorldAngle(angleCount) {
    // var sign = (cObj.earthRotationSpeed>0)?1:-1;
    var sign = (memObj.earthRotationSpeed > 0) ? 1 : -1;
    // var d = cObj.angleCount*cObj.earthRotationSpeed/360;
    // var d = angleCount*cObj.earthRotationSpeed/360;
    var d = angleCount * memObj.earthRotationSpeed / 360;
    var k = d - Math.floor(d);

    // var angle = k*sign*360;  
    var angle = -Math.abs(k * sign * 360); // This makes the angle always negativ - which make the program work in both clockwise and counter-clockwise rotation situations.

    // if ((Math.round(angle) % 10) == 0){
    //     console.log('calcWorldAngle - angle: ' + angle );
    // }

    return angle;
}


function returnRasterIndex(imgName) {
    var child = paper.project._children[0]._children[0]._children;
    console.log('returnRasterIndex - child: ' + JSON.stringify(child));
    for (var n in child) {
        console.log('returnRasterIndex - child[' + n + ']: ' + JSON.stringify(child[n]));
        var arr = JSON.parse(JSON.stringify(child[n]));
        if (arr[0] == 'Raster') {
            console.log('returnRasterIndex - arr[1].source: ' + arr[1].source);
            if (arr[1].source.indexOf(imgName) !== -1) {
                console.log('returnRasterIndex - n: ' + n);
                return n;
            }
        }
    }
}

// d = abs(A.position - B.position)/2
// y = -(4*b/d^2)*x^2 + b;
// Define b = 1, ==> y = -(4/d^2)*x^2 + 1;
function scaleByflyingObjectPerabola(currentTraveledLength) {
    console.log('scaleByflyingObjectPerabola - currentTraveledLength: ' + currentTraveledLength);
    // var vec_d = redDot - blackDot;
    var vec_d = cObj.blackDot_vec - cObj.redDot_vec;
    var d = vec_d.length;
    console.log('scaleByflyingObjectPerabola - d: ' + d);
    var x = currentTraveledLength - d / 2;
    console.log('scaleByflyingObjectPerabola - x: ' + x);
    var scale = -(4 / (d * d)) * x * x + 1;
    scale *= (scale < 0) ? -1 : 1;
    console.log('scaleByflyingObjectPerabola - scale: ' + scale);
    // raster_flyingObject.scale(1 + cObj.imgScale*ratio);
}


// IMPORTANT: 
// item.rotate(V) takes an angle-increment (delta) as argument "V", and not the absolute angle relative to the x-axis. 
// This means that you either have to find the angle-increment each time you press the "right" or "left" keys (this 
// has proofed to be difficult to do) OR you need to reinitialize the raster image with the new absolute angle 
// relative to the x-axis. The last stategy is used here.
//
// This technique does NOT work either (for absolute angle relative to the x-axis):
//      // raster_flyingObject.applyMatrix = false; // SEE:  https://github.com/paperjs/paper.js/issues/458
function creatNewFlyingObject(position) {
    // raster_flyingObject.remove();
    // raster_flyingObject = new Raster({
    //     source: cObj.imageName,
    //     position: position
    // }); 

    // raster_flyingObject = JSON.parse(JSON.stringify(raster_flyingObject_copy));
    // raster_flyingObject = Object.assign({}, raster_flyingObject_copy);


    raster_flyingObject.position = position;
    // raster_flyingObject.scale(cObj.imgScale*ratio);


    // raster_flyingObject.scale((cObj.imgScale + scaleByflyingObjectPerabola(position.length))*ratio);

    // raster_flyingObject.applyMatrix = false; // Does not work - SEE:  https://github.com/paperjs/paper.js/issues/458

    // group.addChild(raster_flyingObject);  // This does NOT add the plane below the black dot.
    // raster_flyingObject.insertBelow(path1);  // This add the plane below the black dot.


    console.log('creatNewFlyingObject -  cObj.worldAngle: ' + cObj.worldAngle);


    cObj.cannonBallFlightVector_2 = cObj.cannonAnglePath.position - cObj.cannonPath.position;

    if (typeof(cObj.oldAngle) === 'undefined') {
        // cObj.oldAngle = cObj.worldAngle + cObj.cannonBallFlightVector_2.angle + 90;              // Commented out 29-11-2016
        // cObj.oldAngle = cObj.worldAngle + cObj.cannonBallFlightVector_2.angle + cObj.imgInitAngel;  // Added 29-11-2016
        cObj.oldAngle = cObj.worldAngle + cObj.cannonBallFlightVector_2.angle + cObj.imgInitAngel;  // Added 29-11-2016
    }

    // cObj.cannonBallFlightVector_2 = cObj.cannonAnglePath.position - cObj.cannonPath.position;
    if (typeof(cObj.cannonBallFired) === 'undefined') {
        // raster_flyingObject.rotate(cObj.cannonBallFlightVector_2.angle + cObj.imgInitAngel);

        cObj.newAngle = cObj.cannonBallFlightVector_2.angle + cObj.imgInitAngel;
        raster_flyingObject.rotate(cObj.worldAngle - cObj.oldAngle + cObj.newAngle);   // cObj.worldAngle - cObj.oldAngle + cObj.newAngle  =  cObj.worldAngle - (cObj.worldAngle + cObj.cannonBallFlightVector_2.angle + cObj.imgInitAngel) + (cObj.cannonBallFlightVector_2.angle + cObj.imgInitAngel)  =  cObj.worldAngle - cObj.worldAngle - cObj.cannonBallFlightVector_2.angle - cObj.imgInitAngel + cObj.cannonBallFlightVector_2.angle + cObj.imgInitAngel  =  0;
        cObj.oldAngle = cObj.newAngle;
    } else {
        if (typeof(cObj.constantFlightAngle) === 'undefined') { // Define constantFlightAngle ONLY once...
            cObj.constantFlightAngle = cObj.cannonBallFlightVector_2.angle;
        }
        console.log('creatNewFlyingObject - cObj.constantFlightAngle: ' + cObj.constantFlightAngle);
        // raster_flyingObject.rotate(cObj.constantFlightAngle + cObj.imgInitAngel);

        cObj.newAngle = cObj.constantFlightAngle + cObj.imgInitAngel + cObj.worldAngle;
        raster_flyingObject.rotate(-cObj.oldAngle + cObj.newAngle);
        cObj.oldAngle = cObj.newAngle;

    }


    // // cObj.diffAngle
    // console.log('creatNewFlyingObject - cObj.diffAngle: ' + cObj.diffAngle);
    // // raster_flyingObject.remove();
    // raster_flyingObject.rotate(cObj.diffAngle);
    // // group.addChild(raster_flyingObject); 

}


function alterCannonAngle(angle) {

    // var angleVec = cObj.cannonAnglePath.position - cObj.cannonPath.position;  // This is wrong, since angleVec.angle gives the (correct) angel of angleVec, but Point(212) at MARK (#1#) below is relative to the center of the green spinning circle/the world.
    var angleVec = cObj.cannonAnglePath.position - view.center; // This is correct: we find the angle relative to the center of the green spinning circle/the world, and in MARK (#1#) below calculates the new vector relative to the center the world.
    console.log('alterCannonAngle - angleVec.angle: ' + angleVec.angle);
    cObj.angle = angleVec.angle + angle;

    console.log('alterCannonAngle - cObj.angle: ' + cObj.angle + ', angle: ' + angle);

    var vec2 = new Point(212 * ratio).rotate(cObj.angle - 45) + view.center; // MARK (#1#) 
    // vec2 = vec2*ratio;
    var path2 = new Path.Circle(vec2, 5);
    cObj.cannonAnglePath.remove();
    // path2.fillColor = 'blue';
    group.addChild(path2);
    blueDot = path2;


    cObj.cannonAngle = vec2;
    cObj.cannonAnglePath = path2;
    cObj.cannonLinePath.remove();
    var path = Path.Line(cObj.cannonPath.position, cObj.cannonAnglePath.position);
    path.strokeColor = 'black';
    path.dashArray = [10, 12]; // Makes the line dashed...
    group.addChild(path);
    cObj.cannonLinePath = path;


    // cObj.cannonBallFlightVector = cObj.cannonAnglePath.position - cObj.cannonPath.position;


    // NEDENSTÅENDE VIRKER HVIS JORDEN IKKE ROTERE:
    // cObj.angle_old = (typeof(cObj.angle_new)!=='undefined')? cObj.angle_new : cObj.cannonBallFlightVector.angle - angle;  // Ajust by subtracting the first angle if angle_new is not defined.
    // cObj.angle_new = cObj.cannonBallFlightVector.angle; 
    // cObj.angle_diff = cObj.angle_new - cObj.angle_old;
    // raster_flyingObject.rotate(cObj.angle_diff);
    // console.log('alterCannonAngle - angle_old: ' + cObj.angle_old + ', angle_new: ' + cObj.angle_new + ', angle_diff: ' + cObj.angle_diff);


    creatNewFlyingObject(cObj.cannonPath.position);


    console.log('PROJECT: ');
    console.log(project);

}


function cannonBallFlightPath() {
    // var angleVec = cObj.cannonAnglePath.position - cObj.cannonPath.position;  // This is wrong, since angleVec.angle gives the (correct) angel of angleVec, but Point(212) at MARK (#1#) below is relative to the center of the green spinning circle/the world.
    var angleVec = cObj.cannonAnglePath.position - view.center; // This is correct: we find the angle relative to the center of the green spinning circle/the world, and in MARK (#1#) below calculates the new vector relative to the center the world.
    console.log('fireCannon - angleVec.angle: ' + angleVec.angle);
    cObj.angle = angleVec.angle;

    console.log('fireCannon - cObj.angle: ' + cObj.angle);

    var vec2 = new Point(212 * ratio).rotate(cObj.angle - 45) + view.center; // MARK (#1#) 
    // vec2 = vec2*ratio;
    var path2 = new Path.Circle(vec2, 5);
    cObj.cannonAnglePath.remove();
    // path2.fillColor = 'blue';
    // group.addChild(path2);

    cObj.cannonAngle = vec2;
    cObj.cannonAnglePath = path2;
    cObj.cannonLinePath.remove();
    // cObj.cannonBallFlightVectorStart = new Point(cObj.cannonPath.position);
    // cObj.cannonBallFlightVector = new Point(cObj.cannonAnglePath.position) - cObj.cannonBallFlightVectorStart;
    cObj.cannonBallFlightVectorStart = cObj.cannonPath.position;
    cObj.cannonBallFlightVector = cObj.cannonAnglePath.position - cObj.cannonPath.position;
    cObj.cannonBallFlightLength = cObj.cannonBallFlightVector.length;
    console.log('cannonBallFlightPath - cannonBallFlightLength: ' + cObj.cannonBallFlightLength);
    console.log('cannonBallFlightPath - cObj 1: ' + JSON.stringify(cObj));
    cObj.cannonBallFlightVector = cObj.cannonBallFlightVector.normalize();
    console.log('cannonBallFlightPath - cObj.cannonBallFlightVector.length: ' + cObj.cannonBallFlightVector.length);
    var path = Path.Line(cObj.cannonPath.position, cObj.cannonAnglePath.position);

    path.strokeColor = 'black';
    path.dashArray = [10, 12]; // Makes the line dashed...
    // group.addChild(path);
    cObj.cannonLinePath = path;
}


function moveCannonBall(speed) {
    if ((typeof(cObj.cannonBallFired) !== 'undefined') && (cObj.cannonBallFired)) {
        console.log('moveCannonBall - CALLED ');
        cObj.speed = (typeof(cObj.speed) === 'undefined') ? speed : cObj.speed + speed;
        var directionVec = cObj.cannonBallFlightVector * cObj.speed;
        var vec = directionVec + cObj.cannonBallFlightVectorStart;
        console.log('moveCannonBall - vec: ' + JSON.stringify(vec));
        if (typeof(cObj.cannonBallFlightPath) !== 'undefined') {
            cObj.cannonBallFlightPath.remove();
        }
        var path = new Path.Circle(vec, 5); // The moving cannonball
        path.strokeColor = 'black';
        cObj.cannonBallFlightPath = path;
        blackDot = path;

        var drawPath = new Path.Circle(vec, 0.5); // The traced out path of the cannonball 
        drawPath.strokeColor = 'black';
        group.addChild(drawPath);

        // raster_flyingObject.position = vec;
        creatNewFlyingObject(vec);
        scaleByflyingObjectPerabola(directionVec.length);

        if (directionVec.length >= cObj.cannonBallFlightLength) { // Condition to stop the cannonball from moving out of "the world"
            cObj.cannonBallFired = false;

            if (typeof(cObj.flyingObjectNotAtDestination) === 'undefined') {
                cObj.flyingObjectNotAtDestination = true;

                ++memObj.attempt;

                var ekstraHTML = '<br><br> Forsøg nr ' + memObj.attempt + ' af ' + memObj.attemptMax + ' før du får lidt hjælp.';

                console.log('moveCannonBall - earthRotationSpeed: ' + cObj.earthRotationSpeed);

                if (memObj.attempt < memObj.attemptMax) {

                    if (jsonData.memObj.earthRotationSpeed < 0) {   // If earthRotationSpeed < 0, then "we" are on the northern hemisphere.
                        var HTML = 'På den nordlige halvkugle afbøjes bevægelser over jordoverfladen til højre. Dette sker på grund af corioliseffekten. For at opveje denne effekt skal du altså sigte til venstre for det røde punkt (set i flyveretningen).  <br> <span id="tryAgain" class="btn btn-info">Klik for at prøve igen</span>';
                    } else {                            // If earthRotationSpeed > 0, then "we" are on the southern hemisphere.
                        var HTML = 'På den sydlige halvkugle afbøjes bevægelser over jordoverfladen til venstre. Dette sker på grund af corioliseffekten. For at opveje denne effekt skal du altså sigte til højre for det røde punkt (set i flyveretningen).  <br> <span id="tryAgain" class="btn btn-info">Klik for at prøve igen</span>';
                    }

                } else {

                    if (jsonData.memObj.earthRotationSpeed < 0) {   // If earthRotationSpeed < 0, then "we" are on the northern hemisphere.
                        var HTML = 'På den nordlige halvkugle afbøjes bevægelser over jordoverfladen til højre. Dette sker på grund af corioliseffekten. For at opveje denne effekt skal du altså sigte til venstre for det røde punkt (set i flyveretningen). <br><br> <b>Du kan flyve til destinationen ved at sigte på den grønne prik.</b> <br> <span id="tryAgain" class="btn btn-info">Klik for at prøve igen</span>';
                    } else {                            // If earthRotationSpeed > 0, then "we" are on the southern hemisphere.
                        var HTML = 'På den sydlige halvkugle afbøjes bevægelser over jordoverfladen til venstre. Dette sker på grund af corioliseffekten. For at opveje denne effekt skal du altså sigte til højre for det røde punkt (set i flyveretningen). <br><br> <b>Du kan flyve til destinationen ved at sigte på den grønne prik.</b> <br> <span id="tryAgain" class="btn btn-info">Klik for at prøve igen</span>';
                    }
                }
                UserMsgBox("body", '<h3>Du fløj<span class="label label-danger">forkert!</span></h3><p>' + HTML + '</p>');

                modifyUserMsgBox_removeWhenClicked('#tryAgain', true);
            }
        }
    }
}


function modifyUserMsgBox_removeWhenClicked(selector, removeCloseClass) {
    $('#UserMsgBox').unbind('click');
    $('.MsgBox_bgr').unbind('click');

    if (removeCloseClass) {
        $('.CloseClass').remove();
    } else {
        $(document).on('click', '.CloseClass', function(event) {
            $(".MsgBox_bgr").fadeOut(200, function() {
                $(this).remove();
            });
        });
    }

    $(document).on('click', selector, function(event) {
        $(".MsgBox_bgr").fadeOut(200, function() {
            $(this).remove();
        });
    });
}


function randPlusMinusOne() {
    return ((0.5 - Math.random()) >= 0) ? 1 : -1;
}
console.log('randPlusMinusOne: ' + randPlusMinusOne());


// DETTE VIRKER MEN SKAL IKKE BRUGES:
function onMouseDown(event) {
    var vec = view.center - event.point;
    console.log('onMouseDown - vec: ' + JSON.stringify(vec));
    if (vec.length <= 300 - 5) { // If the point is inside the rotating disk:
        // Create a new circle shaped path at the position
        // of the mouse:
        var path = new Path.Circle(event.point, 5);
        // path.fillColor = 'blue';

        if (typeof(pointCount) === 'undefined') {
            window.pointCount = 0;
        }
        ++pointCount;
        console.log('onMouseDown - pointCount: ' + pointCount + ', x: ' + path.position.x + ', y: ' + path.position.y);

        // Add the path to the group's children list:
        group.addChild(path);

    }
}


// function onMouseDown(event) {
//     // Create a new circle shaped path at the position
//     // of the mouse:
//     var path = new Path.Circle(event.point, 5);
//     path.fillColor = 'blue';

//     if (typeof(pointCount)==='undefined'){
//         window.pointCount = 0;
//     } 
//     ++pointCount;
//     console.log('onMouseDown - pointCount: '+pointCount+', x: '+path.position.x+', y: '+path.position.y);

//     // Add the path to the group's children list:
//     group.addChild(path);
// }


function customHitTest(point1, point2, minDistance) {
    var currentDistance = Math.pow(Math.pow(point2.position.x - point1.position.x, 2) + Math.pow(point2.position.y - point1.position.y, 2), 0.5);

    // console.log('customHitTest - currentDistance: '+ currentDistance + ', minDistance: ' + minDistance);

    if ((currentDistance <= minDistance) ||  (typeof(targetHit) !== 'undefined')) {
        window.targetHit = true;
        return true;
    } else {
        return false;
    }
}


function currentDistance(point1, point2) {
    return Math.pow(Math.pow(point2.position.x - point1.position.x, 2) + Math.pow(point2.position.y - point1.position.y, 2), 0.5);
}


function distance(point1, point2) {
    return Math.pow(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2), 0.5);
}


function onFrame(event) {

    // cObj.earthRotationSpeed = -0.1;
    // cObj.earthRotationSpeed = 0;

    // group.rotate(cObj.earthRotationSpeed, view.center);  // Rotate the group by earthRotationSpeed from the centerpoint of the view each frame:
    group.rotate(memObj.earthRotationSpeed, view.center); // Rotate the group by earthRotationSpeed from the centerpoint of the view each frame:

    // moveCannonBall(1);

    cObj.angleCount = event.count;
    // cObj.worldResetAngle = (cObj.worldAngle > 0)?

    if (typeof(angleCount) === 'undefined') {
        window.angleCount = 0;
    } else {
        ++angleCount;
    }
    // console.log('onFrame - cObj.angleCount: ' + cObj.angleCount);
    cObj.worldAngle = calcWorldAngle(angleCount);

    // console.log('Collision: ' + redDot.hitTest(blackDot, hitOptions));
    // console.log('Collision: ' + customHitTest(blackDot, redDot, 50));

    // NOTE: ratio varies between 0.48 and 1 - ratio = 0.48 is the smallest width before rotateCheck() shows "Vend din skærm": 
    if (customHitTest(blackDot, redDot, 20 * ratio) == false) {
        moveCannonBall(1);
    } else {
        if (typeof(cObj.flyingObjectAtDestination) === 'undefined') {
            if (jsonData.memObj.earthRotationSpeed < 0) {   // If earthRotationSpeed < 0, then "we" are on the northern hemisphere.
                var HTML = 'Korrekt! Du tog højde for corioliseffekten og nåede din destination! <br><br> På den nordlige halvkugle afbøjes bevægelser over jordoverfladen til højre. Dette sker på grund af corioliseffekten. For at opveje denne effekt skulle du altså sigte til venstre for det røde punkt (set i flyveretningen). <br> <img class="img-responsive" src="img/N_slutfeedback.jpg"> <br> I øvelsen er bevægelse over jordoverfladen illustreret med et fly, men corioliseffekten har også betydning for bevægelsen af alt andet, der ikke er direkte bundet til jordoverfladen, f.eks. også luft- og vandmasser. Det betyder bl.a. at vindene bevæger sig mod uret omkring et lavtryk og med uret omkring et højtryk på den nordlige halvkugle. <br> <span id="reload" class="btn btn-info">Klik for at prøve igen</span>';
            } else {                                        // If earthRotationSpeed > 0, then "we" are on the southern hemisphere.
                var HTML = 'Korrekt! Du tog højde for corioliseffekten og nåede din destination! <br><br> På den sydlige halvkugle afbøjes bevægelser over jordoverfladen til venstre. Dette sker på grund af corioliseffekten. For at opveje denne effekt skulle du altså sigte til højre for det røde punkt (set i flyveretningen). <br> <img class="img-responsive" src="img/S_slutfeedback.jpg"> <br> I øvelsen er bevægelse over jordoverfladen illustreret med et fly, men corioliseffekten har også betydning for bevægelsen af alt andet, der ikke er direkte bundet til jordoverfladen, f.eks. også luft- og vandmasser. Det betyder bl.a. at vindene bevæger sig med uret omkring et lavtryk og mod uret omkring et højtryk på den nordlige halvkugle. <br> <span id="reload" class="btn btn-info">Klik for at prøve igen</span>';
            }
            UserMsgBox("body", '<h3>Du fløj<span class="label label-success">rigtigt!</span> </h3><p>' + HTML + '</p>'); // Flyet har nået sin destination.
            cObj.flyingObjectAtDestination = true;

            modifyUserMsgBox_removeWhenClicked('#reload', true);
        }
    }

    // cObj.angel_t = Math.atan(Math.tan(cObj.angleCount*cObj.earthRotationSpeed*Math.PI/180))*180/Math.PI;
    // console.log('onFrame - angel_t: ' + cObj.angel_t);


    // cObj.cannonBallFlightVector = cObj.cannonAnglePath.position - cObj.cannonPath.position;
    // console.log('onFrame - cannonBallFlightVector.angel: ' + cObj.cannonBallFlightVector.angel);

    if (typeof(cObj.currentAngle) === 'undefined') {
        cObj.currentAngle = 0;
    }
    cObj.lastAngle = cObj.currentAngle
    var currentVec = blackDot.position - blueDot.position;
    cObj.currentAngle = currentVec.angle;
    cObj.diffAngle = cObj.currentAngle - cObj.lastAngle;
    // console.log('onFrame - diffAngle: ' + cObj.diffAngle + ', currentAngle: ' + cObj.currentAngle + ', lastAngle: ' + cObj.lastAngle);

}





// function keyUpEvent(){
tool.onKeyUp = function(event) {
        keyDownCount = 0; // Reset count
    }
    // }  // END FUNCTION


// function keyDownEvent(){
tool.onKeyDown = function(event) {

        if (typeof(keyDownCount) === 'undefined') {
            window.keyDownCount = 0;
        } else {
            ++keyDownCount;
        }

        if (event.key == 'left') { // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
            console.log('onKeyDown - LEFT');

            // angleCount = 0;  // Reset the cObj.worldAngle 

            if (typeof(cObj.cannonBallFired) === 'undefined') { // This prevents alteration of the cannonball trajectory when the cannon has been fired!

                angleCount = 0; // Reset the cObj.worldAngle

                if (keyDownCount < 10) { // If the user has been holding the key down for less than 10 "sussesive times", the movement of the aim of the cannon is finetuned and will only move 1 degree 
                    alterCannonAngle(-1);
                } else { // ... else the aim of the cannon is not finetuned, and will move 5 degrees per "sussesive time" the key is hold down
                    alterCannonAngle(-5);
                }
            }

            // Prevent the key event from bubbling
            return false;
        }

        if (event.key == 'right') { // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
            console.log('onKeyDown - RIGHT');

            // angleCount = 0;  // Reset the cObj.worldAngle 

            if (typeof(cObj.cannonBallFired) === 'undefined') { // This prevents alteration of the cannonball trajectory when the cannon has been fired!

                angleCount = 0; // Reset the cObj.worldAngle

                if (keyDownCount < 10) { // If the user has been holding the key down for less than 10 "sussesive times", the movement of the aim of the cannon is finetuned and will only move 1 degree 
                    alterCannonAngle(1);
                } else {
                    alterCannonAngle(5); // ... else the aim of the cannon is not finetuned, and will move 5 degrees per "sussesive time" the key is hold down
                }
            }

            // Prevent the key event from bubbling
            return false;
        }

        if (event.key == 'space') { // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
            console.log('onKeyDown - SPACE');


            if (typeof(cObj.cannonBallFired) === 'undefined') { // This prevents alteration of the cannonball trajectory when the cannon has been fired!

                cObj.cannonBallFired = true;

                cannonBallFlightPath();
            }

            // Prevent the key event from bubbling
            return false;
        }
    }
    // }  // END FUNCTION

// This function prevents initialization of a point (plane and its distanation) in the water.
function findPointOnLand() {

    raster_northpole.on('load', function() {

        var count = 0;
        do {
            var vec = new Point(randPlusMinusOne() * 212 * ratio) * Point.random() + view.center; // "212*ratio" because 212*ratio ~ (((300*ratio)^2)/2)^0.5 
            var color = raster_northpole.getPixel(vec.x, vec.y);
            console.log('findPointOnLand - color: ' + color + ', vec(x,y): vec(' + vec.x + ',' + vec.y + '), vec: ' + JSON.stringify(vec));

            var path = new Path.Circle(vec, 5);
            path.fillColor = 'green';
            group.addChild(path);

            ++count;
        } while (count < 20);

    });
}
// findPointOnLand();




// SEE:
// https://en.wikipedia.org/wiki/Newton%27s_method
function newton(f, df, x0) {
    var tolerance = Math.pow(10, -3); // 7 digit accuracy is desired
    var epsilon = Math.pow(10, -14); // Don't want to divide by a number smaller than this
    console.log('newton - tolerance: ' + tolerance + ', typeof(tolerance): ' + typeof(tolerance));

    var maxIterations = 20; // Don't allow the iterations to continue indefinitely
    var haveWeFoundSolution = false; // Have not converged to a solution yet

    for (var i = 0; i < maxIterations; i++) {

        y = f(x0);
        yprime = df(x0);

        if (Math.abs(yprime) < epsilon) { // Don't want to divide by too small of a number
            break;
        }

        x1 = x0 - y / yprime; // Do Newton's computation

        if (Math.abs(x1 - x0) <= tolerance) { // %f the result is within the desired tolerance
            haveWeFoundSolution = true;
            break; // Done, so leave the loop
        }

        console.log('newton - x0: ' + x0 + ', x1: ' + x1 + ', x1-x0: ' + String(x1 - x0) + ', i: ' + i);

        x0 = x1; // Update x0 to start the process again

    }

    if (haveWeFoundSolution) {
        console.log('newton - SUCCESS - x0: ' + x0 + ', x1: ' + x1 + ', x1-x0: ' + String(x1 - x0) + ', i: ' + i);
    } else {
        console.log('newton - FAILURE - x0: ' + x0 + ', x1: ' + x1 + ', x1-x0: ' + String(x1 - x0) + ', i: ' + i);
    }
    return x1;
}


function f(x) {
    return x * x - 1 };

function df(x) {
    return 2 * x };
newton(f, df, 3);


function calcHintAngle() {
    var r = distance(memObj.redDot, view.center); // The radius of the rotated circle of the destination (redDot). 
    var xa = memObj.blackDot.x; // x-position of the flying object
    var ya = memObj.blackDot.y; // y-position of the flying object
    var w = Math.PI / 180 * memObj.earthRotationSpeed;
    var va = memObj.cannonBallSpeed;
    var xc = view.center.x;
    var yc = view.center.y;
    console.log('calcHintAngle - r: ' + r + ', xa: ' + xa + ', ya: ' + ya + ', w: ' + w + ', va: ' + va + ', xc: ' + xc + ', yc: ' + yc);

    // RedDot angle:
    var redDot = memObj.redDot - view.center;
    var rd = Math.PI / 180 * redDot.angle; // redDot angle in radians
    console.log('calcHintAngle - redDot.angle: ' + redDot.angle + ', rd: ' + rd);


    function f(t) {
        return Math.pow(xa - r * Math.cos(w * t + rd) - xc, 2) + Math.pow(ya - r * Math.sin(w * t + rd) - yc, 2) - va * va * t * t };

    function df(t) {
        return 2 * w * r * ((xa - xc) * Math.sin(w * t + rd) - (ya - yc) * Math.cos(w * t + rd)) - 2 * va * va * t };
    var t = newton(f, df, 100); // The time of intersection between "the expanding circles"
    console.log('calcHintAngle - t: ' + t);

    var vec = new Point(0, r).rotate(redDot.angle - 90 + memObj.earthRotationSpeed * t) + view.center;
    window.pathHelp = new Path.Circle(vec, 5);
    // pathHelp.fillColor = 'green';
    group.addChild(pathHelp);
}


var a = new Point(0, 3);
var b = new Point(4, 0);
console.log('distance 1: ' + distance(a, b));


//##############################################################################################################
//                  INITIALIZATIONS - MAIN FUNCTION
//##############################################################################################################


function main() {

    // raster_flyingObject.applyMatrix = false; // SEE:  https://github.com/paperjs/paper.js/issues/458
    // paper.settings.applyMatrix = false;

    // var cObj = {};
    window.cObj = {};

    cObj.imageName = 'img/plane.png';
    cObj.imgScale = 0.4;
    cObj.imgInitAngel = 90;

    // var blackDot;
    window.blackDot;

    window.blueDot;

    // var group = new Group();
    window.group = new Group();

    // var width = $("#testCanvas").width();
    window.width = $("#testCanvas").width();
    // window.width = $(".container-fluid").width();    // 9/11-2016  <-----  VIGTIGT:  Hvis denne linje (som bruge i window.resize) er aktiv istedet for linjen på forrige linje, så virker "tryAgain" ikke!!!
    // var ratio = 600/1110;
    window.ratio = 600 / 1110;
    $("#testCanvas").height(ratio * width);
    $("#testCanvas").width(width);

    // var height = $("#testCanvas").height();  // Get the new heigt
    window.height = $("#testCanvas").height(); // Get the new heigt
    // var ratio = width/1110;                  // Redefine ratio for both X and Y axis, and therefore also for the scaled radius R, because R = r*ratio = ((x*ratio)^2 + (y*ratio)^2)^0.5 = ratio*((x)^2 + (y)^2)^0.5, where r = ((x)^2 + (y)^2)^0.5
    ratio = width / 1110;

    console.log('height: ' + height + ', width: ' + width + ', ratio: ' + ratio);


    view.viewSize = new Size(width, height); // IMPORTANT: This fixes the ratio-issue between width and height in the imported picture using raster and the green circle. If not used the rotating circel gets stretched going from 0 to 90 degrees (eg. max x to max y) - see: http://stackoverflow.com/questions/19119931/how-to-set-the-view-viewsize-of-canvas-in-paper-js-with-bootstrap
    view.draw();
    console.log('view.center: ' + JSON.stringify(view.center));


    // Draw the the background disk:
    // var myCircle = new Path.Circle(new Point(view.center), 300*ratio);
    window.myCircle = new Path.Circle(new Point(view.center), 300 * ratio);
    // myCircle.fillColor = 'green';    // <---------------------------------  IMPORTANT: The green background circle has 
    group.addChild(myCircle);


    // var raster_northpole = new Raster({
    window.raster_northpole = new Raster({
        // source: 'http://assets.paperjs.org/images/marilyn.jpg',
        // source: 'img/arktisnord.png',
        source: jsonData.hemisphere,
        position: view.center
    });
    raster_northpole.scale(1.385 * ratio); // 1.385 is an empirical number fitting the dimentions of the imported image.
    group.addChild(raster_northpole);


    // findPointOnLand();


    // var raster_flyingObject = new Raster({
    window.raster_flyingObject = new Raster({
        source: 'img/plane.png'
            // position: view.center
    });
    console.log('main - typeof(raster_flyingObject): ' + typeof(raster_flyingObject));


    // window.raster_test = new Raster({
    //     source: 'img/plane.png',
    //     position: view.center
    // }); 
    // raster_test.scale(0.4*ratio);
    // raster_test.rotate(90);
    // group.addChild(raster_test);


    // raster_flyingObject.applyMatrix = false; // SEE:  https://github.com/paperjs/paper.js/issues/458

    // window.raster_flyingObject_copy = JSON.parse(JSON.stringify(raster_flyingObject));
    // window.raster_flyingObject_copy = Object.assign({}, raster_flyingObject);

    raster_flyingObject.scale(0.4 * ratio); // 1.295 is an empirical number fitting the dimentions of the imported image.
    // raster_flyingObject.position = view.center*0.5;  // NOT NEEDED!
    group.addChild(raster_flyingObject);


    // test_setAllLocations();


    console.log("group 1: " + JSON.stringify(group));


    if ((typeof(memObj.blackDot) === 'undefined') ||  (memObj.reset)) {
        // var vec1 = new Point(randPlusMinusOne()*212*ratio)*Point.random() + view.center;  // "212*ratio" because 212*ratio ~ (((300*ratio)^2)/2)^0.5 
        // window.vec1 = new Point(randPlusMinusOne()*212*ratio)*Point.random() + view.center;  // "212*ratio" because 212*ratio ~ (((300*ratio)^2)/2)^0.5 
        var index = returnRandomLocation();
        window.vec1 = new Point(memObj.location[index].point.x, memObj.location[index].point.y) * ratio + view.center;
        var startLocation = memObj.location[index].name;
        memObj.takeoffLocation = memObj.location[index].name
    } else {
        window.vec1 = memObj.blackDot;
    }

    raster_flyingObject.position = vec1;
    // group.addChild(raster_flyingObject);

    // var path1 = new Path.Circle(vec1, 5);
    window.path1 = new Path.Circle(vec1, 5);
    path1.fillColor = 'black';
    group.addChild(path1);
    cObj.cannonPoint = vec1;
    cObj.cannonPath = path1;

    blackDot = cObj.cannonPath;
    cObj.blackDot_vec = vec1;
    memObj.blackDot = vec1;


    // initCannonAngle('random');   // Commented out 29-11-2016. The random generated angle has two drawbacks: (1) There is a discrepancy/error in the first frame when the plane is turned: the dotted black aiming-line and the plane does not follow each other. If the plane is near the egde of the rotating disk AND the black dotted amining-line is near the same egde, then the error of the first frame-of-turning becomes large. (2) If we have the situation described in (1) then the student will not be able to see the black dotted amining-line from the start - which might be confusing.
    initCannonAngle('center');      // Added 29-11-2016.  By always initializing the dotted black aiming-line through the center of the rotating disk, the two drawback above are (partially) resolved. The error mentioned in drawback (1) is only partially resolved since the error is not eliminated, but only made smaller. 


    if ((typeof(memObj.redDot) === 'undefined') ||  (memObj.reset)) {
        // var vec3 = new Point(randPlusMinusOne()*212*ratio)*Point.random() + view.center;
        // window.vec3 = new Point(randPlusMinusOne()*212*ratio)*Point.random() + view.center;
        var index = returnRandomLocation();
        window.vec3 = new Point(memObj.location[index].point.x, memObj.location[index].point.y) * ratio + view.center;
        memObj.landingLocation = memObj.location[index].name;
    } else {
        window.vec3 = memObj.redDot;
    }


    // vec3 = vec3*ratio;
    // var path = new Path.Circle(vec3, 5);
    // window.path = new Path.Circle(vec3, 20);  // <---- the actual size of the hitzone. 
    window.path = new Path.Circle(vec3, 5);
    // path.fillColor = 'red';  
    path.fillColor = '#e26060';
    group.addChild(path);

    // var redDot = path;
    window.redDot = path;
    cObj.redDot_vec = vec3;
    memObj.redDot = vec3;

    // Set canvasOverlay to fit canvas:
    JQ('#canvasOverlay').height(height);
    JQ('#canvasOverlay').width(width);


    console.log('distance 2: ' + distance(memObj.blackDot, memObj.redDot));
    console.log('distance 3: ' + distance(memObj.redDot, view.center));


    calcHintAngle();
    if (memObj.attempt >= memObj.attemptMax) { // This sets the green color of the help-dot made in calcHintAngle() above.
        // pathHelp.fillColor = 'green';
        pathHelp.fillColor = '#64e2dc';
    }

    // keyUpEvent();
    // keyDownEvent();

    // raster_flyingObject.applyMatrix = false; // SEE:  https://github.com/paperjs/paper.js/issues/458
    // paper.settings.applyMatrix = false;
}


main();




//######################################
//                 TEST
//######################################


// console.log("group 2: " + JSON.stringify(group));
// console.log(project);

// console.log('project.activeLayer: ' + JSON.stringify(project.activeLayer));

// console.log("returnRasterIndex: " + returnRasterIndex('plane'));
