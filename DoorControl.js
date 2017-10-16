#pragma strict

var open : boolean = false;
var close : boolean = false;

var degConstant = 270;
var halfWidth : float = 0.433; //actual width of the door

/*Calculate the Real-time hinge position of each door*/
private function hinge () {
	var doorCenter : Vector3 = transform.position ;
	var degreeAngle : float = transform.eulerAngles.y-degConstant;
	var radianAngle : float = degreeAngle * Mathf.Deg2Rad;
	var c : float = halfWidth;
	var zMove :float = Mathf.Cos(radianAngle)*c;
	var xMove : float = -(Mathf.Sin(radianAngle)*c);
	var hingePosition : Vector3 = doorCenter;
	
    hingePosition.z = doorCenter.z - zMove;
	hingePosition.x = doorCenter.x + xMove;
	
	return hingePosition;
}

/*open and close the door*/
function Update () { 
	var rotate : float = Time.deltaTime * 30; //door rotation speed
	var hingePosition : Vector3 = hinge(); //the abstract hinge of the door
	
	Check(); //check whether the door can be opened or closed	
			
	if(open){transform.RotateAround(hingePosition, Vector3.up, rotate);} //if the door is open, close
	if(close) {transform.RotateAround(hingePosition, Vector3.up, -rotate);} //if the door is closed, open
}

//check whether the door is currently open or closed
function Check() {
	......
}