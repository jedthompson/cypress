var simulation_name = "Thin Lens";

var simulation = new Simulation(simulation_name);
simulation.dt = 200;
desString = "Lenses using the thin lens equation.   In the settings menu, you can ";
desString += "toggle betweeen positive and negative lenses.   The principle rays will be draw.";
desString += "  Blue will be rays for real images, ray traced through the lens.  Red will be for the";
desString += " case where the image is virtual, and thus behind the lens.";
simulation.description = desString;
var debug = true;
var temp = null;
var arrowLength = 1;
DBG.enabled = false;

//color = new Array("blue","green","red","yellow");

simulation.init_state = function(state) {
	state.cur = false;
	return state;
}
//
// Set up the widgets.  Here we make a slider to vary the index of refraction in the 2nd region
//

function bfunction1(d, state) {
	if (!d)	{
		state.objects[0].data[2] = -state.objects[0].data[2];
	}
	return state;
}

function bfunction2(d, state) {
	if (!d)	{
		state.objects[1].data[2] = -state.objects[1].data[2];
	}
	return state;
}

simulation.setup = function(state) {
	//
	// create a set of objects.  the first one will always be the "object" object, that is it
	// will be the thing that will have it's ray traced through the lenses.   it will have index
	// 0 (index of the array, not the "index of refraction).  all other objects are lenses, and 
	// the first one will have index 1, etc.    but since the graphics will allow you to move
	// the lenses and the object around, we have to sort them below.  but I'm pretty sure we will
	// not let the object be to the right of any lens, so the object should always be the 0th 
	// index of the array.
	// 
	// note also that y=0 for the vertical coordinate of everything.  no off axis lenses, thank
	// you.   and also note that the last variable will be 0 for the object, +1 for positive lenses
	// and -1 for negative lenses
	//
	state.isel = -1;
	state.objects = {};
	state.nlens = 2;
	//
	// each object (lens) is described by a vector: (x,focalpt,posORneg)
	// x = position along the horizontal
	// focalpt is the focal point of the lens.  
	// posORneg tells which kind of lens
	//
	// all lenses will have thickness of 5 (or specified below) and a height of 40 (also specified
	// below).  note that height is the full height of the lens (from top to bottom) and focalpt is 
	// along the x axis relative to the center of the lens.   Note that the height, radius of 
	// curvature, and index of refraction all go into the focal point.   but we'll just lump all of
	// that into the focal point and let you change it at will.
	//
	// here is the object
	//
	state.objectX = -90;
	state.objectH = 5;
	//
	// here are the lenses.  note:  all objects are lenses and vice versa (in a previous version
	// of this code, the "object" was an object but that is no longer)
	//
	state.lensHeight = 70;   // full height, top to bottom
	state.lensThick = 10
	state.objects[0] = new Vector(-60,30,1);
	state.objects[1] = new Vector(60,30,1);
	//
	// now make the widgets
	//
	state.settingsWidgets = [];
	//
	// make buttons for what you want.
	// start with a button to toggle the sign of the lens
	//
	var buttonX = 0;
	var buttonY1 = 30;
	var buttonY2 = 0;
	var buttonW= 70;
	var buttonH = 10;
	state.settingsWidgets[0] = new Button(buttonX,buttonY1,buttonW,buttonH,
		temp, bfunction1, "Toggle Sign (left)");
	state.settingsWidgets[1] = new Button(buttonX,buttonY2,buttonW,buttonH,
		temp, bfunction2, "Toggle Sign (right)");

	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);
	
	
	/*simulation.tabs["Settings"].mouseUp = function(x, y, state, ev) {
		state = handleMouseUp(x, y, state, ev, state.settingsWidgets);
		//
		// see if we've pushed the button 
		//
		var changeSign = (x > buttonX) && (x < buttonX+buttonW) && 
			(y > buttonY1-buttonH/2) && (y < buttonY1+buttonH/2);
		if (changeSign)	{
			//
			// change the sign, positive/negative
			//
			state.objects[0].data[2] = -state.objects[0].data[2];
		}
		changeSign = (x > buttonX) && (x < buttonX+buttonW) && 
			(y > buttonY2-buttonH/2) && (y < buttonY2+buttonH/2);
		if (changeSign)	{
			//
			// change the sign, positive/negative
			//
			state.objects[1].data[2] = -state.objects[1].data[2];
		}
		return state;
	}*/
	
	state = simulation.init_state(simulation.state);
	return state;
}


