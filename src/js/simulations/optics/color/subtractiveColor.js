var simulation_name = "Subtractive Color Mixing";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "";
    
// Represents a field step
var ColorCircle = function(p, col, rad) {
	this.pos = p;
	this.color = col;
	this.radius = rad;
}

function init_state(state) {
	state.colors = [];
	state.colors.push(new ColorCircle(new Vector(-10, 0, 0), 'rgba(0,0,255,.5)', 10));
	state.colors.push(new ColorCircle(new Vector(0, 0, 0), 'rgba(255,255,0,.5)', 10));
	state.colors.push(new ColorCircle(new Vector(-5,10,0), 'rgba(255,0,0,.5)', 10));
	state.mouseMovePos = new Vector(0, 0, 0);
	state.mouseMoveIndex = 0;
	state.mouseDown = false;
	return state;
}
simulation.state = init_state(simulation.state);


simulation.step = function(state) {
	return state;
}

simulation.render2d = function(state, c, w, h) {
	for(var i = 0; i < state.colors.length; i++) {
		c.beginPath();
		c.arc(state.colors[i].pos.data[0], state.colors[i].pos.data[1], state.colors[i].radius, 0, 2*Math.PI, false);
		c.fillStyle = state.colors[i].color;
		c.fill();
	}
}

simulation.tabs["Simulation"].mouseDown = function(x, y, state, ev) {
	for(var i = 0; i < state.colors.length; i++) {
		if((Math.pow(x-state.colors[i].pos.data[0], 2) + Math.pow(y-state.colors[i].pos.data[1], 2)) <= Math.pow(state.colors[i].radius, 2)) {
			state.mouseDown = true;
			state.mouseMovePos = new Vector(x-state.colors[i].pos.data[0], y-state.colors[i].pos.data[1], 0);
			state.mouseMoveIndex = i;
			return state;
		}
	}
	return state;
}

simulation.tabs["Simulation"].mouseMove = function(x, y, state, ev) {
	if(state.mouseDown) {
		state.colors[state.mouseMoveIndex].pos = subV(new Vector(x, y, 0), state.mouseMovePos);
	}
	return state;
}

simulation.tabs["Simulation"].mouseUp = function(x, y, state, ev) {
	if(state.mouseDown) {
		state.mouseDown = false;
	}
	return state;
}