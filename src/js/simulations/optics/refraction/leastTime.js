var simulation_name = "Principle of Least Time";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description="Here we can see Snell's law from the principle of least time";

simulation.init_state = function(state) {
	state.start1 = new Vector(10,-20);
	state.start2 = new Vector(-10,20);
	state.n=state["nSlider"];
	state.vel1 = 1;
	state.vel2 = state.n * state.vel1;
	state.nlines = 20;
	state.curPath = null;
	state.plot = [];
	for(var i = 0; i < state.nlines; i++) {
		state.plot[i] = 0;
	}


	return state;
}

// Set up the widgets
simulation.setup = function(state) {
	state["nSlider"] = 1.5;
	state.settingsWidgets = [];
	state.settingsWidgets[0] = new Slider(-30, 20, 60, 2, "nSlider", 1, 5);
	
	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);
	
	simulation.tabs["Settings"].mouseUp = function(x, y, state, ev) {
		state = handleMouseUp(x, y, state, ev, state.settingsWidgets);
		state.n = state["nSlider"];
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
	c.strokeStyle="#000";
	//
	// put a box around the boundary, divide it in half vertically.  leave 10 on the top
	// and 10 on the bottom so that the rectangle has width w/2 and height h-20.   demark the
	// two regions by drawing a vertical line dividing the box by 2 horizontally
	//
	c.beginPath();
	c.strokeRect(-w/2,-h/2+10,w/2,h-20);
	c.moveTo(-w/4,h/2-10);
	c.lineTo(-w/4,-h/2+10);
	c.stroke();
	//
	// now put circles at the starting location in the two volumes and printout velocities 
	// p1 and p3 are the coordinate vectors for the two points respectively
	//
	c.beginPath();
	var p1 = new Vector(-w/2+state.start1.data[0],h/2+state.start1.data[1]);
	c.arc(p1.data[0],p1.data[1],1,0,2*Math.PI,false);
	c.stroke();
	c.beginPath();
	var p3 = new Vector(state.start2.data[0],-h/2+state.start2.data[1]);
	c.arc(p3.data[0],p3.data[1],1,0,2*Math.PI,false);
	c.stroke();
	c.text("v="+round(state.vel1,2),p1.data[0],p1.data[1]+3);
	c.text("v="+round(state.vel2,2),p3.data[0],p3.data[1]+3);
	//
	// a few definitions, for convenience.   
	var distn = Math.sqrt( (p3.data[0]-p1.data[0])*(p3.data[0]-p1.data[0]) +
							(p3.data[1]-p1.data[1])*(p3.data[1]-p1.data[1]) );
	var timen = distn/state.vel2;
	//
	// now draw some lines that connect the two, but don't make them straight!
	//
	c.beginPath();
	c.moveTo(p1.data[0],p1.data[1]);
	var ydiff = p1.data[1] - p3.data[1];
	var ydel = ydiff/state.nlines;
	var yp = p1.data[1];
	for (var i=0; i<=state.nlines; i++) {
		//
		// form new vectors that have new coordinates
		//
		var p2 = new Vector(-w/4,yp);
		//
		// start at the left object and draw a line to the center at various y values
		//
//		c.beginPath();
		c.moveTo(p1.data[0],p1.data[1]);
		c.lineTo(p2.data[0],p2.data[1]);
		c.stroke();
		var dist1 = Math.sqrt( (p1.data[0]-p2.data[0])*(p1.data[0]-p2.data[0]) +
							(p1.data[1]-p2.data[1])*(p1.data[1]-p2.data[1]) );
		var time1 = dist1/state.vel1;
		//
		// now draw a line to the 2nd object on the right
		//
//		c.beginPath();
		c.moveTo(p2.data[0],p2.data[1]);
		c.lineTo(p3.data[0],p3.data[1]);
		c.stroke();
		var dist2 = Math.sqrt( (p3.data[0]-p2.data[0])*(p3.data[0]-p2.data[0]) +
							(p3.data[1]-p2.data[1])*(p3.data[1]-p2.data[1]) );
		var time2 = dist2/state.vel2;
		//
		//
		// need to renormalize
		//
		var tnormNew = (time1+time2)*50/timen;
		
		if(tnorm != null) {
			c.beginPath();
			c.moveTo(tnorm, yp+ydel);
			c.lineTo(tnormNew, yp);
			c.stroke();
		}
		//c.arc(tnormNew,yp,.5,0,2*Math.PI,false);
		
		tnorm = tnormNew;
//		c.font = "2pt Arial";
//		c.text(time1,0,yp);
//		c.text(time2,40,yp);
//		c.text(time1+time2,10,yp);
		yp -= ydel;
	}
	if(state.curPath != null) {
		c.strokeStyle = "#f00";
		var p2 = new Vector(-w/4,state.curPath);
		//
		// start at the left object and draw a line to the center at various y values
		//
		c.beginPath();
		c.moveTo(p1.data[0],p1.data[1]);
		c.lineTo(p2.data[0],p2.data[1]);
		c.stroke();
		var dist1 = Math.sqrt( (p1.data[0]-p2.data[0])*(p1.data[0]-p2.data[0]) +
							(p1.data[1]-p2.data[1])*(p1.data[1]-p2.data[1]) );
		var time1 = dist1/state.vel1;
		//
		// now draw a line to the 2nd object on the right
		//
		c.beginPath();
		c.moveTo(p2.data[0],p2.data[1]);
		c.lineTo(p3.data[0],p3.data[1]);
		c.stroke();
		var dist2 = Math.sqrt( (p3.data[0]-p2.data[0])*(p3.data[0]-p2.data[0]) +
							(p3.data[1]-p2.data[1])*(p3.data[1]-p2.data[1]) );
		var time2 = dist2/state.vel2;
		var tnorm = (time1+time2)*50/timen;
		c.beginPath();
		c.arc(tnorm,state.curPath,.5,0,2*Math.PI,false);
		c.stroke();
	}
}

