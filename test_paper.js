
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


var JQ = jQuery;

JQ(document).ready(function() {
    getAjaxData("GET", "json/quizData.json", false, "json"); 
    // getAjaxData("GET", "json/carouselDataTest_4_small.json", false, "json");
    console.log("jsonData: " + JSON.stringify(jsonData));

    JQ('#header').prepend(jsonData.header);
    JQ('#instruction').prepend(instruction(jsonData.instruction));  
    JQ('#explanation').prepend(explanation(jsonData.explanation));

    // debugger;  // <------ Debugging in paper.js: http://stackoverflow.com/questions/24272396/console-access-of-paper-js-objects

    rotateCheck();  // "Rotate you screen" message!
});


var cObj = {};

cObj.imageName = 'img/plane.png';
cObj.imgScale = 0.4;
cObj.imgInitAngel = 90;


var blackDot;


var group = new Group();


var width = $("#testCanvas").width();
var ratio = 600/1110;
$("#testCanvas").height(ratio*width);
$("#testCanvas").width(width);

var height = $("#testCanvas").height();  // Get the new heigt
var ratio = width/1110;                  // Redefine ratio for both X and Y axis, and therefore also for the scaled radius R, because R = r*ratio = ((x*ratio)^2 + (y*ratio)^2)^0.5 = ratio*((x)^2 + (y)^2)^0.5, where r = ((x)^2 + (y)^2)^0.5

console.log('height: ' + height + ', width: ' + width + ', ratio: ' + ratio);


view.viewSize = new Size(width, height);  // IMPORTANT: This fixes the ratio-issue between width and height in the imported picture using raster and the green circle. If not used the rotating circel gets stretched going from 0 to 90 degrees (eg. max x to max y) - see: http://stackoverflow.com/questions/19119931/how-to-set-the-view-viewsize-of-canvas-in-paper-js-with-bootstrap
view.draw();
console.log('view.center: ' + JSON.stringify(view.center));


// Draw the the background disk:
var myCircle = new Path.Circle(new Point(view.center), 300*ratio);
// myCircle.fillColor = 'green';    // <---------------------------------  IMPORTANT: The green background circle has 
group.addChild(myCircle);


// var raster_yinyang = new Raster({
//     // source: 'http://assets.paperjs.org/images/marilyn.jpg',
//     source: 'img/yin_yang.svg',
//     position: view.center
// }); 
// raster_yinyang.scale(1.295*ratio);  // 1.295 is an empirical number fitting the dimentions of the imported image.
// group.addChild(raster_yinyang);


var raster_northpole = new Raster({
    // source: 'http://assets.paperjs.org/images/marilyn.jpg',
    source: 'img/arktisnord.png',
    position: view.center
}); 
raster_northpole.scale(1.385*ratio);  // 1.295 is an empirical number fitting the dimentions of the imported image.
group.addChild(raster_northpole);


var raster_flyingObject = new Raster({
    source: 'img/plane.png'
    // position: view.center
}); 
raster_flyingObject.scale(0.4*ratio);  // 1.295 is an empirical number fitting the dimentions of the imported image.
// raster_flyingObject.position = view.center*0.5;  // NOT NEEDED!
group.addChild(raster_flyingObject);


// raster_flyingObject.applyMatrix = false; // SEE:  https://github.com/paperjs/paper.js/issues/458


// var raster_bird = new Raster({
//     source: 'img/bird.png',
//     position: view.center
// }); 
// raster_bird.scale(1.295*ratio);  // 1.295 is an empirical number fitting the dimentions of the imported image.
// group.addChild(raster_bird);


// group.importSVG("img/yin_yang.svg");  // VIRKER OK !!!
// var TmyCircle = new Path.importSVG("img/yin_yang.svg");  // VIRKER IKKE
console.log("group 1: " + JSON.stringify(group));

var vec1 = new Point(randPlusMinusOne()*212*ratio)*Point.random() + view.center;  // "212*ratio" because 212*ratio ~ (((300*ratio)^2)/2)^0.5 

raster_flyingObject.position = vec1;
// group.addChild(raster_flyingObject);

var path1 = new Path.Circle(vec1, 5);
path1.fillColor = 'black';
group.addChild(path1);
cObj.cannonPoint = vec1;
cObj.cannonPath = path1;

blackDot = cObj.cannonPath;


// This function prevents initialization of a point (plane and its distanation) in the water.
function findPointOnLand(){

}


