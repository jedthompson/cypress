function Simulation(name) {
	this.name = name;
	this.description = "Simulation: "+name;
	this.canvas = null;
	this.context = null;

	// the space in milliseconds between invocations of 'step'
	this.dt = 20;

	this.state = {
		settings: {},
	}

	this.step = function(state) {
		return state;
	}
	this.render2d = null;
	this.render3d = null;

	this.renderSimulation = function (s, c, w, h) {
		this.render2d(s, c, w, h);
	}
	this.renderDescription = function (s, c, w, h) {
		// just clear the canvas to expose the description
		c.clearRect(-w/2, -h/2, w/2, h/2);
	}
	this.renderSettings = function(s, c, w, h) {

	}

	this.tabs = {
		Simulation: this.renderSimulation.bind(this),
		Description: this.renderDescription.bind(this),
		Settings: this.renderSettings.bind(this),
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
		this.state = this.step(this.state);
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.fillStyle='white';
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.fillStyle='black';

		c = this.context;
		w = this.width;
		h = this.height;
		c.save();
		this.context.lineWidth=0.4;
		c.translate(w/2, h/2);
		sf = (w>h)?(h/100):(w/100);
		c.scale(sf,sf);
		this.tabs[this.currentTab](this.state, c, w/sf, h/sf);
		c.restore();
	}
}