// Like render2d, but for the settings tab. We just outsource this to the
// widgets library.
simulation.renderSettings = function(state, c, w, h) {
	renderWidgets(state.settingsWidgets, c, state);
}

simulation.tabs["Simulation"].mouseUp = function(x, y, state, ev) {
	state.curPath = null;
	return state;
}

simulation.tabs["Simulation"].mouseDown = function(x, y, state, ev) {
	if(x < -simulation.getWidth()/4) {
		state.curPath = simulation.getHeight()/2+state.start1.data[1]+((y-simulation.getHeight()/2-state.start1.data[1])/(x+simulation.getWidth()/2-state.start1.data[0]))*(simulation.getWidth()/4-state.start1.data[0]);
	}else {
		state.curPath = -simulation.getHeight()/2+state.start2.data[1]+((y+simulation.getHeight()/2-state.start2.data[1])/(x-state.start2.data[0]))*(-simulation.getWidth()/4-state.start2.data[0]);
	}
	return state;
}

simulation.tabs["Simulation"].mouseMove = function(x, y, state, ev) {
	if(state.curPath != null) {
		if(x < -simulation.getWidth()/4) {
			state.curPath = simulation.getHeight()/2+state.start1.data[1]+((y-simulation.getHeight()/2-state.start1.data[1])/(x+simulation.getWidth()/2-state.start1.data[0]))*(simulation.getWidth()/4-state.start1.data[0]);
		}else {
			state.curPath = -simulation.getHeight()/2+state.start2.data[1]+((y+simulation.getHeight()/2-state.start2.data[1])/(x-state.start2.data[0]))*(-simulation.getWidth()/4-state.start2.data[0]);
		}
		if(state.curPath > simulation.getHeight()/2-10) {
			state.curPath = simulation.getHeight()/2-10;
		}else if(state.curPath < -simulation.getHeight()/2+10) {
			state.curPath = -simulation.getHeight()/2+10;
		}
	}
	return state;
}

/*
simulation.renderGraph = function(state, c, w, h) {
	var arr = [];
	for(var i = 0; i < 360/10; i++) {
		var v = new Vector(i, state.history[i]);
		arr.push(v);
	}
	drawGraph(new Vector(-40, -40), new Vector(40, 40), c, arr, true, "#000", 17, 20);
}

simulation.addTab("Graph", simulation.renderGraph);
*/