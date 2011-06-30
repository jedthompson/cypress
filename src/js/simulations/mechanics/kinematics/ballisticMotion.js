var simulation_name = "Ballistic Motion";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;   //time in milliseconds, which means 20ms per "tick"
simulation.description="Put a description here";

// constructor here
function init_state(state) {
	state.pos = new Vector(-40,-40); // define position, start at -40,-40
	state.initpos = new Vector(-40,-40); // won't change
	state.vel = new Vector(10,30); // x and y components of velocity
	                                 // remember, no var means it's global
	state.acc = new Vector(0,-9.8); //accel in x and y directions
	
	// path is delta-y vs delta-x 
	/*state.path = [];
	var velratio = state.vel.data[1]/state.vel.data[0];
	var gratio = 0.5*state.acc.data[1]/Math.pow(state.vel.data[0],2);
	for (var i=0; i<100; i++) {
		state.path[i] = (velratio*i)+gratio*i*i;
	}*/
	
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
	
	
	if(state.pos.data[1] < -100) {
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
	
	/*c.beginPath();
	c.moveTo(state.initpos.data[0],state.initpos.data[1]);
	for (var i=1; i<state.path.length; i++) {
		c.lineTo(state.initpos.data[0]+i,state.initpos.data[1]+state.path[i]);
	}
	c.stroke();*/
	
	c.beginPath();
	c.moveTo(state.initpos.data[0],state.initpos.data[1]);
	for (var i=1; i<=state.t; i++) {
		c.lineTo(state.patha[i].data[0],state.patha[i].data[1]);
	}
	c.strokeStyle = "#f00";
	c.stroke();
}

