var simulation_name = "Constant Acceleration due to Gravity";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "In this demonstration, one can see that even though an object may have horizontal speed, the acceleration due to gravity will remain the same as if it had no horizontal speed and thus it will fall just as fast as a ball released from rest.";

simulation.init_state = function(state) {
	state.pos1 = new Vector(-40, 40, 0);
	state.pos2 = new Vector(-40, 40, 0);
	state.vel1 = new Vector(0, 0, 0);
	state.vel2 = new Vector(20, 0, 0);
	state.g = new Vector(0, -9.8, 0);
	state.t = 0;
	
	//TODO Implement value checks
	
	state.history1 = {};
	state.history2 = {};
	
	state.history1[state.t] = state.pos1;
	state.history2[state.t] = state.pos2;
	return state;
}
simulation.state = simulation.init_state(simulation.state);

simulation.step = function(state) {
	state.t++;
	state.vel1 = addV(state.vel1, state.g.scale(.001*simulation.dt));
	state.vel2 = addV(state.vel2, state.g.scale(.001*simulation.dt));
	state.pos1 = addV(state.pos1, state.vel1.scale(.001*simulation.dt));
	state.pos2 = addV(state.pos2, state.vel2.scale(.001*simulation.dt));
	state.history1[state.t] = state.pos1;
	state.history2[state.t] = state.pos2;
	
	if(state.pos1.data[1] < -100) {
		state = simulation.init_state(state);
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.strokeStyle = "#000";
	
	//Draw Mass 1
	c.beginPath();
	c.arc(state.history1[state.t].data[0], state.history1[state.t].data[1], 3, 0, 2*Math.PI, false);
	c.closePath();
	c.stroke();
	
	//Draw Mass 2
	c.beginPath();
	c.arc(state.history2[state.t].data[0], state.history2[state.t].data[1], 3, 0, 2*Math.PI, false);
	c.closePath();
	c.stroke();
	
	c.beginPath();
	c.moveTo(state.history1[0].data[0], state.history1[0].data[1]);
	for (var i = 1; i <= state.t; i++) {
		c.lineTo(state.history1[i].data[0], state.history1[i].data[1]); 
	}
	c.stroke();
	
	c.beginPath();
	c.moveTo(state.history2[0].data[0], state.history2[0].data[1]);
	for (var i = 1; i <= state.t; i++) {
		c.lineTo(state.history2[i].data[0], state.history2[i].data[1]); 
	}
	c.stroke();
	
	for(var i = 0; i <= state.t; i += 20) {
		c.beginPath();
		c.arc(state.history1[i].data[0], state.history1[i].data[1], 3, 0, 2*Math.PI, false);
		c.closePath();
		c.stroke();
		
		c.beginPath();
		c.arc(state.history2[i].data[0], state.history2[i].data[1], 3, 0, 2*Math.PI, false);
		c.closePath();
		c.stroke();
		
		c.beginPath();
		c.moveTo(state.history1[i].data[0], state.history1[i].data[1]);
		c.lineTo(state.history2[i].data[0], state.history2[i].data[1]);
		c.stroke();
	}
}