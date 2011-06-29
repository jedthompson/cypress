var simulation_name = "Diffraction Through a Slit";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "TODO Description";

function init_state(state) {
	state.xPos = [];
	state.t = 0;
	state.distBetWaves = 5; //How often a new wave is created, in units
	state.vel = 10; //Rate at which a wave propagates
	
	state.xPos.push(-50);
	
	state.num = 0;
	
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.t++;
	if(state.xPos[state.num] >= state.distBetWaves-50) {
		state.xPos.push(-50);
		state.num++;
	}
	for(var i = 0; i <= state.num; i++) {
		state.xPos[i] += state.vel*.001*simulation.dt;
		if(state.xPos[0] >= 150) {
			state.xPos = state.xPos.slice(1);
			state.num--;
		}
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.strokeStyle="#000";
	c.beginPath();
	c.moveTo(0, -h/2);
	c.lineTo(0, -1);
	c.moveTo(0, 1);
	c.lineTo(0, h/2);
	c.stroke();
	for(var i = 0; i <= state.num; i++) {
		if(state.xPos[i] <= 0) {
			c.beginPath();
			c.moveTo(state.xPos[i], -h/2);
			c.lineTo(state.xPos[i], h/2);
			c.stroke();
		} else {
			c.beginPath();
			c.arc(0, 0, state.xPos[i], -Math.PI/2, Math.PI/2, false);
			c.closePath();
			c.stroke();
		}
	}
}
