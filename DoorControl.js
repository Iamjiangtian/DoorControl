#pragma strict

public var firstTime : boolean = true;
var guiShow : boolean = false;
var open : boolean = false;
var close : boolean = false;
var soundOpen : GameObject;
var soundClose : GameObject;
var degConstant = 270; //degree angle constant to adjust the relative positon of the door
var halfWidth : float = 0.433; //actual width of the door

/*Calculate the Real-time hinge position of each door*/
private function hinge () {
	var doorCenter : Vector3 = transform.position ;
	var degreeAngle : float = transform.eulerAngles.y-degConstant; //Real-time door angle to the center
	var radianAngle : float = degreeAngle * Mathf.Deg2Rad;
	var c : float = halfWidth; //the half size of the door's width 
	var zMove :float = Mathf.Cos(radianAngle)*c; // the z offset
	var xMove : float = -(Mathf.Sin(radianAngle)*c); // the x offset
	var hingePosition : Vector3 = doorCenter; // the default center of the door
	
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


	
/*check whether the door can be opened or closed or neither*/
function Check()
{
	var hit : RaycastHit;
	var ray : Ray = Camera.main.ScreenPointToRay(Vector3(Screen.width*0.5, Screen.height*0.5, 0));
	var degree : float = transform.eulerAngles.y - degConstant; //used to change all doors' states globally

	if((degree <= 0 && degree > -1) || (degree > -181 && degree <= -180)) //reaching the fully closed position
	{
		//change states; stop the moving door
		transform.gameObject.tag = "Door"; 
		transform.GetComponent.<CloseDoor>().close = false;
	}
	else if((degree < 81 && degree >= 80) || (degree <= -100 && degree > -101)) //reaching the fully opened position
	{
		//change states; stop the moving door
		transform.gameObject.tag = "Door"; 
		transform.GetComponent.<CloseDoor>().open = false;
	}
	else //Moving door or starting door
	{
		if(firstTime == true) //starting door
		{
			transform.gameObject.tag = "Door";
		}
		else{ transform.gameObject.tag = "Moving";} //moving door
	}
	if(Physics.Raycast (ray, hit, 1)) //scan the object in front of the character in certain range by using raycast
	{
		if(hit.collider.gameObject.tag == "Door") //if the object is a stopped door
		{
			if(hit.collider.gameObject.tag !="Moving") {guiShow = true;} //if the door is not moving, show GUI
			
			degree = hit.transform.eulerAngles.y - degConstant; //the angle of the door which is being scanned

				if((degree <= 0 && degree >- 1) || (degree > -181 && degree <= -180)) //closed door
				{
					if(Input.GetKeyDown("e"))
					{
					//open the door
						hit.collider.gameObject.tag = "Moving";
						hit.transform.GetComponent.<CloseDoor>().open = true;
						hit.transform.GetComponent.<CloseDoor>().firstTime = false;
						soundOpen.GetComponent.<AudioSource>().Play();
					}
				}
				else if((degree < 81 && degree >= 80) || (degree <= -100 && degree > -101)) //opened door
				{
					if(Input.GetKeyDown("e"))
					{
						//close the door
						hit.collider.gameObject.tag = "Moving";
						hit.transform.GetComponent.<CloseDoor>().close = true;
						hit.transform.GetComponent.<CloseDoor>().firstTime = false;
						soundClose.GetComponent.<AudioSource>().Play();
					}
				}
				else //half opened door
				{
					if(Input.GetKeyDown("e"))
					{
						//close the half opened door
						hit.collider.gameObject.tag = "Moving";
						hit.transform.GetComponent.<CloseDoor>().close = true;
						hit.transform.GetComponent.<CloseDoor>().firstTime = false;
						soundClose.GetComponent.<AudioSource>().Play();
					}
				}
		}
		else {guiShow = false;} //if the object is not a stopped door, erase the GUI
	}  
	else {guiShow = false;} //make sure that the GUI is disappeared when out of range
}
	
function OnGUI()
{
	if(guiShow == true)
	{
		GUI.Box(Rect(Screen.width / 2, Screen.height / 2, 100, 25), "Use Door");
	}
} 


