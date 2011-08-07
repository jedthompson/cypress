var simulation_name = "Thin Lens";

var simulation = new Simulation(simulation_name);
simulation.dt = 200;
simulation.description = "Lenses using the thin lens equation.";
var debug = false;
var doline1 = true;
var doline2 = true;
var doline3 = false;
var temp = null;
var first = true;


color = new Array("blue","green","red","yellow");

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
	// you.   and also not that the last variable will be 0 for the object, +1 for positive lenses
	// and -1 for negative lenses
	//
	state.isel = 0;
	state.objects = {};
	state.nlens = 2;
	//                                               0     1        2     3      4       5
	// each object (lens) is described by a vector: (x,thickness,height,index,focalpt,posORneg)
	// note that height is the full height of the lens (from top to bottom) and focalpt is along
	// the x axis relative to the center of the lens
	//
	//
	// here is the object
	//
	state["hSlider"] = 5;
	state.objects[0] = new Vector(-130,0,state["hSlider"],0,0,0);	
	//
	// here are the lenses
	//
	state["tSlider1"] = 10;
	state["tSlider2"] = 10;
	state["nSlider1"] = 1.5;
	state["nSlider2"] = 1.5;
	state.objects[1] = new Vector(-60,state["tSlider1"],40,state["nSlider1"],0,1);
	state.objects[2] = new Vector(32,state["tSlider2"],40,state["nSlider2"],0,-1);
	//
	// for the ordered list.  it will be a list of vectors with components (x,index) where
	// index points to state.objects 
	//
	state.ordered = {};
	//
	// now make the widgets.  1 per object (height), and 2 per each lens (thickness and index of refr)
	//
	state.settingsWidgets = [];
	state.settingsWidgets[0] = new Slider(-200, 40, 60, 2, "hSlider", 1, 50,"Object Height");
	for (var i=1; i<state.nlens+1; i++) {
		var thick = String("tSlider"+i);
		var index = String("nSlider"+i);
		state.settingsWidgets[2*i-1] = new Slider(-140+70*i, 40, 60, 2, thick, 1, 20,"Lens "+i+" Thickness");
		state.settingsWidgets[2*i] = new Slider(-140+70*i, 20, 60, 2, index, 1, 3,"Lens "+i+" Refr Index");
	}
	//
	// and 2 buttons, one to add a positive lens, one to add a negative one
	//
	var buttonX = -200;
	var buttonYP = 20;
	var buttonYM = 0;
	var buttonW= 35;
	var buttonH = 10;
	state.settingsWidgets[2*state.nlens+1] = new Button(buttonX,buttonYP,buttonW,buttonH,
		temp, bfunction, "New +Lens");
	state.settingsWidgets[2*state.nlens+2] = new Button(buttonX,buttonYM,buttonW,buttonH,
		temp, bfunction, "New -Lens");

	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);
	
	
	simulation.tabs["Settings"].mouseUp = function(x, y, state, ev) {
		state = handleMouseUp(x, y, state, ev, state.settingsWidgets);
		//
		// all lenses will be set to the same.  this will change later
		//
		state.objects[0].data[2] = state["hSlider"];
		for (var i=1; i<=state.nlens; i++) {
			var thick = String("tSlider"+i);
			var index = String("nSlider"+i);
			state.objects[i].data[1] = state[thick];
			state.objects[i].data[3] = state[index];
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
			// add a lens 
			//
			state.nlens++;
			state.objects[state.nlens] = new Vector(0,5,40,1.1,0,1);
		}
		if (addNeg)	{
			//
			// add a lens 
			//
			state.nlens++;
			state.objects[state.nlens] = new Vector(40,5,40,1.1,0,-1);
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
	// draw the object as a Vector and sort the objects from left to right
	//
	var xStart = state.objects[0].data[0];
	var v1 = new Vector(xStart,0);
	var v2 = new Vector(xStart,state.objects[0].data[2]);
	vector2dTowards(c, v1, v2, state.objects[0].data[2]);
	for (var i=1; i<state.nlens+1; i++) {
		var xl=state.objects[i].data[0];
		var tl=state.objects[i].data[1];
		var hl=state.objects[i].data[2];
		var n1=state.objects[i].data[3];
		var sl=state.objects[i].data[5];
		state.objects[i].data[4] = drawLens(c,xl,tl,hl,n1,sl);
		//
		// prepare an array of vectors, with the x and "index" as elements, to be ordered
		//
		state.ordered[i-1] = new Vector(state.objects[i].data[0],i);
	}
	//
	// order the lenses, left to right, use the bubble sort, it's easiest with so few lenses
	//
//	c.text(round(state.ordered[0].data[0],2)+","+state.ordered[0].data[1],0,-20);
//	c.text(round(state.ordered[1].data[0],2)+","+state.ordered[1].data[1],0,-25);
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
//	c.text(round(state.ordered[0].data[0],2)+","+state.ordered[0].data[1],20,-20);
//	c.text(round(state.ordered[1].data[0],2)+","+state.ordered[1].data[1],20,-25);
	//
	// now that we have drawn them and sorted them, we have to do the ray tracing.
	//
	var lensX = state.objects[1].data[0];	// this is a coordinated
	var focal = state.objects[1].data[4];   // this is a distance, NOT a coordinate!
	var objX = state.objects[0].data[0];	// this is a coordinate
	var objY = state.objects[0].data[2];	// this is a coordinate, the height of the object, NOT
											// the y-position of the object (which is at 0)
	var isign = state.objects[1].data[5];	// +- for pos/neg lenses
	var Image = rayTrace(lensX,focal,objX,objY,isign,color[0]);
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
		var lensX = state.objects[2].data[0];	// this is a coordinated
		var focal = state.objects[2].data[4];   // this is a distance, NOT a coordinate!
		var objX = Ximg;
		var objY = Yimg;
		var isign = state.objects[2].data[5];	// +- for pos/neg lenses
		var Image = rayTrace(lensX,focal,objX,objY,isign,color[1]);
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


function drawLens(c,x,t,h,n,sign) {
	//
	// returns focal length, relative to the lens 
	//
//	var stold = c.strokeStyle;
//	var fold = c.fillStyle;
	//
	// positive lenses are blue, negative are red
	//
	if (sign > 0) {
//		c.strokeStyle = "#00f";
//		c.fillStyle = "#00f";
		//
		// positive lens here
		//
		// the lens consists of two arcs.   each arc is part of a circle centered a distance
		// from the lens center +- (radius-thickness) to each side.  the trick is to solve for
		// the coordinate "x" and the angle "theta" using just h and t.   It's easy:
		//
		// r^2 = x^2 + h^2   and r = x + t/2.   solve for x = [h^2 - (t/2)^2 ]/t and tan(th)=y/x
		//
		var halfHeight = h/2;
		var halfThick = t/2;
		var xCenter = ( halfHeight*halfHeight - halfThick*halfThick ) / t;
		var radius = xCenter + halfThick;
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
		var focal = radius / (2.*(n-1));
		var arad = .75;
		c.fillCircle(x-focal,0,arad);
		c.fillCircle(x+focal,0,arad);
		//
		// debugging
		//
/*		c.beginPath();
		c.moveTo(x,y-5);
		c.lineTo(x-focal,y-5);
		c.moveTo(x,y+5);
		c.lineTo(x+focal,y+5);
		c.stroke();*/
	}
	else {
//		c.strokeStyle = "#f00";
//		c.fillStyle = "#f00";
		//
		// negative lens here
		//
		var halfHeight = h/2;
		var halfThick = t/2;
		var xCenter = ( halfHeight*halfHeight - halfThick*halfThick ) / t;
		var radius = xCenter + halfThick;
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
		var focal = radius / (2.*(n-1));
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
		//
		// focal point is negative....
		//
		focal = -focal;
	}
//	c.fillStyle = fold;
//	c.strokeStyle = stold;
	return focal;
}	

function rayTrace(lensX,focal,objX,objY,isign,color) {	
	//
	// start at the object and draw the 2 or 3 rays.  the "thin lens" formula is that.
	// notes: 
	//   1. lensX, objX, and objY are ALL coordinates, but focal is a distance!!!!!   this
	//		is important because of the convention for lenses (e.g. the left side of the lens 
	//      has object>0 and image<0)
	//   2. rayTrace returns a vector which is the coordinates of the image.  it will be up to
	//      you to turn those into the new object and pipe to the next lens for tray tracing
	//
	//	1/xo + 1/xi = 1/f
	//
	//  and the magnification will be given by
	//
	//  yi/xi = yo/xo
	oldColor = c.strokeStyle;
	c.strokeStyle = color;
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
	// ok, now we have everything relative 
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
		//	1. horizontal to the lens from the object head.   red here
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
		// 2. from the object through the center of the lens.  green
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
		// 3. from the object through the 1st focal length, then through the lens parallel.  blue
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
		//	1. horizontal to the lens from the object head.   red here
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
		// 2. from the object through the center of the lens.  green
		//
		if (doline2) {
			c.beginPath();
			c.moveTo(objX,objY);
			c.lineTo(lensX,0);
			c.stroke();
		}
		//
		// 3. from the object through the 1st focal length, then through the lens parallel.  blue
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

simulation.tabs["Simulation"].mouseUp = function(x, y, state, ev) {
	state.cur = false;
	return state;
}

simulation.tabs["Simulation"].mouseDown = function(x, y, state, ev) {
	//
	// mouse is down, so choose which object we are going to move
	//
	state.cur = true;
	//
	// find out if we are near the object or one of the lenses
	// default will be the object
	//
	state.isel = 0;
	var delta = Math.abs( state.objects[0].data[0] - x/2 );
	for (var i=1; i<state.nlens+1; i++) {
		var diff = Math.abs(state.objects[i].data[0] - x/2);
		if (diff < delta) {
			state.isel = i;
			delta = diff;
		}
	}
	return state;
}

simulation.tabs["Simulation"].mouseMove = function(x, y, state, ev) {
	if (state.cur) {
		//
		// we probably shouldn't allow the object to be to the right of any lens, or the ray
		// tracing won't make sense (left to right, that's the ticket)
		//
		var xcoord = x/2;
		if ( (state.isel == 0) && (xcoord > state.objects[1].data[0]) ) {
			xcoord = x/2-5;
			state.cur = false;
			alert("The object should always be the leftmost thing!");
		}
		state.objects[state.isel].data[0] = xcoord;
	}
	
	return state;
}
