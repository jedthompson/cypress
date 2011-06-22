function Simulation(name) {
	this.name = name;
	this.description = "Simulation: "+name;
	this.canvas = null;
	this.context = null;

	// the space in milliseconds between invocations of 'step'
	this.dt = 20;

	this.settings = {};
	this.state = null;
	this.step = function(settings, state) {
		return state;
	}
	this.render2d = null;
	this.render3d = null;

	this.renderSimulation = function(s, c, w, h) {
		this.render2d(s, c, w, h)
	}
	this.renderDescription = function() {
		// TODO this should probably use some library
	}
	this.renderSettings = function() {

	}

	this.tabs = {
		Simulation: this.renderSimulation,
		Description: this.renderDescription,
		Settings: this.renderSettings,
	}

	this.currentTab = "Simulation";

	this.start = function() {
		if (this.canvas == null) {
			alert("Error!");
		}
		canvas = this.canvas;
		this.context = canvas.getContext("2d");
		this.run();
	}

	// recursive function to run step() and render()
	this.run = function () {
		setTimeout(this.run.bind(this), this.dt);
		this.state = this.step(this.settings, this.state);
		this.renderSimulation(
			this.state,
			this.context,
			this.canvas.width, this.canvas.height);
	}
}

