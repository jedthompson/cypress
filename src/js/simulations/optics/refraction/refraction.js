var simulation_name = "Refraction";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "TODO Description";

function init_state(state) {
	state.phiIncD = 30;
	state.n1 = 1;
	state.n2 = 2.4;
	state.beamWidth = 6; //Vertical component
	state.xVel = 10;
	
	state.phiIncR = state.phiIncD*Math.PI/180;
	state.phiRefR = Math.asin(state.n1*Math.sin(state.phiIncR)/(state.n2));
	
	state.path = [];
	state.path[0] = new Vector(-50, Math.sin(state.phiIncR)*50);
	state.path[1] = new Vector(0, 0);
	state.path[2] = new Vector(state.path[0].data[0], state.path[0].data[1]);
	
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.path[2].data[0] += state.xVel*.001*simulation.dt;
	if(state.path[2].data[0] < state.path[1].data[0]) {
		state.path[2].data[1] = Math.sin(state.phiIncR)*(-state.path[2].data[0]);
	} else {
		state.path[2].data[1] = Math.sin(-state.phiRefR)*state.path[2].data[0];
	}
	
	if(state.path[2].data[0] > 70) {
		state = init_state(state);
	}
	
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.beginPath();
	c.moveTo(0, -h/2);
	c.lineTo(0, h/2);
	c.strokeStyle="#000";
	c.stroke();
	
	c.strokeStyle='red';
	c.beginPath();
	c.moveTo(state.path[0].data[0], state.path[0].data[1] + state.beamWidth/2);
	if(state.path[2].data[0] > state.path[1].data[0]) {
		c.lineTo(state.path[1].data[0], state.path[1].data[1] + state.beamWidth/2);
		c.lineTo(state.path[2].data[0], state.path[2].data[1] + state.beamWidth/2);
	} else {
		c.lineTo(state.path[2].data[0], state.path[2].data[1] + state.beamWidth/2);
	}
	c.moveTo(state.path[0].data[0], state.path[0].data[1] - state.beamWidth/2);
	if(state.path[2].data[0] > state.path[1].data[0]) {
		c.lineTo(state.path[1].data[0], state.path[1].data[1] - state.beamWidth/2);
		c.lineTo(state.path[2].data[0], state.path[2].data[1] - state.beamWidth/2);
	} else {
		c.lineTo(state.path[2].data[0], state.path[2].data[1] - state.beamWidth/2);
	}
	c.stroke();
	c.moveTo(state.path[0].data[0], state.path[0].data[1]);
	if(state.path[2].data[0] > state.path[1].data[0]) {
		c.lineTo(state.path[1].data[0], state.path[1].data[1]);
		c.lineTo(state.path[2].data[0], state.path[2].data[1]);
	} else {
		c.lineTo(state.path[2].data[0], state.path[2].data[1]);
	}
	c.stroke();
	
	
}
