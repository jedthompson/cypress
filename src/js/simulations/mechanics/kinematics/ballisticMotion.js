var simulation_name = "Ballistic Motion";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;   //time in milliseconds, which means 20ms per "tick"
simulation.description="Here, one can observe that gravity only affects the y component of the ";
simulation.description += "velocity and that the x component remains constant.  One can also see";
simulation.description += "that gravity always induces a parabolic trajectory in a launched ";
simulation.description += "particle.\nNotice how the red and blue curves have the same range ";
simulation.description += "but different heights, and it of course takes longer for the upper ";
simulation.description += "curve to get to the endpoint.   As you bring the velocity angle closer ";
simulation.description += "to pi/4 the curves will converge to one curve that represents the ";
simulation.description += "maximum range for a given initial speed.";

// constructor here
simulation.init_state = function(state) {
	state.acc = new Vector(0,-9.8); //accel in x and y directions
	state.t = 0;
	state.time = 0;
	state.initpos = new Vector(-90,-40); // won't change
	state.hmax = null;
	state.any = false;
	state.mark1 = null;
	state.mark2 = null;
	state.dopause = false;
	
	state.pos1 = new Vector(-90,-40); // define position, start at -40,-40
	state.theta1 = state["theta"];
	state.speed = state["speed"];
	state.angle1 = Math.PI*state.theta1/180;
	state.vel1 = new Vector(state.speed*Math.cos(state.angle1),
						   state.speed*Math.sin(state.angle1)); // x and y components of velocity
	state.path1 = [];
	state.dopath1 = false;
	state.path1[0] = state.initpos;
	state.height1 = -.5*Math.pow(state.vel1.data[1],2)/state.acc.data[1] + state.initpos.data[1];
	state.range1 = -2*state.vel1.data[0]*state.vel1.data[1]/state.acc.data[1] + state.initpos.data[0];
	//
	// there are 2 possible velocities here that will give the same range but of course, different
	// heights.   just use theta and the symmetric angle about pi/4
	//
	state.pos2 = state.pos1;
	state.theta2 = 90 - state.theta1;
	state.angle2 = Math.PI*state.theta2/180;
	state.vel2 = new Vector(state.speed*Math.cos(state.angle2),
						   state.speed*Math.sin(state.angle2)); // x and y components of velocity
	state.path2 = [];
	state.dopath2 = false;
	state.path2[0] = state.initpos;
	state.height2 = -.5*Math.pow(state.vel2.data[1],2)/state.acc.data[1] + state.initpos.data[1];
	state.range2 = -2*state.vel2.data[0]*state.vel2.data[1]/state.acc.data[1] + state.initpos.data[0];
	
	return state;
}

function bfunction(d, state) {
	if (!d) {
		//state = simulation.init_state(simulation.state);
		state.dopause = !state.dopause;
	}
	return state;
}
var temp = null;
simulation.setup = function(state) {
	state["theta"] = 60;
	state["speed"] = 40;
	state.settingsWidgets = [];
	state.settingsWidgets[0] = new Slider(-30, 40, 70, 6, "theta", 0, 90,"Initial angle");
	state.settingsWidgets[1] = new Slider(-30, 20, 70, 6, "speed", 0, 100,"Initial speed");
	var buttonX = -30;
	var buttonY = 0;
	var buttonW= 80;
	var buttonH = 10;	
	state.settingsWidgets[2] = new Button(buttonX,buttonY,buttonW,buttonH, temp, bfunction, 
			"Toggle Auto Restart");
	
	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);

	state = simulation.init_state(simulation.state);
	return state;
}


// set the simulation step method to this function.  you update the "state" here
simulation.step = function(state) {
	state.time += simulation.dt;
	state.pos1 = addV(state.pos1,state.vel1.scale(.001*simulation.dt));//rescale
	state.vel1 = addV(state.vel1,state.acc.scale(.001*simulation.dt));//scale does not change the 
	//value of the acc vector. to change the acc itself use doScale instead of scale

	state.pos2 = addV(state.pos2,state.vel2.scale(.001*simulation.dt));//rescale
	state.vel2 = addV(state.vel2,state.acc.scale(.001*simulation.dt));//scale does not change the 
	//value of the acc vector. to change the acc itself use doScale instead of scale
	
	state.t++;
	if (state.pos1.data[1] > state.initpos.data[1]) {
		state.path1[state.t] = new Vector(state.pos1.data[0],state.pos1.data[1]);
	}
	else state.dopath1 = true;

	if (state.pos2.data[1] > state.initpos.data[1]) {
		state.path2[state.t] = new Vector(state.pos2.data[0],state.pos2.data[1]);
	}
	else state.dopath2 = true;
	
	if ( state.dopath1 || state.dopath2 ) {
		if (!state.any) {
			state.mark1 = new Vector(state.pos1.data[0],state.pos1.data[1]);
			state.mark2 = new Vector(state.pos2.data[0],state.pos2.data[1]);
		}
		state.any = true;
	}
	
	//
	// reset once the upper path gets back to zero
	if(state.pos1.data[1] < state.initpos.data[1] && !state.dopause) {
		state = simulation.init_state(state);

	}
	
	return state;
}

