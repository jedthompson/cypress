var simulation_name = "Thin Lens";

var simulation = new Simulation(simulation_name);
simulation.dt = 200;
simulation.description = "Lenses using the thin lens equation.";

simulation.init_state = function(state) {
	state.cur = false;
	//
	// create a set of objects.  the first one will always be the "object" object, that is it
	// will be the thing that will have it's ray traced through the lenses.   it will have index
	// 0.  all other objects are lenses, and the first one will have index 1, etc.
	// the last variable will be 0 for the object (I know, redundant), +1 for positive lenses
	// and -1 for negative lenses
	//
	state.isel = 0;
	state.objects = {};
	state.nlens = 1;
	//
	// here is the object
	//
	state.objects[0] = new Vector(-100,0,0,10,0,0);	
	//
	// each lens is described by a vector: (x,y,thickness,height,index,posORneg)
	// note that height is the full height of the lens (from top to bottom)
	//
	var x1 = -20;
	var y1 = 0;
	var t1 = state["tSlider"];
	var h1 = 40;
	var n1 = state["nSlider"];
	var x2 = +20;
	var y2 = y1;
	var t2 = t1;
	var h2 = h1;
	var n2 = n1;
	state.objects[1] = new Vector(x1,y1,t1,h1,n1,1);
	state.objects[2] = new Vector(x2,y2,t2,h2,n2,-1);
	//
	// for the ordered list.  it will be a list of vectors with components (x,index) where
	// index points to state.objects 
	//
	state.ordered = [];
	return state;
}
//
// Set up the widgets.  Here we make a slider to vary the index of refraction in the 2nd region
//
simulation.setup = function(state) {
	state.settingsWidgets = [];
	state["tSlider"] = 8;
	state["nSlider"] = 1.5;
	state.settingsWidgets[0] = new Slider(-30, 40, 60, 2, "tSlider", 1, 20);
	state.settingsWidgets[1] = new Slider(-30, 20, 60, 2, "nSlider", 1, 3);
	
	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);
	
	simulation.tabs["Settings"].mouseUp = function(x, y, state, ev) {
		state = handleMouseUp(x, y, state, ev, state.settingsWidgets);
		//
		// all lenses will be set to the same.  this will change later
		//
		state.t1 = state["tSlider"];
		state.n1 = state["nSlider"];
		//
		// re-call the initialization
		//
		state = simulation.init_state(simulation.state);
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
	c.beginPath();
	c.moveTo(-w/2,0);
	c.lineTo(w/2,0);
	c.stroke();
	//
	// sort the array of objects
	//
	//
	// draw the object as a Vector and sort the objects from left to right
	//
	var xStart = state.objects[0].data[0];
	var yStart = state.objects[0].data[1];
	var v1 = new Vector(xStart,yStart);
	var v2 = new Vector(xStart,yStart+state.objects[0].data[3]);
	vector2dTowards(c, v1, v2, state.objects[0].data[3]);
	for (var i=1; i<state.nlens+1; i++) {
		var xl=state.objects[i].data[0];
		var yl=state.objects[i].data[1];
		var tl=state.objects[i].data[2];
		var hl=state.objects[i].data[3];
		var n1=state.objects[i].data[4];
		var sl=state.objects[i].data[5];
		drawLens(c,xl,yl,tl,hl,n1,sl);
		c.strokeStyle = "#000";
		//
		state.ordered[i-1] = new Vector(state.objects[i].data[0],i);
	}
	//
	// order the lenses, left to right, use the bubble sort, it's easiest with so few lenses
	//
//	c.text(round(state.ordered[0].data[0],2)+","+state.ordered[0].data[1],0,-20);
//	c.text(round(state.ordered[1].data[0],2)+","+state.ordered[1].data[1],0,-25);
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
//	c.text(round(state.ordered[0].data[0],2)+","+state.ordered[0].data[1],20,-20);
//	c.text(round(state.ordered[1].data[0],2)+","+state.ordered[1].data[1],20,-25);
	//
	// now that we have drawn them and sorted them, we have to do the ray tracing.
	//
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
	var delta = Math.abs( state.objects[0].data[0] - x );
	for (var i=1; i<state.nlens+1; i++) {
		var diff = Math.abs(state.objects[i].data[0] - x);
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
//		if (state.isel == 0) {
//			var isany = false;
//			for (var i=1; i<state.nlens+1; i++) {
//				if (x > state.objects[i].data[0]) isany = true;
		state.objects[state.isel].data[0] = x;
	}
	
	return state;
}

function drawLens(c,x,y,t,h,n,sign) {
	var stold = c.strokeStyle;
	var fold = c.fillStyle;
	//
	// positive lenses are blue, negative are red
	//
	if (sign > 0) {
		c.strokeStyle = "#00f";
		c.fillStyle = "#00f";
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
		c.arc(leftCenterX,y,radius,2.*Math.PI-theAngle,theAngle,false);
		c.arc(rightCenterX,y,radius,Math.PI-theAngle,Math.PI+theAngle,false);		
		c.stroke();
		//
		// add an arc centered around the focal point
		//
		var focal = radius / (2.*(n-1));
		var arad = 1;
		c.fillCircle(x-focal+(arad/2),y,arad);
		c.fillCircle(x+focal+(arad/2),y,arad);
	}
	else {
		c.strokeStyle = "#f00";
		c.fillStyle = "#f00";
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
		c.arc(leftCenterX,y,radius,2.*Math.PI-theAngle,theAngle,false);
		c.stroke();
		c.beginPath();
		c.arc(rightCenterX,y,radius,Math.PI-theAngle,Math.PI+theAngle,false);		
		c.stroke();
		//
		// add an arc centered around the focal point
		//
		var focal = radius / (2.*(n-1));
		var arad = 1;
		c.fillCircle(x-focal+(arad/2),y,arad);
		c.fillCircle(x+focal+(arad/2),y,arad);
		//
		// now connect the upper and lower parts
		//
		c.beginPath();
		c.moveTo( x-t,y+halfHeight);
		c.lineTo( x+t,y+halfHeight);
		c.stroke();
		c.moveTo( x-t,y-halfHeight);
		c.lineTo( x+t,y-halfHeight);
		c.stroke();
		//
	}
		c.fillStyle = fold;
		c.strokeStyle = stold;
}	
