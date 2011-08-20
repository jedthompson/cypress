var simulation_name = "Bowling Ball and Tennis Ball";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description="TODO Description";

simulation.init_state = function(state) {
	state.mass1 = 5;
	state.mass2 = 1;
	state.curPos1 = new Vector(0, 20, 0);
	state.vel1 = new Vector(0, 0, 0);
	state.vel2 = new Vector(0, 0, 0);
	state.ballRad1 = 4;
	state.ballRad2 = 1;
	
	//TODO Check values to make sure they are acceptable
	
	state.curPos2 = new Vector(state.curPos1.data[0], state.curPos1.data[1] + state.ballRad1 + state.ballRad2, state.curPos1.data[2]);
	
	//state.initPos1 = state.curPos1;
	//state.initPos2 = state.curPos2;
	
	state.g = new Vector(0, -9.8, 0);
	state.bottomLevel = -40;
	state.hasCollisionHappened = false;
	
	return state;
}

simulation.state = simulation.init_state(simulation.state);

doCollision = function(state) {
	var e1 = .5 * state.mass1 * Math.pow(magV(state.vel1), 2);
	var e2 = .5 * state.mass2 * Math.pow(magV(state.vel2), 2);
	
	var yVel1 = Math.pow(e2/(.5*state.mass1), .5);
	var yVel2 = Math.pow(e1/(.5*state.mass2), .5);
	
	state.vel1.data[1] = yVel1;
	state.vel2.data[1] = yVel2;
	
	state.hasCollisionHappened = true;
	return state;
}

simulation.step = function(state) {
	state.vel1 = addV(state.vel1, state.g.scale(simulation.dt*.001));
	state.vel2 = addV(state.vel2, state.g.scale(simulation.dt*.001));
	state.curPos1 = addV(state.curPos1, state.vel1.scale(simulation.dt*.001));
	state.curPos2 = addV(state.curPos2, state.vel2.scale(simulation.dt*.001));
	if((state.curPos1.data[1] - state.ballRad1) < state.bottomLevel && !state.hasCollisionHappened) {
		state = doCollision(state);
	}else if(state.hasCollisionHappened && state.curPos2.data[1] > 80) {
		state = simulation.init_state(state);
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.strokeStyle="#000";
	c.drawCircle(state.curPos1.data[0], state.curPos1.data[1], state.ballRad1);
	c.drawCircle(state.curPos2.data[0], state.curPos2.data[1], state.ballRad2);
	
	c.beginPath();
	c.moveTo(-w/2, state.bottomLevel);
	c.lineTo(w/2, state.bottomLevel);
	c.stroke();
}

