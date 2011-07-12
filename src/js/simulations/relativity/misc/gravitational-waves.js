var simulation_name = "Gravitational Waves";
var simulation = new Simulation(simulation_name);

simulation.dt = 50;

function GWave(f, r) {
	this.r = r;
	this.f = f;
}

simulation.init_state = function(state) {
	state.t = 0;
	state.p1 = new Vector(-10, 0, 0);
	state.p2 = new Vector( 10, 0, 0);

	state.waves = [];

	state.field = new Array(60);
	for (var i=0; i<state.field.length; i++) {
		state.field[i] = new Array(state.field.length);
	}
	return state;
}
simulation.state = simulation.init_state(simulation.state);

simulation.step = function(state) {
	state.t += 1;

	if (state.t > 400)
		state = simulation.init_state(state);

	state.p1.data[0] = Math.sin(state.t/30)*10;
	state.p1.data[1] = Math.cos(state.t/30)*10;
	state.p2.data[0] = Math.sin(Math.PI+state.t/30)*10;
	state.p2.data[1] = Math.cos(Math.PI+state.t/30)*10;

	gw1 = new GWave(state.p1.copy(), 0);
	gw2 = new GWave(state.p2.copy(), 0);
	if (state.t%2 == 1) {
		state.waves.push(gw1);
		state.waves.push(gw2);
	}
	
	for (var i=0; i<state.waves.length; i++) {
		state.waves[i].r += 0.1;
	}

	var l = state.field.length;
	for (var x=0; x<l; x++) {
		for (var y=0; y<l; y++) {
			state.field[x][y] = 0;
		}
	}

	for (var i=0; i<state.waves.length; i++) {
		var w = state.waves[i];
		for (var theta=0; theta<Math.PI*2; theta+=Math.PI/(20*w.r)) {
			var x = w.r/10*Math.cos(theta)*l/4 + w.f.data[0]/2;
			var y = w.r/10*Math.sin(theta)*l/4 + w.f.data[1]/2;
			x = Math.round(x);
			y = Math.round(y);
			if (x+l/2 < l && y+l/2 < l && x+l/2>=0 && y+l/2 >=0)
				state.field[x+l/2][y+l/2] += 1 / Math.pow(w.r, 2);
		}
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	var p1 = state.p1;
	var p2 = state.p2;
	c.fillCircle(p1.data[0], p1.data[1], 2);
	c.fillCircle(p2.data[0], p2.data[1], 2);

	var ws = state.waves;
	var l = state.field.length;
	for (var x=-l/2; x<l/2; x++) {
		for (var y=-l/2; y<l/2; y++) {
			//c.fillCircle(x*2, y*2, Math.log(state.field[x+l/2][y+l/2]+1));
			c.fillStyle = "rgba(0, 0, 0, "+Math.log(state.field[x+l/2][y+l/2]+1)/2+")";
			c.fillCircle(x*2, y*2, 0.5);
		}
	}
}

