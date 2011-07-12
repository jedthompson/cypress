var simulation_name = "Ballistic Motion";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;   //time in milliseconds, which means 20ms per "tick"
simulation.description="Here, one can observe that gravity only affects the y component of the velocity and that the x component remains constant.  One can also see that gravity always induces a parabolic trajectory in a launched particle.";

// constructor here
function init_state(state) {
	state.pos = new Vector(-40,-40); // define position, start at -40,-40
	state.initpos = new Vector(-40,-40); // won't change
	state.vel = new Vector(10,30); // x and y components of velocity
	state.acc = new Vector(0,-9.8); //accel in x and y directions
	
	state.patha = [];
	state.t = 0;
	state.patha[0] = state.initpos;

	return state;
}

// initialize the simulation state
simulation.state = init_state(simulation.state);

// set the simulation step method to this function.  you update the "state" here
simulation.step = function(state) {
	state.vel = addV(state.vel,state.acc.scale(.001*simulation.dt));//scale does not change the 
	//value of the acc vector. to change the acc itself use doScale instead of scale
	state.pos = addV(state.pos,state.vel.scale(.001*simulation.dt));//rescale
	
	state.t++;
	state.patha[state.t] = new Vector(state.pos.data[0],state.pos.data[1]);
	
	
	if(state.pos.data[1] < state.initpos.data[1]) {
		state = init_state(state);
	}
	
	return state;
}

// render2d is called after the step method at every "tick"
// c is the context, or pointer to the context that allows you to draw on the canvas
// w and h are "width" and "height" of the screen, passed TO this code so everything
// can scale by w and h and you don't have to know the exact height and width in pixels
//
simulation.render2d = function(state, c, w, h) {
	c.beginPath();
	c.arc(state.pos.data[0],state.pos.data[1],1,0,2*Math.PI,false);
	c.stroke();

	c.beginPath();
	c.arc(state.pos.data[0], state.initpos.data[1],1,0,2*Math.PI,false);
	c.stroke();
	
	c.beginPath();
	c.arc(state.initpos.data[0],state.pos.data[1],1,0,2*Math.PI,false);
	c.stroke();
	
	var a = new Vector(state.vel.data[0], 0);
	var b = new Vector(0, state.vel.data[1]);
	
	drawVector(state.pos.data[0], state.initpos.data[1], a, c);
	drawVector(state.initpos.data[0], state.pos.data[1], b, c);
	
	/*c.beginPath();
	c.moveTo(state.initpos.data[0], state.pos.data[1]);
	c.lineTo(state.pos.data[0], state.pos.data[1]);
	c.lineTo(state.pos.data[0], state.initpos.data[1]);
	c.stroke();*/
	
	
	drawPath(c, state.patha, "#000");
}

