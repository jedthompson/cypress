var simulation_name = "Gold Foil Experiment";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "This simulation models the famous experiment performed by Rutherford that gave us our first idea of a nucleus.  Alpha particles (helium nuclei with a positive charge) were fired at a very thin piece of gold foil, with the expectation that they would easily penetrate the weak material, and indeed most of them did.  But a few alpha particles ricocheted back, having come near the extremely positive nucleus of the gold atom.  The fact that only a few bounced back indicates how small the nucleus really is compared to the rest of the atom.";
    
// Represents a field step
var Charge = function(p, v) {
	this.pos = p;
	this.vel = v;
}

simulation.init_state = function(state) {
	state.nucPos = new Vector(0, 0, 0);
	state.nucVel = new Vector(0, 0, 0);
	state.nucMass = 1;
	state.nucCharge = 79;
	state.alphaCharge = 2;
	state.alphaMass = 1;
	state.initAlphaVel = new Vector(25, 0, 0);
	
	state.nucRad = 2;
	state.alphaRad = 1;
	
	state.history = [];
	for(var i = 0; i < 360/10; i++) {
		state.history[i] = 0;
	}
	
	state.charges = [];
	
	state.t = 0;
	return state;
}
simulation.state = simulation.init_state(simulation.state);

function getForce(x, y, state) {
	var dirVect = new Vector(x-state.nucPos.data[0], y-state.nucPos.data[1], 0);
	force = dirVect.scale(state.nucCharge*state.alphaCharge/Math.pow(magV(dirVect),3));
	return force;
}

simulation.step = function(state) {
	state.t++;
	if(state.t%2==0) {
		var y = Math.random()*50-25;
		state.charges.push(new Charge(new Vector(-simulation.getWidth()/2, y, 0), state.initAlphaVel));
	}
	for(var i = 0; i < state.charges.length; i++) {
		var acc = getForce(state.charges[i].pos.data[0], state.charges[i].pos.data[1], state).scale(1/state.alphaMass);
		state.charges[i].vel = addV(state.charges[i].vel, acc.scale(.001*simulation.dt));
		state.charges[i].pos = addV(state.charges[i].pos, state.charges[i].vel.scale(.001*simulation.dt));
		if(state.charges[i].pos.data[0] > simulation.getWidth() || state.charges[i].pos.data[0] < -simulation.getWidth() || state.charges[i].pos.data[1] > simulation.getHeight() || state.charges[i].pos.data[1] < -simulation.getHeight()) {
			var theta = Math.atan2(state.charges[i].vel.data[1], state.charges[i].vel.data[0]);
			state.history[Math.floor(theta*180/Math.PI/10+18)]++;
			state.charges.splice(i, 1);
		}
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	
	c.beginPath();
	c.arc(state.nucPos.data[0], state.nucPos.data[1], state.nucRad, 0, 2*Math.PI, false);
	c.strokeStyle = "#000";
	c.stroke();
	
	c.strokeStyle = "#f00";
	for(var i = 0; i < state.charges.length; i++) {
		c.beginPath();
		c.arc(state.charges[i].pos.data[0], state.charges[i].pos.data[1], state.alphaRad, 0, 2*Math.PI, false);
		c.stroke();
	}
}

simulation.renderGraph = function(state, c, w, h) {
	var arr = [];
	for(var i = 0; i < 360/10; i++) {
		var v = new Vector(i, state.history[i]);
		arr.push(v);
	}
	drawGraph(new Vector(-40, -40), new Vector(40, 40), c, arr, true, "#000", 17, 20);
}

simulation.addTab("Graph", simulation.renderGraph);

