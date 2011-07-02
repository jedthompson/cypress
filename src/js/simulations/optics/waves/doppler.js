var simulation_name="Doppler Effect";
var simulation = new Simulation(simulation_name);
simulation.dt = 35;
simulation.description = "TODO add description";

// Represents a circular wave
var Wave = function(x, y) {
	this.cx = x;
	this.cy = y;
	this.r = 0;
}

function init_state(state) {
	state.waves = new Array();
	state.timeSinceWave = 0;
	state.freq = 10;
	state.waveSpeed = 0.4;
	state.speed = 0.2;
	state.y = 0;
	state.x = -45;
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.x += state.speed;
	if (state.x > 55)
		return init_state(state);

	state.timeSinceWave++;
	if (state.timeSinceWave >= state.freq) {
		state.timeSinceWave = 0;
		state.waves.push(new Wave(state.x, state.y));
	}

	for (var i=0; i<state.waves.length; i++) {
		state.waves[i].r += state.waveSpeed;
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	// draw the emitter
	c.beginPath();
	c.arc(state.x, state.y, 1.5, 0, 2*Math.PI, false);
	c.stroke();
	c.fill();

	var waves = state.waves;
	for (var i=0; i<waves.length; i++) {
		c.beginPath();
		c.arc(waves[i].cx, waves[i].cy, waves[i].r, -1, 2*Math.PI, false);
		c.stroke();
	}
}

