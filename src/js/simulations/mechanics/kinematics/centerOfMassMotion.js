var simulation_name = "Center of Mass Motion";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description="Here, one can see that even though the mass distribution may be irregular and an object may gyrate strangely as it is thrown, the center of mass traces a smooth, parabolic path through space.";

function init_state(state) {
	state.mass1 = 3;
	state.mass2 = 1;
	state.barLen = 10;
	state.g = 9.8;
	state.pos = new Vector(-45, -40, 0);
	state.vel = new Vector(10, 40, 0);
	state.angVel = Math.PI; // In radians/sec
	state.phiM1 = 0; //In radians
	state.t = 0;
	
	if(state.mass1 < .5) {state.mass1 = .5;}
	if(state.mass2 < .5) {state.mass2 = .5;}
	if(state.barLen < (state.mass1+state.mass2)/2) {state.barLen = (state.mass1+state.mass2)/2;}
	if(state.g < 1) {state.g = 1;}
	
	
	//Calculate distance to M1 from center of mass
	var com = state.mass1*state.barLen/(state.mass1+state.mass2);
	state.comToM1 = state.barLen-com;
	
	state.history1 = {};
	state.history2 = {};
	state.historyCM = {};
	
	state.historyCM[state.t] = state.pos;
	state.history1[state.t] = addV(state.pos, (new Vector(state.comToM1*Math.cos(state.phiM1), state.comToM1*Math.sin(state.phiM1), 0)));
	state.history2[state.t] = addV(state.pos, (new Vector((state.barLen-state.comToM1)*Math.cos(Math.PI+state.phiM1), (state.barLen-state.comToM1)*Math.sin(Math.PI+state.phiM1), 0)));
	
	return state;
}

simulation.state = init_state(simulation.state);

function forceG(state) {
	var force = new Vector(0, -1*(state.mass1+state.mass2)*state.g, 0);
	return force;
}

simulation.step = function(state) {
	state.t++;
	var acc = forceG(state).scale(1/(state.mass1+state.mass2));
	state.vel = addV(state.vel, acc.scale(.001*simulation.dt));
	state.pos = addV(state.pos, state.vel.scale(.001*simulation.dt));
	state.phiM1 += state.angVel*.001*simulation.dt;
	
	state.historyCM[state.t] = state.pos;
	state.history1[state.t] = addV(state.pos, (new Vector(state.comToM1*Math.cos(state.phiM1), state.comToM1*Math.sin(state.phiM1), 0)));
	state.history2[state.t] = addV(state.pos, (new Vector((state.barLen-state.comToM1)*Math.cos(Math.PI+state.phiM1), (state.barLen-state.comToM1)*Math.sin(Math.PI+state.phiM1), 0)));
	
	//Wait until 100 to give a short delay
	if(state.pos.data[1] < -100) {
		state = init_state(state);
	}

	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.strokeStyle="#000";
	
	//Draw bar
	c.beginPath();
	c.moveTo(state.history1[state.t].data[0], state.history1[state.t].data[1]);
	c.lineTo(state.history2[state.t].data[0], state.history2[state.t].data[1]);
	c.closePath();
	c.stroke();
	
	//Draw mass 1
	c.beginPath();
	c.arc(state.history1[state.t].data[0], state.history1[state.t].data[1], state.mass1/2, 0, 2*Math.PI, false);
	c.closePath();
	c.stroke();
	
	//Draw mass 2
	c.beginPath();
	c.arc(state.history2[state.t].data[0], state.history2[state.t].data[1], state.mass2/2, 0, 2*Math.PI, false);
	c.closePath();
	c.stroke();
	
	c.beginPath();
	c.moveTo(state.historyCM[0].data[0], state.historyCM[0].data[1]);
	for (var i = 0; i <= state.t; i++) {
		c.lineTo(state.historyCM[i].data[0], state.historyCM[i].data[1]); 
	}
	c.closePath();
	c.stroke();
	
	c.beginPath();
	c.moveTo(state.history1[0].data[0], state.history1[0].data[1]);
	for (var i = 0; i <= state.t; i++) {
		c.lineTo(state.history1[i].data[0], state.history1[i].data[1]); 
	}
	c.closePath();
	c.strokeStyle = "#f00";
	c.stroke();
	
	c.beginPath();
	c.moveTo(state.history2[0].data[0], state.history2[0].data[1]);
	for (var i = 0; i <= state.t; i++) {
		c.lineTo(state.history2[i].data[0], state.history2[i].data[1]); 
	}
	c.closePath();
	c.strokeStyle = "#00f";
	c.stroke();
}