simulation.step = function(state) {
	return state;
}

var first = true;
simulation.render2d = function(state, c, w, h) {
	//
	// draw the horizontal
	//
	state.width = w;
	state.height = h;
	c.beginPath();
	c.moveTo(-w/2,0);
	c.lineTo(w/2,0);
	c.stroke();
	//
	// for debugging....
	//
	if (DBG.enabled) {
		c.fillCircle(0,0,1);
		if (first) DBG.write("#lenses:"+state.nlens);
		c.text(round(-w/2,1)+","+round(h/2,1),-w/2+10,h/2-5);
		c.text(round(-w/2,1)+","+round(-h/2,1),-w/2+10,-h/2);
		var xc = 0;
		var nl = 15;
		var dx = 10;
		c.text("Delta-x="+round(dx,1),-w/4,h/2-5);
		var oldline = c.lineWidth;
		c.lineWidth = .05;
		for (var i=0; i<nl; i++){
			c.moveTo(xc,h/2);
			c.lineTo(xc,-h/2);
			c.stroke();
			c.moveTo(-xc,h/2);
			c.lineTo(-xc,-h/2);
			c.stroke();
			xc += dx;
		}
		c.lineWidth = oldline;
	}
	//
	// sort the lenses left to right based on the x position
	//
	if (state.objects[1].data[0] < state.objects[0].data[0]) {
		temp0 = state.objects[0].data[0];
		temp1 = state.objects[0].data[1];
		temp2 = state.objects[0].data[2];
		state.objects[0].data[0] = state.objects[1].data[0];
		state.objects[0].data[1] = state.objects[1].data[1];
		state.objects[0].data[2] = state.objects[1].data[2];
		state.objects[1].data[0] = temp0;
		state.objects[1].data[1] = temp1;
		state.objects[1].data[2] = temp2;
	}
	//
	// draw the object as a Vector and draw the lenses
	//
	var xStart = state.objectX;
	var v1 = new Vector(xStart,0);
	var v2 = new Vector(xStart,state.objectH);
	vector2dTowards(c, v1, v2, state.objectH);
	for (var i=0; i<state.nlens; i++) {
		var xl=state.objects[i].data[0];
		var fl=state.objects[i].data[1];
		var sl=state.objects[i].data[2];
		drawLens(c,xl,state.lensHeight,state.lensThick,fl,sl);
	}
	//
	// first comes the object
	//
	var objX = state.objectX;	// this is a coordinate
	var objH = state.objectH;	// this is a coordinate, the height of the object, NOT
								// the y-position of the object (which is at 0)
	if (first) DBG.write("Object at x="+round(objX,2)+" height="+objH);
	//
	// now that we have drawn the lens, find the image and draw the lines
	//
	oldColor = c.strokeStyle;
	c.strokeStyle = "blue";
	oldLine = c.lineWidth;
	c.lineWidth = .2;
	var end1 = null;
	var end2 = null;
	var end3 = null;
	var lensX = state.objects[0].data[0];	// this is a coordinate
	var focal = state.objects[0].data[1];   // this is a distance, NOT a coordinate!  note that
                                           // focal is > 0 for all lenses (use isign for that)
	var isign = state.objects[0].data[2];	// +- for pos/neg lenses
	if (first) DBG.write("lens is at x="+lensX+" w/focal length "+focal+"  sign="+isign);
	//
	// calculate the image from this object using this lens
	//
	var xobj = lensX - objX;
	var flens = isign*focal;
	var ximg = 1/(1/flens - 1/xobj);
	var himg = ximg*objH/xobj;
	var imgx = ximg + lensX;			// back to the coordinate
	if (first) DBG.write("obj coord="+round(objX,2)+" and distance="+round(xobj,2)+" w/flens "+flens);
	if (first) DBG.write("image distance="+round(ximg,2)+", image coord="+round(imgx,2)+" height="+round(himg,2));
	//
	// draw from the object to the lens.   we draw 3 principle lines to form the image.  note:
	// in the formulae below, the focal point is ALWAYS>0.  use "isign" for pos/neg lenses.
	// but for the image, leave the signs there (ximg<0 means virtual, and so imgH).  note that
	// in the formula below, it is the same whether the object is inside the focal point or not
	// (for a positive lens) providing you let ximg and himg both be negative for virtual images
	//
	// here are the equations for the lines on the object side of the lens (on the left side):
	// (note, "x" is the coordinate relative to the lens which is at x=0 in this frame)
	//
	//	 (1) horizontal from the object to the lens:
	//			y = objH
	//   (2) from the object through center of lens
	//			y = -(objH/objX)(x-lensX)
	//   (3) through the focal point to the lens
	//			y = [objH/(f-objX)](x-lensX) - imgH
	//
	// draw from the object to the lens
	//
	var start = new Vector(objX,objH);
	end1 = new Vector(lensX,objH);
	drawLine(c, start, end1);    // from object to lens
	end2 = new Vector(lensX, 0);
	drawLine(c, start, end2);
	end3 = new Vector(lensX,-himg);
	drawLine(c, start, end3);
	//
	// and here are the equations on the other side (the right side)
	//
	//	 (1) horizontal from the object to the lens:
	//			y = -isign*(objH/f)(x-lensX) + objH
	//   (2) from the object through center of lens
	//			y = -(objH/xobj)(x-lensX)
	//   (3) through the focal point to the lens
	//			y = -imgH
	//
	// draw lines between the lenses, passing through the intermediate image
	//
	var xc = state.objects[1].data[0];	// this is a coordinate
	var yc = -isign*(objH/focal)*(xc-lensX) + objH;
	var endL1 = new Vector(xc,yc);
	drawLine(c, end1, endL1);  // ray 1 horizontal to the lens, through focus
	yc = -(objH/xobj)*(xc-lensX);
	var endL2 = new Vector(xc,yc);
	drawLine(c, end2, endL2);		// ray 2 goes through the lens center
	yc = -himg;
	var endL3 = new Vector(xc,yc);
	drawLine(c, end3, endL3);  // ray 3 through focus, then horizontal
	//
	// draw intermediate image as an arrow with a small linewidth
	//
	var oldline2 = c.lineWidth;
	c.lineWidth = .1;
	var oldcolor2 = c.strokeStyle; 
	c.strokeStyle = oldColor;
	var imageStart = new Vector(imgx, 0);
	var imageEnd = new Vector(imgx, -himg);
	drawLine(c, imageStart, imageEnd);
	if (himg > 0) {
		drawLine(c, imageEnd, new Vector(imageEnd.data[0]+arrowLength,imageEnd.data[1]+arrowLength));
		drawLine(c, imageEnd, new Vector(imageEnd.data[0]-arrowLength,imageEnd.data[1]+arrowLength));
	}
	else {
		drawLine(c, imageEnd, new Vector(imageEnd.data[0]+arrowLength,imageEnd.data[1]-arrowLength));
		drawLine(c, imageEnd, new Vector(imageEnd.data[0]-arrowLength,imageEnd.data[1]-arrowLength));
	}
	c.strokeStyle = oldcolor2;
	c.lineWidth = oldline2;
	//
	// draw red lines to the image if it's virtual (same side of 1st lens as object)
	//
	if (imgx < lensX) {
		var oldstyle = c.strokeStyle;
		c.strokeStyle = "red";
		var xc = imgx;
		var yc = -isign*(objH/focal)*(xc-lensX) + objH;
		drawLine(c, end1, new Vector(xc,yc) );  // ray 1 horizontal to the lens, through focus
		yc = -(objH/xobj)*(xc-lensX);
		drawLine(c, end2, new Vector(xc,yc) );		// ray 2 goes through the lens center
		yc = -himg;
		drawLine(c, end3, new Vector(xc,yc) );  // ray 3 through focus, then horizontal
		c.strokeStyle = oldstyle;
	}
	//
	// now fine the new image using the previous image as an object
	//
	objX = imgx;
	objH = -himg;
	if (first) DBG.write("2nd Object at x="+round(objX,2)+" height="+round(objH,2));
	lensX = state.objects[1].data[0];	// this is a coordinate
	focal = state.objects[1].data[1];   // this is a distance, NOT a coordinate!  note that
                                           // focal is > 0 for all lenses (use isign for that)
	isign = state.objects[1].data[2];	// +- for pos/neg lenses
	if (first) DBG.write("2nd lens is at x="+lensX+" w/focal length "+focal+"  sign="+isign);
	//
	// calculate the image from this object using this lens
	//
	var xobj = lensX - objX;
	var flens = isign*focal;
	var ximg = 1/(1/flens - 1/xobj);
	var himg = ximg*objH/xobj;
	var imgx = ximg + lensX;			// back to the coordinate
	if (first) DBG.write("2nd obj coord="+round(objX,2)+" and distance="+round(xobj,2)+" w/flens "+flens);
	if (first) DBG.write("2nd image distance="+round(ximg,2)+", image coord="+round(imgx,2)+" height="+round(himg,2));
	//
	// draw lines from the lens to the image.  if the image is virtual (behind the lens) then
	// draw them in red and use the above formulae to extend the blue lines to infinity
	//
	var color = null;
	end = new Vector(imgx,-himg);
	if (imgx < lensX) c.strokeStyle = "red";
	drawLine(c, endL1, end);		 // from lens to image
	drawLine(c, endL2, end);
	drawLine(c, endL3, end);
	//
	// if the image is virtual, need to continue from the 2nd lens out to infinity to the right.
	// use the 3 vectors endL1, 2, and 3
	//
	if (imgx < lensX) {
		c.strokeStyle = "blue";
		var xc = 200;
		var m = (end.data[1]-endL1.data[1])/(end.data[0]-endL1.data[0]);
		var b = end.data[1] - m*end.data[0];
		var yc = m*xc + b;
		drawLine(c, endL1, new Vector(xc,yc) );  // ray 1 horizontal to the lens, through focus
		var m = (end.data[1]-endL2.data[1])/(end.data[0]-endL2.data[0]);
		var b = end.data[1] - m*end.data[0];
		var yc = m*xc + b;
		drawLine(c, endL2, new Vector(xc,yc) );		// ray 2 goes through the lens center
		var m = (end.data[1]-endL3.data[1])/(end.data[0]-endL3.data[0]);
		var b = end.data[1] - m*end.data[0];
		var yc = m*xc + b;
		drawLine(c, endL3, new Vector(xc,yc) );  // ray 3 through focus, then horizontal
		c.strokeStyle = oldstyle;
	}
	//
	// all done.  now we draw the image as an arrow
	//
	c.lineWidth = oldLine;
	c.strokeStyle = oldColor;
	var imageStart = new Vector(imgx, 0);
	var imageEnd = new Vector(imgx, -himg);
	drawLine(c, imageStart, imageEnd);
	if (himg > 0) {
		drawLine(c, imageEnd, new Vector(imageEnd.data[0]+arrowLength,imageEnd.data[1]+arrowLength));
		drawLine(c, imageEnd, new Vector(imageEnd.data[0]-arrowLength,imageEnd.data[1]+arrowLength));
	}
	else {
		drawLine(c, imageEnd, new Vector(imageEnd.data[0]+arrowLength,imageEnd.data[1]-arrowLength));
		drawLine(c, imageEnd, new Vector(imageEnd.data[0]-arrowLength,imageEnd.data[1]-arrowLength));
	}
	//
	// turn debugging off so that we do not continually write to the new window
	//
	first = false;
}

