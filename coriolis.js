// The minimum distance the mouse has to drag
// before firing the next onMouseDrag event:
tool.minDistance = 10;

var myCircle = new Path.Circle(new Point(600, 300), 300);
myCircle.fillColor = 'green';

var path;

var path_group = new Group();

function onMouseDown(event) {
    // Create a new path and select it:
    path_group.remove();
    path_group = new Group();
    path = new Path();
    path.strokeColor = '#00000';
    path.strokeWidth = 3;

    // Add a segment to the path where
    // you clicked:
    path.add(event.point);
    console.log("start..");
}

function onMouseDrag(event) {
    // Every drag event, add a segment
    // to the path at the position of the mouse:
    path.add(event.point);
    //path.simplify();
    console.log("drag..");

    path_group.addChild(path);


}

function onMouseUp(event) {

}
function onFrame(event) {
    //console.log("hej");
    // Each frame, rotate the path by 3 degrees:

    //console.log("RGL: " + rainfall_path.length);

    path_group.rotate(.3);



}

function onResize(event) {
    console.log("resize?");


}