function initCannonAngle(angle){
    if (angle == 'center'){  // center of the circle 
        var angleVec = view.center - cObj.cannonPoint;
        var vec2 = new Point(212*ratio).rotate(angleVec.angle-45) + view.center;   // -45 degrees because Point(212*ratio) equals the vector (212*ratio, 212*ratio) which is at a 45 degree angle relative to (0,0) eg. the upper-left-corner.
        console.log('onMouseDown - vec - center: '+JSON.stringify(vec2));
    }
    if (angle == 'random'){
        var vec2 = new Point(212*ratio).rotate(Math.round(360*Math.random())) + view.center;
        console.log('onMouseDown - vec - random: '+JSON.stringify(vec2));
    }
    // vec2 = vec2*ratio;
    var path = new Path.Circle(vec2, 5);
    path.fillColor = 'blue';
    group.addChild(path);
    cObj.cannonAngle = vec2;
    cObj.cannonAnglePath = path;

    // path = Path.Line(cObj.cannonPoint, cObj.cannonAngle);                    // <-------  OK!!!, but this expression does not keep track of the rotation.
    path = Path.Line(cObj.cannonPath.position, cObj.cannonAnglePath.position);  // <-------  OK!!! - this keeps track of the rotation. Always use this expression!
    path.strokeColor = 'black';
    path.dashArray = [10, 12];  // Makes the line dashed...
    group.addChild(path);
    cObj.cannonLinePath = path;

    cObj.cannonBallFlightVector = cObj.cannonAnglePath.position - cObj.cannonPath.position;
    raster_flyingObject.rotate(cObj.cannonBallFlightVector.angle + 90);
    console.log('initCannonAngle - cObj.cannonBallFlightVector.angle: ' + cObj.cannonBallFlightVector.angle);

    console.log('initCannonAngle - cObj.cannonLinePath: ' + JSON.stringify(cObj));

}

initCannonAngle('random');
// initCannonAngle('center');


