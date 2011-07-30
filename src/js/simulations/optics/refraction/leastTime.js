var simulation_name = "Principle of Least Time";

var simulation = new Simulation(simulation_name);
simulation.dt = 200;
simulation.description="Here we can see Snell's law from the principle of least time.   Click on the Settings and adjust the index of refraction in the region to the right, and then click on the boundary to minimize the travel time yourself and see Snell's Law.";

simulation.init_state = function(state) {
	state.start1 = new Vector(10,-20);
	state.start2 = new Vector(-10,20);
	state.n=state["nSlider"];
	state.vel1 = 1;
	state.vel2 = state.vel1/state.n;
	state.nlines = 20;
	state.curPath = null;
	state.plot = [];
	for(var i = 0; i < state.nlines; i++) {
		state.plot[i] = 0;
	}

	state.vars = [];
	return state;
}
//
// Set up the widgets.  Here we make a slider to vary the index of refraction in the 2nd region
//
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
	// there will be 2 regions, one with n=1 and one with a variable n.  draw a box around 
	// each boundary, use different colors.  leave 10 on the top
	// and 10 on the bottom so that the rectangle has width w/2 and height h-20.   demark the
	// two regions by drawing a vertical line dividing the box by 2 horizontally
	//
	c.beginPath();
	c.strokeStyle = "#d0d";
	c.strokeRect(-w/2,-h/2,w,h);
	c.beginPath();
	c.strokeStyle = "#000";
	c.strokeRect(-w/2,-h/2+10,w/4,h-20);
	c.strokeStyle = "#00f";
	c.strokeRect(-w/4,-h/2+10,w/4,h-20);
/*	c.shadowOffsetX = 5;
	c.shadowOffsetY = 5;
	c.shadowBlur    = 4;
	c.shadowColor   = 'rgba(255, 0, 0, 0.5)';
	c.fillStyle     = '#fff';
	c.strokeStyle = "#000";
	c.fillRect(-w/2, -h/2+10, w/4, h-20);
	c.fillRect(-w/4, -h/2+10, w/4, h-20);
	c.closePath();
*/
	//
	// now put circles at the starting location in the two volumes and printout velocities 
	// p1 and p3 are the coordinate vectors for the two points respectively
	//
	c.beginPath();
	c.strokeStyle = "#000";
	var p1 = new Vector(-w/2+state.start1.data[0],h/2+state.start1.data[1]);
	c.arc(p1.data[0],p1.data[1],1,0,2*Math.PI,false);
	c.stroke();
	c.text("n=1",p1.data[0],p1.data[1]+3);
//	c.text("v="+round(state.vel1,2),p1.data[0],p1.data[1]+3);
	c.beginPath();
	c.strokeStyle = "#00f";
	var p3 = new Vector(state.start2.data[0],-h/2+state.start2.data[1]);
	c.arc(p3.data[0],p3.data[1],1,0,2*Math.PI,false);
//	c.text("v="+round(state.vel2,2),p3.data[0],p3.data[1]+3);
	c.text("n="+round(state.n,2),p3.data[0],p3.data[1]+3);
	c.stroke();
	//
	// a few definitions, for convenience.
	//
	var dTx = p1.data[0]-p3.data[0];
	var dTy = p1.data[1]-p3.data[1];
	//
	// printout stuff used in the curPath calculation
	//
/*
	c.text("dx="+round(dTx,1),p1.data[0],p3.data[1]+20);
	c.text("dy="+round(dTy,1),p1.data[0],p3.data[1]+15);
	c.text("w="+round(w,1),p1.data[0],p3.data[1]+10);
	c.text("h="+round(h,1),p1.data[0],p3.data[1]+5);
	c.text("x1="+round(p1.data[0],1),p1.data[0],p1.data[1]+13);
	c.text("y1="+round(p1.data[1],1),p1.data[0]+15,p1.data[1]+13);
	c.text("x2="+round(p3.data[0],1),p3.data[0],p1.data[1]+13);
	c.text("y2="+round(p3.data[1],1),p3.data[0]+15,p1.data[1]+13);
*/
	var distn = Math.sqrt( dTx*dTx + dTy*dTy );
	var timen = distn/state.vel2;
	//
	// now draw some lines that connect the two objects, refracting at the boundary
	//
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
		// and calculate the time for this distance 
		//
		c.beginPath();
		c.strokeStyle = "#000";
		c.lineWidth = .1;
		c.moveTo(p1.data[0],p1.data[1]);
		c.lineTo(p2.data[0],p2.data[1]);
		c.stroke();
		var d1x = p1.data[0]-p2.data[0];
		var d1y = p1.data[1]-p2.data[1];
		var d1 = Math.sqrt( d1x*d1x + d1y*d1y );
		var time1 = d1/state.vel1;
		//
		// now draw a line to the 2nd object on the right and calculate the time
		//
		c.beginPath();
		c.strokeStyle = "#00f";
		c.moveTo(p2.data[0],p2.data[1]);
		c.lineTo(p3.data[0],p3.data[1]);
		c.stroke();
		var d2x = p3.data[0]-p2.data[0];
		var d2y = p3.data[1]-p2.data[1];
		var d2 = Math.sqrt( d2x*d2x + d2y*d2y );
		var time2 = d2/state.vel2;
