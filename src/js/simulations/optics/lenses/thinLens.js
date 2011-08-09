var simulation_name = "Thin Lens";

var simulation = new Simulation(simulation_name);
simulation.dt = 200;
simulation.description = "Lenses using the thin lens equation.";
var debug = true;
var temp = null;
var doline1 = true;
var doline2 = false;
var doline3 = true;
var first = true;


//color = new Array("blue","green","red","yellow");

simulation.init_state = function(state) {

	state.cur = false;

	return state;
}
//
// Set up the widgets.  Here we make a slider to vary the index of refraction in the 2nd region
//

function bfunction(d) {
//	if (d) alert("pushed");
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
	state.nlens = 1;
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
	state["hSlider"] = 5;
	state.objectX = -130;
	state.objectH = state["hSlider"];
	//
	// here are the lenses.  note:  all objects are lenses and vice versa (in a previous version
	// of this code, the "object" was an object but that is no longer)
	//
	state.lensHeight = 70;   // full height, top to bottom
	state.lensThick = 10
	
	state["fSlider1"] = 30;
	state["fSlider2"] = 30;
	state.objects[0] = new Vector(-60,state["fSlider1"],-1);
	state.objects[1] = new Vector(50,state["fSlider2"],1);
	//
	// for the ordered list.  it will be a list of vectors with components (x,index) where
	// index points to state.objects 
	//
	state.ordered = {};
	//
	// now make the widgets.  1 per object (height), and 2 per each lens (thickness and index of refr)
	//
	state.settingsWidgets = [];
	//
	// widgets: the 0th is for the object.  then come the lenses, then the buttons
	//
	//                                      x    y   w  h   dataloc  min max    title
	state.settingsWidgets[0] = new Slider(-200, 40, 60, 2, "hSlider", 1, 50,"Object Height");
	for (var i=0; i<state.nlens; i++) {
		var j = i+1;
		var focal = String("fSlider"+j);
		state.settingsWidgets[j] = new Slider(-100, 60-20*j, 60, 2, focal, 10, 100,"Lens "+j+" Focal pt");
	}
	//
	// here are the 2 buttons, one to add a positive lens, one to add a negative one
	//
	var buttonX = -200;
	var buttonYP = 20;
	var buttonYM = 0;
	var buttonW= 35;
	var buttonH = 10;
	state.settingsWidgets[state.nlens+1] = new Button(buttonX,buttonYP,buttonW,buttonH,
		temp, bfunction, "New +Lens");
	state.settingsWidgets[state.nlens+2] = new Button(buttonX,buttonYM,buttonW,buttonH,
		temp, bfunction, "New -Lens");

	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);
	
	
	simulation.tabs["Settings"].mouseUp = function(x, y, state, ev) {
		state = handleMouseUp(x, y, state, ev, state.settingsWidgets);
		//
		// store the object height and the focal lengths as changed by the sliders
		//
		state.objectH = state["hSlider"];
		for (var i=0; i<state.nlens; i++) {
			var j = i + 1;
			var focal = String("fSlider"+j);
			if (state.objects[i].data[2] > 0) state.objects[i].data[1] = state[focal];
			else state.objects[i].data[1] = -1*state[focal];
		}
		//
		// see if we've pushed the button to add a lens
		//
		var addPos = (x > buttonX) && (x < buttonX+buttonW) && 
			(y > buttonYP-buttonH/2) && (y < buttonYP+buttonH/2);
		var addNeg = (x > buttonX) && (x < buttonX+buttonW) && 
			(y > buttonYM-buttonH/2) && (y < buttonYM+buttonH/2);
		if (addPos)	{
			//
			// add a lens at x=20
			//
			state.objects[state.nlens] = new Vector(20,40,1);
			state.nlens++;
		}
		if (addNeg)	{
			//
			// add a lens at x=-20
			//
			state.objects[state.nlens] = new Vector(-20,40,-1);
			state.nlens++;
		}
		return state;
	}
	
	state = simulation.init_state(simulation.state);
	return state;
}


