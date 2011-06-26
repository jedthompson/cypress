var simulation_name = "Charged Particle in a Magnetic Field";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "Charged particle in a magnetic field simulation";

function init_state(state) {
	state.pos = new Vector(20,0,0);
	state.vel = new Vector(0, -20, 0);
	state.charge = 1;
	state.mass = 1;
	state.BField = new Vector(0, 0, 1);
	
	//TODO Add checks to make sure variables are valid
	
	
	//state.acc = state.charge*state.BField*vLen(state.vel)/state.mass;
	
	
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	var acc = (crossV(state.vel, state.BField)).scale(state.charge/state.mass);
	state.vel = addV(state.vel, (acc.scale(.001*simulation.dt)));
	state.pos = addV(state.pos, addV(state.vel.scale(.001*simulation.dt), acc.scale(.5*Math.pow(.001*simulation.dt, 2))));
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.drawImage(window.images["particle-red"], state.pos.data[0], state.pos.data[1], 8, 8);
}








/*var addv = vBO(add);
var subv = vBO(sub);

function begin_simulation() {
	var charge = 0.02;
	var pos = new Vector(150,150);
	var vel = new Vector(0.2, 0);
	run_simulation();

	function run_simulation() {
		// really, just a hack around step() to avoid cluttering step with setTimeout
		step();
		setTimeout(run_simulation, 20);
	}

	function step() {
		// calculate the force vector
		var force = vel.scale(charge); // TODO take the magnetic field into account
		force = new Vector(-force.data[1], force.data[0]);
		// update velocity
		vel = addv(vel, force);
		// update position
		pos = addv(pos, vel);
		
		// draw the particle
		var c = document.getElementById("c");
		var gc = c.getContext("2d");
		gc.clearRect(0, 0, c.width, c.height);
		gc.fillRect(pos.data[0]-3, pos.data[1]-3, 6, 6);

		// draw the force vector
		gc.beginPath();
		gc.moveTo(pos.data[0], pos.data[1]);
		gc.lineTo(pos.data[0] + force.data[0]*3000, pos.data[1] + force.data[1]*3000);
		gc.stroke();
	}

}*/