//		var n1sint1 = d1y/d1;
//		var n2sint2 = state.n*d2y/d2;
//		var dsnell = n1sint1 - n2sint2;
		
//		state.plot[i] = new Vector(yp,time2);
		//
		// now plot out the function to see if the principle of least time holds
		// note:  first we need to renormalize so it fits
		//
//		c.text(round(dsnell,2),30,yp);
		var tnormNew = (time1+time2)*50/timen;
		
		if(tnorm != null) {
			c.beginPath();
		    c.strokeStyle = "#000";
			c.moveTo(tnorm, yp+ydel);
			c.lineTo(tnormNew, yp);
			c.stroke();
		}
		//c.arc(tnormNew,yp,.5,0,2*Math.PI,false);
		tnorm = tnormNew;
/*
		c.text(round(time1,1),0,yp);
		c.text(round(time2,1),10,yp);
		c.text(round(time1+time2,1),20,yp);
		c.text(round(d1,1),30,yp);
		c.text(round(d2,1),40,yp);
		c.text(round(yp,1),50,yp);
*/
		yp -= ydel;
	}
/*	var chars = " ";
	for (var i=900; i<1000; i++) {
		chars = String.fromCharCode(i);
		alert(i+"="+chars);
	}
*/
	if(state.curPath != null) {
		c.strokeStyle = "#f00";
/*
		c.text(round(state.curPath,1),0,40);
		c.text("gw="+round(state.vars[0],1),0,35);
		c.text("x="+round(state.vars[1],1),0,30);
		c.text("gh="+round(state.vars[2],1),0,25);
		c.text("y="+round(state.vars[3],1),0,20);
		c.text("s1="+round(state.start1.data[0],1),0,15);
		c.text(","+round(state.start1.data[1],1),15,15);
		c.text("s2="+round(state.start2.data[0],1),0,10);
		c.text(","+round(state.start2.data[1],1),15,10);
*/
		var p2 = new Vector(-w/4,state.curPath);
		//
		// start at the left object and draw a line to the center at various y values.
		// include the normal lines
		//
		c.beginPath();
		c.lineWidth = .4;
		c.moveTo(p1.data[0],p1.data[1]);
		c.lineTo(p2.data[0],p2.data[1]);
		c.stroke();
		c.moveTo(p1.data[0]+(p2.data[0]-p1.data[0])/2,p2.data[1]);
		c.lineTo(p3.data[0]-(p3.data[0]-p2.data[0])/2,p2.data[1]);
		c.stroke();
		var theta = String.fromCharCode(952);
		var phi = String.fromCharCode(934);
		c.text(theta,p2.data[0]+15,p2.data[1]-5);
//		c.text("2",p2.data[0]+17,p2.data[1]-7);
		c.text(phi,p2.data[0]-15,p2.data[1]+3);
//		c.text(theta,p2.data[0]-15,p2.data[1]+3);
//		c.text("1",p2.data[0]-13,p2.data[1]+1);
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
		var timetot = time1 + time2;
		var tnorm = timetot*50/timen;
		c.beginPath();
		c.arc(tnorm,state.curPath,.5,0,2*Math.PI,false);
		//
		// now calculate n1*sin(theta1) - n2*sin(theta2)
		//
		var theta1 = Math.abs( p2.data[1]-p1.data[1] )/dist1;
		var theta2 = Math.abs( p2.data[1]-p3.data[1] )/dist2;
		var snell1 = Math.sin(theta1);
		var snell2 = state.n*Math.sin(theta2);
		var dsnell = round(snell1/snell2,2);
		timetot2 = round(timetot,2);
		c.text("n1*sin("+phi+")/n2*sin("+theta+")="+dsnell+" and time="+timetot2,tnorm+5,state.curPath);
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
	state.vars[0] = simulation.w/4;
	state.vars[1] = x;
	state.vars[2] = simulation.h/2;
	state.vars[3] = y;
	state.curPath = y;
	return state;
}

simulation.tabs["Simulation"].mouseMove = function(x, y, state, ev) {
	if(state.curPath != null) state.curPath = y;
	return state;
}
/*

simulation.renderGraph = function(state, c, w, h) {
	//
	// draw the graph
	//
	var ll = new Vector(0,-30);
	var ur = new Vector(30,30);
	drawGraph(ll, ur, c, state.plot, true);
}

simulation.addTab("Graph", simulation.renderGraph);
*/