function drawLine(c, start, end) {
	c.beginPath()
	c.moveTo(start.data[0], start.data[1]);
	c.lineTo(end.data[0], end.data[1]);
	c.stroke();
	c.closePath();
}

function drawLens(c,x,h,t,f,sign) {
	//
	// draw the lenses.  no optics here, just geometry.  note:  h, r, and t are not independent
	// of course.  t is twice the sagitta, and that's constant, and so is the height so we need to 
	// find the radius of curvature for a constant h and t.
	//
	// it's easy:  by pythagor, R^2 = (R-sag)^2 + (h/2)^2 and solve for R(sag,h) to get
	// R = (h^2/8sag) + (sag/2)
	//
	var halfHeight = h/2;
	var halfThick = t/2;
	var radius = h*h/(8*halfThick) + halfThick/2;
	var focal = f;
	if (sign > 0) {
		//
		// positive lens here
		//
		// the lens consists of two arcs.   each arc is part of a circle centered a distance
		// from the lens center +- (radius-thickness) to each side.  the trick is to solve for
		// the coordinate "x" and the angle "theta" using just h and t.   It's easy:
		//
		// r^2 = x^2 + h^2   and r = x + t/2.   solve for x = [h^2 - (t/2)^2 ]/t and tan(th)=y/x
		//
		var xCenter = ( halfHeight*halfHeight - halfThick*halfThick ) / t;
		var tanTheta = halfHeight / xCenter;
		var theAngle = Math.atan(tanTheta);
		var leftCenterX = x - xCenter;
		var rightCenterX = x + xCenter;
		c.beginPath();
		c.arc(leftCenterX,0,radius,2.*Math.PI-theAngle,theAngle,false);
		c.arc(rightCenterX,0,radius,Math.PI-theAngle,Math.PI+theAngle,false);		
		c.stroke();
		//
		// add a circle centered around the focal point (1/f = (n-1)*2/r for symmetric lens)
		//
		var arad = .75;
		c.fillCircle(x-focal,0,arad);
		c.fillCircle(x+focal,0,arad);
	}
	else {
		//
		// negative lens here
		//
		var xCenter = ( halfHeight*halfHeight - halfThick*halfThick ) / t;
		var tanTheta = halfHeight / xCenter;
		var theAngle = Math.atan(tanTheta);
		var leftCenterX = x - xCenter - t;
		var rightCenterX = x + xCenter + t;
		c.beginPath();
		c.arc(leftCenterX,0,radius,2.*Math.PI-theAngle,theAngle,false);
		c.stroke();
		c.beginPath();
		c.arc(rightCenterX,0,radius,Math.PI-theAngle,Math.PI+theAngle,false);		
		c.stroke();
		//
		// add a circle centered around the focal point
		//
		var arad = .75;
		c.fillCircle(x-focal,0,arad);
		c.fillCircle(x+focal,0,arad);
		//
		// now connect the upper and lower parts
		//
		c.beginPath();
		c.moveTo( x-t,halfHeight);
		c.lineTo( x+t,halfHeight);
		c.stroke();
		c.moveTo( x-t,-halfHeight);
		c.lineTo( x+t,-halfHeight);
		c.stroke();
	}
	return;
}	