function calcFlyingObjectAngleStep(angle){
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


function calcWorldAngle(){
    var sign = (cObj.earthRotationSpeed>0)?1:-1;
    var d = cObj.angleCount*cObj.earthRotationSpeed/360;
    var k = d - Math.floor(d);
    var angle = k*sign*360;

    console.log('calcWorldAngle - angle: ' + angle);

    return angle;
}


function returnRasterIndex(imgName){
    var child = paper.project._children[0]._children[0]._children;
    console.log('returnRasterIndex - child: ' + JSON.stringify(child));
    for (var n in child){
        console.log('returnRasterIndex - child['+n+']: ' + JSON.stringify(child[n]));
        var arr = JSON.parse(JSON.stringify(child[n]));
        if (arr[0] == 'Raster'){
            console.log('returnRasterIndex - arr[1].source: ' + arr[1].source);
            if (arr[1].source.indexOf(imgName)!==-1){
                console.log('returnRasterIndex - n: ' + n);
                return n;
            }
        }
    }
}


// IMPORTANT: 
// item.rotate(V) takes an angle-increment (delta) as argument "V", and not the absolute angle relative to the x-axis. 
// This means that you either have to find the angle-increment each time you press the "right" or "left" keys (this 
// has proofed to be difficult to do) OR you need to reinitialize the raster image with the new absolute angle 
// relative to the x-axis. The last stategy is used here.
//
// This technique does NOT work either (for absolute angle relative to the x-axis):
//      // raster_flyingObject.applyMatrix = false; // SEE:  https://github.com/paperjs/paper.js/issues/458
function creatNewFlyingObject(position){
    raster_flyingObject.remove();
    raster_flyingObject = new Raster({
        source: cObj.imageName,
        position: position
    }); 
    raster_flyingObject.scale(cObj.imgScale*ratio);

    // raster_flyingObject.applyMatrix = false; // Does not work - SEE:  https://github.com/paperjs/paper.js/issues/458

    // group.addChild(raster_flyingObject);  // This does NOT add the plane below the black dot.
    raster_flyingObject.insertBelow(path1);  // This add the plane below the black dot.

    cObj.cannonBallFlightVector_2 = cObj.cannonAnglePath.position - cObj.cannonPath.position;
    if (typeof(cannonBallFired)==='undefined'){  
        raster_flyingObject.rotate(cObj.cannonBallFlightVector_2.angle + cObj.imgInitAngel);
    } else {
        if (typeof(cObj.constantFlightAngle)==='undefined') {  // Define constantFlightAngle ONLY once...
            cObj.constantFlightAngle = cObj.cannonBallFlightVector_2.angle;
        }
        console.log('creatNewFlyingObject - cObj.constantFlightAngle: ' + cObj.constantFlightAngle);
        raster_flyingObject.rotate(cObj.constantFlightAngle + cObj.imgInitAngel);
    }
}


function alterCannonAngle(angle){
    
    // var angleVec = cObj.cannonAnglePath.position - cObj.cannonPath.position;  // This is wrong, since angleVec.angle gives the (correct) angel of angleVec, but Point(212) at MARK (#1#) below is relative to the center of the green spinning circle/the world.
    var angleVec = cObj.cannonAnglePath.position - view.center;                  // This is correct: we find the angle relative to the center of the green spinning circle/the world, and in MARK (#1#) below calculates the new vector relative to the center the world.
    console.log('alterCannonAngle - angleVec.angle: ' + angleVec.angle);
    cObj.angle = angleVec.angle + angle;
    
    console.log('alterCannonAngle - cObj.angle: ' + cObj.angle + ', angle: ' + angle);

    var vec2 = new Point(212*ratio).rotate(cObj.angle-45) + view.center;  // MARK (#1#) 
    // vec2 = vec2*ratio;
    var path2 = new Path.Circle(vec2, 5);
    cObj.cannonAnglePath.remove();
    path2.fillColor = 'blue';
    group.addChild(path2);

    cObj.cannonAngle = vec2;
    cObj.cannonAnglePath = path2;
    cObj.cannonLinePath.remove();
    var path = Path.Line(cObj.cannonPath.position, cObj.cannonAnglePath.position);  
    path.strokeColor = 'black';
    path.dashArray = [10, 12];  // Makes the line dashed...
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


function cannonBallFlightPath(){
    // var angleVec = cObj.cannonAnglePath.position - cObj.cannonPath.position;  // This is wrong, since angleVec.angle gives the (correct) angel of angleVec, but Point(212) at MARK (#1#) below is relative to the center of the green spinning circle/the world.
    var angleVec = cObj.cannonAnglePath.position - view.center;                  // This is correct: we find the angle relative to the center of the green spinning circle/the world, and in MARK (#1#) below calculates the new vector relative to the center the world.
    console.log('fireCannon - angleVec.angle: ' + angleVec.angle);
    cObj.angle = angleVec.angle;

    console.log('fireCannon - cObj.angle: ' + cObj.angle);

    var vec2 = new Point(212*ratio).rotate(cObj.angle-45) + view.center;  // MARK (#1#) 
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
    path.dashArray = [10, 12];  // Makes the line dashed...
    // group.addChild(path);
    cObj.cannonLinePath = path;
}


function moveCannonBall(speed){
    if ((typeof(cannonBallFired)!=='undefined') && (cannonBallFired)){
        console.log('moveCannonBall - CALLED ');
        cObj.speed = (typeof(cObj.speed)==='undefined')? speed : cObj.speed + speed;
        var directionVec = cObj.cannonBallFlightVector*cObj.speed;
        var vec = directionVec + cObj.cannonBallFlightVectorStart;
        console.log('moveCannonBall - vec: ' + JSON.stringify(vec));
        if (typeof(cObj.cannonBallFlightPath)!=='undefined'){
            cObj.cannonBallFlightPath.remove();
        }
        var path = new Path.Circle(vec, 5);  // The moving cannonball
        path.strokeColor = 'black';
        cObj.cannonBallFlightPath = path;
        blackDot = path;

        var drawPath = new Path.Circle(vec, 0.5);  // The traced out path of the cannonball 
        drawPath.strokeColor = 'black';
        group.addChild(drawPath);

        // raster_flyingObject.position = vec;
        creatNewFlyingObject(vec);
        
        if (directionVec.length >= cObj.cannonBallFlightLength){  // Condition to stop the cannonball from moving out of "the world"
            cannonBallFired = false;
        }
    }
}


function randPlusMinusOne(){
    return ((0.5-Math.random())>=0)?1:-1;
}
console.log('randPlusMinusOne: '+randPlusMinusOne());


var vec3 = new Point(randPlusMinusOne()*212*ratio)*Point.random() + view.center;
// vec3 = vec3*ratio;
var path = new Path.Circle(vec3, 5);
path.fillColor = 'red';
group.addChild(path);

var redDot = path;



// DETTE VIRKER MEN SKAL IKKE BRUGES:
// function onMouseDown(event) {
//     var vec = view.center - event.point;
//     console.log('onMouseDown - vec: '+JSON.stringify(vec));
//     if (vec.length <= 300-5){ // If the point is inside the rotating disk:
//         // Create a new circle shaped path at the position
//         // of the mouse:
//         var path = new Path.Circle(event.point, 5);
//         path.fillColor = 'black';

//         // Add the path to the group's children list:
//         group.addChild(path);

//     }
// }


function customHitTest(point1, point2, minDistance){
    var currentDistance = Math.pow( Math.pow(point2.position.x - point1.position.x, 2) + Math.pow(point2.position.y - point1.position.y, 2), 0.5);

    // console.log('customHitTest - currentDistance: '+ currentDistance + ', minDistance: ' + minDistance);

    if ((currentDistance <= minDistance) || (typeof(targetHit)!=='undefined')){
        window.targetHit = true;
        return true;
    } else {
        return false;
    }
}


function onFrame(event) {

    cObj.earthRotationSpeed = -0.1;
    // cObj.earthRotationSpeed = -0.5;
    
    group.rotate(cObj.earthRotationSpeed, view.center);  // Rotate the group by earthRotationSpeed from the centerpoint of the view each frame:

    // moveCannonBall(1);

    cObj.angleCount = event.count; 

    // console.log('Collision: ' + redDot.hitTest(blackDot, hitOptions));
    // console.log('Collision: ' + customHitTest(blackDot, redDot, 50));

    // NOTE: ratio varies between 0.48 and 1 - ratio = 0.48 is the smallest width before rotateCheck() shows "Vend din skærm": 
    if (customHitTest(blackDot, redDot, 10*ratio) == false){
        moveCannonBall(1);
    }

    // cObj.angel_t = Math.atan(Math.tan(cObj.angleCount*cObj.earthRotationSpeed*Math.PI/180))*180/Math.PI;
    // console.log('onFrame - angel_t: ' + cObj.angel_t);


    // cObj.cannonBallFlightVector = cObj.cannonAnglePath.position - cObj.cannonPath.position;
    // console.log('onFrame - cannonBallFlightVector.angel: ' + cObj.cannonBallFlightVector.angel);

}

tool.onKeyUp = function(event) {
    keyDownCount = 0;  // Reset count
}

tool.onKeyDown = function(event) {

    if (typeof(keyDownCount)==='undefined'){
        window.keyDownCount = 0;
    } else {
        ++keyDownCount;
    }

    if (event.key == 'left') {  // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
        console.log('onKeyDown - LEFT');

        if (typeof(cannonBallFired)==='undefined'){  // This prevents alteration of the cannonball trajectory when the cannon has been fired!

            if (keyDownCount < 10){   // If the user has been holding the key down for less than 10 "sussesive times", the movement of the aim of the cannon is finetuned and will only move 1 degree 
                alterCannonAngle(1);  
            } else {                  // ... else the aim of the cannon is not finetuned, and will move 5 degrees per "sussesive time" the key is hold down
                alterCannonAngle(5);
            }
        }

        // Prevent the key event from bubbling
        return false;
    }

    if (event.key == 'right') {  // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
        console.log('onKeyDown - RIGHT');

        if (typeof(cannonBallFired)==='undefined'){  // This prevents alteration of the cannonball trajectory when the cannon has been fired!
            
            if (keyDownCount < 10){    // If the user has been holding the key down for less than 10 "sussesive times", the movement of the aim of the cannon is finetuned and will only move 1 degree 
                alterCannonAngle(-1);
            } else {
                alterCannonAngle(-5);  // ... else the aim of the cannon is not finetuned, and will move 5 degrees per "sussesive time" the key is hold down
            }
        }

        // Prevent the key event from bubbling
        return false;
    }

    if (event.key == 'space') {  // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
        console.log('onKeyDown - SPACE');

            
        if (typeof(cannonBallFired)==='undefined'){  // This prevents alteration of the cannonball trajectory when the cannon has been fired!

            window.cannonBallFired = true;

            cannonBallFlightPath();
        }

        // Prevent the key event from bubbling
        return false;
    }
}


//######################################
//                 TEST
//######################################


console.log("group 2: " + JSON.stringify(group));
console.log(project);

console.log('project.activeLayer: ' + JSON.stringify(project.activeLayer));

console.log("returnRasterIndex: " + returnRasterIndex('plane'));


calcWorldAngle(-45);
calcWorldAngle(-90);
calcWorldAngle(-135);
calcWorldAngle(-180);
calcWorldAngle(-225);
calcWorldAngle(-270);
calcWorldAngle(-315);
calcWorldAngle(-360);
calcWorldAngle(-360*1.5);