// render2d is called after the step method at every "tick"
// c is the context, or pointer to the context that allows you to draw on the canvas
// w and h are "width" and "height" of the screen, passed TO this code so everything
// can scale by w and h and you don't have to know the exact height and width in pixels
//
simulation.render2d = function(state, c, w, h) {
	oldstyle = c.fillStyle;
	c.text("Time: "+round(state.time,2)+"ms",0,h/2-10);
	c.fillStyle = "blue"
	var y1 = state.height1 - state.initpos.data[1];
	var x1 = state.range1 - state.initpos.data[0];
	c.text("Height: "+round(y1,1)+" Range: "+round(x1,1),-w/2+10,h/2-10);
	c.fillStyle = "red"
	var y2 = state.height2 - state.initpos.data[1];
	var x2 = state.range2 - state.initpos.data[0];
	c.text("Height: "+round(y2,1)+" Range: "+round(x2,1),-w/2+10,h/2-15);
	oldline = c.lineWidth;
	c.lineWidth = 0.1;
	c.beginPath();
	c.moveTo(-w/2,state.initpos.data[1]);
	c.lineTo(+w/2,state.initpos.data[1]);
	c.stroke();
	//
	// mark the time on both paths when at least one of the balls is back to the ground
	//
	if ( state.any) {
		c.lineWidth = oldline;
		c.beginPath();
		c.arc(state.mark1.data[0],state.mark1.data[1],1,0,2*Math.PI,false);
		c.stroke();
		c.beginPath();
		c.arc(state.mark2.data[0],state.mark2.data[1],1,0,2*Math.PI,false);
		c.stroke();
		c.lineWidth = 0.1;
		//if (state.dopause) sim.paused = true;
	}
	//
	// draw a circle around the object on the path
	//
	oldstyle = c.strokeStyle;
	c.strokeStyle = "#00f";
	c.beginPath();
	c.arc(state.pos1.data[0],state.pos1.data[1],1,0,2*Math.PI,false);
	c.stroke();
	c.strokeStyle = "#f00";
	c.beginPath();
	c.arc(state.pos2.data[0],state.pos2.data[1],1,0,2*Math.PI,false);
	c.stroke();
	//
	// draw a circle for the x component of velocity
	//
	c.strokeStyle = oldstyle;
	c.beginPath();
	c.arc(state.pos1.data[0], state.height1,1,0,2*Math.PI,false);
	c.stroke();
	c.beginPath();
	c.arc(state.pos2.data[0], state.height2,1,0,2*Math.PI,false);
	c.stroke();
	//
	// draw a circle for the y component of velocity
	//	
	c.beginPath();
	c.arc(state.initpos.data[0],state.pos1.data[1],1,0,2*Math.PI,false);
	c.stroke();
	c.beginPath();
	c.arc(state.range2,state.pos2.data[1],1,0,2*Math.PI,false);
	c.stroke();
	//
	// draw the x and y component of the velocities for this path
	//
	var a = new Vector(state.vel1.data[0], 0);
	var b = new Vector(0, state.vel1.data[1]);
	drawVector(state.pos1.data[0], state.height1, a, c);
	drawVector(state.initpos.data[0], state.pos1.data[1], b, c);
	var a2 = new Vector(state.vel2.data[0], 0);
	var b2 = new Vector(0, state.vel2.data[1]);
	drawVector(state.pos2.data[0], state.height2, a2, c);
	drawVector(state.range2, state.pos2.data[1], b2, c);
	//
	// draw the paths with a thicker line
	//
	c.lineWidth = oldline;	
	drawPath(c, state.path1, "#00f");
	drawPath(c, state.path2, "#f00");
	c.lineWidth = oldline;	
	c.fillStyle = oldstyle;
}

// Like render2d, but for the settings tab. We just outsource this to the
// widgets library.
simulation.renderSettings = function(state, c, w, h) {
	renderWidgets(state.settingsWidgets, c, state);
}
