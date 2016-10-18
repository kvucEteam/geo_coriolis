

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
});

// var cObj = {vecObj:{}, pathObj:{}};
var cObj = {};

var group = new Group();


// #########################################   TEST   #########################################
console.log('importSVG - project 1: '+ JSON.stringify(project));
// var a = project.importSVG("img/yin_yang.svg");  // SEE: https://gist.github.com/netpoetica/4481374
// // var a = project.activeLayer.importSVG("img/yin_yang.svg");  
// console.log("a 1: " + a);
// var a = group.importSVG("img/yin_yang.svg");  // VIRKER OK !!!
// console.log("a 2: " + a);
// var a = new Raster("img/yin_yang.svg");  // VIRKER OK, men det behandles som .jpg, .png mm
// console.log("a 3: " + a);
var a = new Symbol(project.importSVG("img/yin_yang.svg")); 
console.log("a 4: " + a);
console.log('importSVG - project 2: '+ JSON.stringify(project)); 

// var p = a.place();
// p.position = new Point(40, 100);
// p.scale(0.25 + Math.random() * 0.75);

// console.log('importSVG - project.activeLayer.: '+JSON.stringify(project.activeLayer.firstChild));


//project.activeLayer.remove();
// var a = project.importSVG(document.getElementById('imgTest'));  // SEE: http://appsynergy.net/article/interactive-maps-with-paper-js
// var a = new Symbol(paper.project.importSVG(document.getElementById('imgTest')));  // GIVER IKKE "eksisterer ikke" FEJL - SE: https://gist.github.com/netpoetica/4481375
// var p = a.place();
// a.position = new Point(40, 100);
// a.scale(0.95 + Math.random() * 0.75);
// ############################################################################################


// Draw the the background disk:
var myCircle = new Path.Circle(new Point(view.center), 300);
myCircle.fillColor = 'green';
group.addChild(myCircle);

group.importSVG("img/yin_yang.svg");  // VIRKER OK !!!
// var TmyCircle = new Path.importSVG("img/yin_yang.svg");  // VIRKER IKKE
console.log("group 1: " + JSON.stringify(group));

var vec1 = new Point(randPlusMinusOne()*212)*Point.random() + view.center;  // 212 because 212 ~ ((300^2)/2)^0.5 
var path1 = new Path.Circle(vec1, 5);
path1.fillColor = 'black';
group.addChild(path1);
cObj.cannonPoint = vec1;
cObj.cannonPath = path1;


function initCannonAngle(angle){
    if (angle == 'center'){  // center of the circle 
        var angleVec = view.center - cObj.cannonPoint;
        var vec2 = new Point(212).rotate(angleVec.angle-45) + view.center;   // -45 degrees because Point(212) equals the vector (212, 212) which is at a -45 degree angle relative to (0,0) eg. the upper-left-corner.
        console.log('onMouseDown - vec - center: '+JSON.stringify(vec2));
    }
    if (angle == 'random'){
        var vec2 = new Point(212).rotate(Math.round(360*Math.random())) + view.center;
        console.log('onMouseDown - vec - random: '+JSON.stringify(vec2));
    }
    
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
    console.log('cannonAngle - cObj.cannonLinePath: ' + JSON.stringify(cObj));

}

initCannonAngle('random');
// initCannonAngle('center');


function alterCannonAngle(angle){
    
    // var angleVec = cObj.cannonAnglePath.position - cObj.cannonPath.position;  // This is wrong, since angleVec.angle gives the (correct) angel of angleVec, but Point(212) at MARK (#1#) below is relative to the center of the green spinning circle/the world.
    var angleVec = cObj.cannonAnglePath.position - view.center;                  // This is correct: we find the angle relative to the center of the green spinning circle/the world, and in MARK (#1#) below calculates the new vector relative to the center the world.
    console.log('alterCannonAngle - angleVec.angle: ' + angleVec.angle);
    cObj.angle = angleVec.angle + angle;
    
    console.log('alterCannonAngle - cObj.angle: ' + cObj.angle + ', angle: ' + angle);

    var vec2 = new Point(212).rotate(cObj.angle-45) + view.center;  // MARK (#1#) 
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

}


