var simulation_name = "Principle of Least Time";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description="Here we can see Snell's law from the principle of least time";

function init_state(state) {
	state.start1 = new Vector(10,-20);
	state.start2 = new Vector(-10,20);
	state.vel1 = 1.5;
	state.vel2 = 1;
	state.nlines = 20;
	state.curPath = null;
	return state;
}

simulation.state = init_state(simulation.state);


simulation.step = function(state) {
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.strokeStyle="#000";
	//
	// put a box around the boundary, divide it in half vertically
	//
	c.beginPath();
	c.moveTo(-w/2,h/2-10);
	c.lineTo(-w/2,-h/2+10);
	c.stroke();
	c.lineTo(0,-h/2+10);
	c.stroke();
	c.lineTo(0,h/2-10);
	c.stroke();
	c.lineTo(-w/2,h/2-10);
	c.stroke();
	c.moveTo(-w/4,h/2-10);
	c.lineTo(-w/4,-h/2+10);
	c.stroke();
	//
	// now put circles at the starting location in the two volumes
	//
	var p1 = new Vector(-w/2+state.start1.data[0],h/2+state.start1.data[1]);
	var p3 = new Vector(state.start2.data[0],-h/2+state.start2.data[1]);
	var distn = Math.sqrt( (p3.data[0]-p1.data[0])*(p3.data[0]-p1.data[0]) +
							(p3.data[1]-p1.data[1])*(p3.data[1]-p1.data[1]) );
	var timen = distn/state.vel2;
	c.beginPath();
	c.arc(p1.data[0],p1.data[1],1,0,2*Math.PI,false);
	c.stroke();
	c.beginPath();
	c.arc(p3.data[0],p3.data[1],1,0,2*Math.PI,false);
	c.stroke();
	//
	// now draw some lines that connect the two, but don't make them straight!
	//
	c.beginPath();
	c.moveTo(p1.data[0],p1.data[1]);
	var ydiff = p1.data[1] - p3.data[1];
	var ydel = ydiff/state.nlines;
	var yp = p1.data[1]
	for (var i=0; i<=state.nlines; i++) {
		//
		// form new vectors that have new coordinates
		//
		var p2 = new Vector(-w/4,yp);
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
		//
		//
		// need to renormalize
		//
		var tnorm = (time1+time2)*50/timen;
		c.beginPath();
		c.arc(tnorm,yp,.5,0,2*Math.PI,false);
		c.stroke();
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