simulation.step = function(state) {
	return state;
}

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
	if (debug) {
		c.fillCircle(0,0,1);
		c.text("#lenses:"+state.nlens,-50,20);
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
		//
		// prepare an array of vectors, with the x and "index" as elements, to be ordered
		//
		state.ordered[i] = new Vector(xl,i);
	}
	//
	// order the lenses, left to right, use the bubble sort, it's easiest with so few lenses
	//
	if (debug) {
		c.text(round(state.ordered[0].data[0],2)+","+state.ordered[0].data[1],0,-20);
		if (state.nlens>1) c.text(round(state.ordered[1].data[0],2)+","+state.ordered[1].data[1],0,-25);
	}
	if (state.nlens > 1) {
		var keep = true;	
		while (keep) {
			var nswap = 0;
			for(var i = 0; i < state.nlens-1; i++) {
				if (state.ordered[i].data[0]  > state.ordered[i+1].data[0]) {
					nswap++;
					var temp0 = state.ordered[i].data[0];
					var temp1 = state.ordered[i].data[1];
					state.ordered[i].data[0] = state.ordered[i+1].data[0];
					state.ordered[i].data[1] = state.ordered[i+1].data[1];
					state.ordered[i+1].data[0] = temp0;
					state.ordered[i+1].data[1] = temp1;
				}
			}
			if (nswap == 0) keep = false;
		}
	}
	if (debug) {
		c.text(round(state.ordered[0].data[0],2)+","+state.ordered[0].data[1],20,-20);
		if (state.nlens>1) c.text(round(state.ordered[1].data[0],2)+","+state.ordered[1].data[1],20,-25);
	}
	//
	// now that we have drawn them and sorted them, we have to do the ray tracing.
	//
	var lensX = state.objects[0].data[0];	// this is a coordinated
	var focal = state.objects[0].data[1];   // this is a distance, NOT a coordinate!
	var objX = state.objectX;	// this is a coordinate
	var objY = state.objectH;	// this is a coordinate, the height of the object, NOT
								// the y-position of the object (which is at 0)
	var isign = state.objects[0].data[2];	// +- for pos/neg lenses
	var Image = rayTrace(true,lensX,focal,objX,objY,isign);
	var Ximg = Image.data[0];
	var Yimg = Image.data[1];
	//
	// draw the intermediate image
	//
	c.lineWidth = .05;
	if (Yimg > 0) vector2dAtAngle(Ximg, 0, Math.abs(Yimg), 90, c)
	else vector2dAtAngle(Ximg, 0, Math.abs(Yimg), 270, c)
	if (debug) {
		c.text("Obj1="+round(objX,2)+","+round(objY,2),0,45);
		c.text("Lens1: x="+round(lensX,2)+", f="+round(focal,2),0,40);
		c.text("Image1="+round(Ximg,2)+","+round(Yimg,2),0,35);
	}
	//
	// now do the 2nd lens
	//
	if (state.nlens > 1) {
		var lensX = state.objects[1].data[0];	// this is a coordinated
		var focal = state.objects[1].data[1];   // this is a distance, NOT a coordinate!
		var objX = Ximg;
		var objY = Yimg;
		var isign = state.objects[1].data[2];	// +- for pos/neg lenses
		var Image = rayTrace(false,lensX,focal,objX,objY,isign);
		var Ximg = Image.data[0];
		var Yimg = Image.data[1];
		if (debug) {
			c.text("Obj2="+round(objX,2)+","+round(objY,2),30,45);
			c.text("Lens2: x="+round(lensX,2)+", f="+round(focal,2),30,40);
			c.text("Image2="+round(Ximg,2)+","+round(Yimg,2),30,35);
		}
	}
	//
	// now draw the final image
	//
	c.lineWidth = .5;
	if (Yimg > 0) vector2dAtAngle(Ximg, 0, Math.abs(Yimg), 90, c)
	else vector2dAtAngle(Ximg, 0, Math.abs(Yimg), 270, c)
	c.lineWidth = oldLine;
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
//	var halfThick = r - Math.sqrt( r*r - halfHeight*halfHeight);
//	var radius = r;
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

