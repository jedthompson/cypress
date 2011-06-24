var addv = vBO(add);
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

}