function cannonBallFlightPath(){
    // var angleVec = cObj.cannonAnglePath.position - cObj.cannonPath.position;  // This is wrong, since angleVec.angle gives the (correct) angel of angleVec, but Point(212) at MARK (#1#) below is relative to the center of the green spinning circle/the world.
    var angleVec = cObj.cannonAnglePath.position - view.center;                  // This is correct: we find the angle relative to the center of the green spinning circle/the world, and in MARK (#1#) below calculates the new vector relative to the center the world.
    console.log('fireCannon - angleVec.angle: ' + angleVec.angle);
    cObj.angle = angleVec.angle;

    console.log('fireCannon - cObj.angle: ' + cObj.angle);

    var vec2 = new Point(212).rotate(cObj.angle-45) + view.center;  // MARK (#1#) 
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

        var drawPath = new Path.Circle(vec, 0.5);  // The traced out path of the cannonball 
        drawPath.strokeColor = 'black';
        group.addChild(drawPath);

        
        if (directionVec.length >= cObj.cannonBallFlightLength){  // Condition to stop the cannonball from moving out of "the world"
            cannonBallFired = false;
        }
    }
}


function randPlusMinusOne(){
    return ((0.5-Math.random())>=0)?1:-1;
}
console.log('randPlusMinusOne: '+randPlusMinusOne());


var vec3 = new Point(randPlusMinusOne()*212)*Point.random() + view.center;
var path = new Path.Circle(vec3, 5);
path.fillColor = 'red';
group.addChild(path);


function onMouseDown(event) {
    var vec = view.center - event.point;
    console.log('onMouseDown - vec: '+JSON.stringify(vec));
    if (vec.length <= 300-5){ // If the point is inside the rotating disk:
        // Create a new circle shaped path at the position
        // of the mouse:
        var path = new Path.Circle(event.point, 5);
        path.fillColor = 'black';

        // Add the path to the group's children list:
        group.addChild(path);

    }
}

function onFrame(event) {
    // Rotate the group by 1 degree from
    // the centerpoint of the view:
    group.rotate(-0.1, view.center);
    
    moveCannonBall(1);
}

tool.onKeyDown = function(event) {
    if (event.key == 'left') {  // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
        console.log('onKeyDown - LEFT');

        alterCannonAngle(1);

        // Prevent the key event from bubbling
        return false;
    }

    if (event.key == 'right') {  // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
        console.log('onKeyDown - RIGHT');

        alterCannonAngle(-1);

        // Prevent the key event from bubbling
        return false;
    }

    if (event.key == 'space') {  // 'enter', 'space', 'shift', 'control', 'alt', 'meta', 'caps-lock', 'left', 'up', 'right', 'down', 'escape', 'delete',.... - see: http://paperjs.org/reference/keyevent/#key
        console.log('onKeyDown - SPACE');

        window.cannonBallFired = true;

        cannonBallFlightPath();

        // Prevent the key event from bubbling
        return false;
    }
}


console.log("group 2: " + JSON.stringify(group));


function T(maxVd){

    // Nedenstående formel:
    // http://www.math.vanderbilt.edu/~schectex/courses/cubic/

    // Konstanter:
    // http://hyperphysics.phy-astr.gsu.edu/hbase/kinetic/relhum.html

    var a = 5.018;
    var b = 0.32321
    var c = 8.1847*0.001;              // 
    var d = 3.1243*0.0001 - maxVd;

    var p = -b/(3*a);
    var q = Math.pow(p,3) + (b*c-3*a*d)/(6*a*a);
    var r = c/(3*a);

    var A = Math.pow(q + Math.pow(q*q + Math.pow((r-p*p),3),0.5),1/3);      // (q + Math.pow(q*q + Math.pow((r-p*p),3),0.5))^(1/3)
    var B = Math.pow(q - Math.pow(q*q + Math.pow((r-p*p),3),0.5),1/3) + p;
    var T = A + B;


    console.log('temperature - a='+a+', b='+b+', c='+c+', d='+d+', p='+p+', q='+q+', r='+r+', A='+A+', B='+B+', T='+T );

    // var T = Math.pow(q + Math.pow(q*q + Math.pow((r-p*p),3),0.5),1/3)  +  Math.pow(q - Math.pow(q*q + Math.pow((r-p*p),3),0.5),1/3) +  p;

    Math.pow(8,2);  // 64

    return T;
}

console.log('temperature - T: ' + T(10));