function rayTrace(first,lensX,focal,objX,objY,isign) {	
	//
	// start at the object and draw the 3 rays.  use the "thin lens" formula for the image.
	//
	// notes: 
	//	 1. the 3 lines are:   horizontal from the object, through the focal point (1)
	//                         from the object through center of lens (2)
	//                         through the focal point, then horizontal (3)
	//
	//   2. lensX, objX, and objY are ALL coordinates, but focal is a distance!!!!!   this
	//		is important because of the convention for lenses (e.g. the left side of the lens 
	//      has object>0 and image<0)
	//   3. rayTrace returns a vector which is the coordinates of the image.  it will be up to
	//      you to turn those into the new object and pipe to the next lens for tray tracing
	//
	//	1/xo + 1/xi = 1/f
	//
	//  and the magnification will be given by
	//
	//  yi/xi = yo/xo
	//
	//  if first=true then we just do the ray tracing from the object.  if it's false, then
	//  that means that we are ray tracing an image of a previous lens, in which case we will
	//  use the previous 3 lines equations and make them continue to the lens and then go through
	//  the image, which we calculate.
	//
	oldColor = c.strokeStyle;
	c.strokeStyle = "blue";
	oldLine = c.lineWidth;
	c.lineWidth = .1;
	//
	//  so we solve for the image location "i", that makes it easy to draw things.  note also
	//	that all lenses are at y=0
	//
	var dOL = lensX-objX;					// change these coordinates to distances
	//
	// now solve for the distances of the image to the lensX
	//
	var imgX = 1/focal - 1/dOL;
	var imgX = 1./imgX;
	//
	// note:  if imgX<0 then we are inside the focal point
	//
	var dOf = dOL - focal;
	var isInside = (dOf < 0);
	//
	// and of course the magnification
	//
	var imgY = imgX * objY/dOL;
	//
	// ok, now we have everything relative to the lens.  calculate the image canvas coordinates
	//
	var Ximg = imgX + lensX;   // remember, imgX = Ximg - lensX is the distance from the lens
	var Yimg = -imgY;          // and imgY is positive downwards so the coordinate needs -1
	//
	// so there are several possibilities.  a + or - lens, and the object is either between the
	// lens and the focal point or it's not.  gotta test on all 4
	//
	if (isign == +1) {
		//
		// positive lens
		//
/*		c.text("objX=("+round(objX,2)+",height="+round(objY,2)+")",0,h/2-5);
		c.text("lensX="+round(lensX,2)+",f="+round(focal,2)+",dOL="+round(dOL,2)+",dOf="+round(dOf,2),0,h/2-10);
		c.text("imgX=("+round(imgX,2)+",imgY="+round(imgY,2)+")",0,h/2-15);
		c.text("Ximg=("+round(Ximg,2)+",Yimg="+round(Yimg,2)+")",0,h/2-20);
		c.text("w/2="+round(w/2,2)+",h/2="+round(h/2,2),0,h/2-25);
		c.text("o",0,0);*/
		//
		//	1. horizontal to the lens from the object head
		//
		if (doline1) {
			c.beginPath();
			c.moveTo(objX,objY);
			c.lineTo(lensX,objY);
			c.stroke();
			//
			// now, then down through the focal point.  gotta do your trig here.
			//
			if (isInside) {
				c.lineTo(Ximg,Yimg);
				c.stroke();
				c.moveTo(lensX,objY);
				c.lineTo(lensX+focal,0);
				c.stroke();
			}
			else {
				c.lineTo(Ximg,Yimg);
				c.stroke();
			}
		}
		//
		// 2. from the object through the center of the lens
		//
		if (doline2) {
			c.beginPath();
			c.moveTo(objX,objY);
			c.lineTo(Ximg,Yimg);
			c.stroke();
			if (isInside) {
				c.moveTo(objX,objY);
				c.lineTo(lensX,0);
				c.stroke();
			}
		}
		//
		// 3. from the object through the 1st focal length, then through the lens parallel
		//
		if (doline3) {
			c.moveTo(objX,objY);
			c.lineTo(lensX,Yimg);
			c.stroke();
			c.lineTo(Ximg,Yimg);
			c.stroke();
		}
	} 
	else {
		//
		// negative lens
		//
/*		c.text("objX="+round(objX,2)+",height="+round(objY,2),0,h/2-5);
		c.text("lensX="+round(lensX,2)+",f="+round(focal,2)+",dOL="+round(dOL,2)+",dOf="+round(dOf,2),0,h/2-10);
		c.text("imgX="+round(imgX,2)+",imgY="+round(imgY,2),0,h/2-15);
		c.text("Ximg="+round(Ximg,2)+",Yimg="+round(Yimg,2),0,h/2-20);
		c.text("w/2="+round(w/2,2)+",h/2="+round(h/2,2),0,h/2-25);
		c.text("o",0,0);*/
		//
		//	1. horizontal to the lens from the object head
		//
		if (doline1) {
			c.beginPath();
			c.moveTo(objX,objY);
			c.lineTo(lensX,objY);
			c.stroke();
			//
			// now, then down through the focal point on the same side of the object.
			//
			c.lineTo(Ximg,Yimg);
			c.stroke();
		}
		//
		// 2. from the object through the center of the lens
		//
		if (doline2) {
			c.beginPath();
			c.moveTo(objX,objY);
			c.lineTo(lensX,0);
			c.stroke();
		}
		//
		// 3. from the object through the 1st focal length, then through the lens parallel
		//
		if (doline3) {
			c.strokeStyle = "#f00";
			c.moveTo(objX,objY);
			c.lineTo(lensX,Yimg);
			c.stroke();
			c.lineTo(Ximg,Yimg);
			c.stroke();
		}
	}
	c.strokeStyle = oldColor;
	c.lineWidth = oldLine;
	return new Vector(Ximg,Yimg);
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
//	DBG.write("checking focal points");
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
//		DBG.write("mouseDown x,y="+round(xcoord,1)+","+round(ycoord,1)+" focal["+i+"]="+
//			state.objects[i].data[1]);
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
			state.objectX = xcoord;
		}
		else if (isLensFocal) {
			state.objects[state.isel].data[1] = Math.abs(xcoord - state.objects[state.isel].data[0]);
		}
		else if (isLens) {
			state.objects[state.isel].data[0] = xcoord;
		}
	}
/*		//
		// we probably shouldn't allow the object to be to the right of any lens, or the ray
		// tracing won't make sense (left to right, that's the ticket)
		//
		if (state.isel == -1) {
			//
			// ok, we are moving the object.  check that it is always furthest to the left of any lens
			//
			if (xcoord > state.objects[0].data[0]) {
				state.objectX = xcoord - 10;
				alert("The object should always be the leftmost thing!");
				state.cur = false;
			}
			else state.objectX = xcoord;
		}
		else {
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
*/	
	return state;
}

var DBG = {
	write : function(txt){
		if (!window.dbgwnd) {
			window.dbgwnd = window.open("","debug","status=0,toolbar=0,location=0,menubar=0,directories=0,resizable=0,scrollbars=1,width=600,height=250");
			window.dbgwnd.document.write('<html><head></head><body style="background-color:black"><div id="main" style="color:green;font-size:12px;font-family:Courier New;"></div></body></html>');
		}
		var x = window.dbgwnd.document.getElementById("main");
		this.line=(this.line==null)?1:this.line+=1;
		txt=this.line+': '+txt;
		if (x.innerHTML == "") {
			x.innerHTML = txt;
		}
		else {
			x.innerHTML = txt + "<br/>" + x.innerHTML;
		}
	}
}