// Like render2d, but for the settings tab. We just outsource this to the
// widgets library.
simulation.renderSettings = function(state, c, w, h) {
	renderWidgets(state.settingsWidgets, c, state);
}

var selRadius = 3;
var isObjX = false;
var isObjH = false;
var isLens = false;
var isLensFocal = false;

simulation.tabs["Simulation"].mouseUp = function(x, y, state, ev) {
	state.cur = false;
	isObjX = false;
	isObjH = false;
	isLens = false;
	isLensFocal = false;
	return state;
}

simulation.tabs["Simulation"].mouseDown = function(x, y, state, ev) {
	//
	// mouse is down, so choose which object we are going to move.
	// success will be because we are within some radius of the object.   how about +- 2 pixels?
	//
	//
	// check the object (x position and height), the lenses, and the focal point of the lenses
	//
	state.cur = false;
	state.isel = -1;
	//
	// check the object height to see if we are requesting to make it bigger
	//
	xcoord = x/2;
	ycoord = (y+50)/2;
	var xd = state.objectX - xcoord;
	var yd = state.objectH - ycoord;
	var delta = Math.sqrt( xd*xd + yd*yd );
	if (delta < selRadius) {
		isObjH = true;
		state.cur = true;
		return state;
	}
	//
	// nope. check if it's the object to see if we are dragging it along the horizontal
	//
	if (Math.abs(xd) < selRadius) {
		isObjX = true;
		state.cur = true;
		return state;
	}
	//
	// nope.  check all the lens focal points
	//
	DBG.write("checking focal points");
	for (var i=0; i<state.nlens; i++) {
		//
		// remember, there are 2 focal points to check!, and focal point is relative to the lens!
		// so focal = +-[x(focal) - x(lens)] depending on which of the 2 x(focal) you use.
		// so solve for 
		//		x(focal) = x(lens) +- focal 
		//
		var xobj1 = state.objects[i].data[0] + state.objects[i].data[1];
		var xd1 = xobj1 - xcoord;
		var yd = ycoord;
		var delta1 = Math.sqrt( xd1*xd1 + yd*yd);
		var xobj2 = state.objects[i].data[0] - state.objects[i].data[1];
		var xd2 = xobj2 - xcoord;
		var delta2 = Math.sqrt( xd2*xd2 + yd*yd);
		DBG.write("mouseDown x,y="+round(xcoord,1)+","+round(ycoord,1)+" focal["+i+"]="+
			state.objects[i].data[1]);
		if ( (delta1 < selRadius) || (delta2 < selRadius) ) {
			state.isel = i;
			isLensFocal = true;
			state.cur = true;
			return state;
		}
	}
	//
	// nope.  check all the lens
	//
	for (var i=0; i<state.nlens; i++) {
		var xobj = state.objects[i].data[0];
		var xd = Math.abs(xobj - xcoord);
		if (xd < selRadius) {
			state.isel = i;
			isLens = true;
			state.cur = true;
			return state;
		}
	}
	return state;
}

simulation.tabs["Simulation"].mouseMove = function(x, y, state, ev) {
	var xcoord = x/2;
	var ycoord = (y+50)/2;
	if (state.cur) {
		if (isObjH) {
			state.objectH = ycoord;
		}
		else if (isObjX) {
			//
			// we probably shouldn't allow the object to be to the right of any lens, or the ray
			// tracing won't make sense (left to right, that's the ticket)
			//
			if (xcoord > state.objects[0].data[0]) {
				state.objectX = xcoord - 10;
				alert("The object should always be the leftmost thing!");
				state.cur = false;
			}
			else state.objectX = xcoord;
		}
		else if (isLensFocal) {
			state.objects[state.isel].data[1] = Math.abs(xcoord - state.objects[state.isel].data[0]);
		}
		else if (isLens) {
			//
			// ok we are moving the lens.   check if it's coming too close to the object
			//
			if (xcoord < state.objectX) {
				state.objects[state.isel].data[0] = xcoord + 10;
				alert("The object should always be the leftmost thing!");
				state.cur = false;
			}
			else state.objects[state.isel].data[0] = xcoord;
		}
	}
	return state;
}
