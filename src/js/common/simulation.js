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
	this.renderSettings = null;

	this.renderSimulation = function (s, c, w, h) {
		if (this.render2d != null) {
			this.render2d(s, c, w, h);
		}
	}
	this.renderDescription = function (s, c, w, h) {
		// just clear the canvas to expose the description
		c.clearRect(-w, -h, w*2, h*2);
	}
	this._renderSettings = function(s, c, w, h) {
		if (this.renderSettings != null) {
			this.renderSettings(s, c, w, h);
		}
	}

	this.tabs = {
		Description: this.renderDescription.bind(this),
		Simulation: this.renderSimulation.bind(this),
		Settings: this._renderSettings.bind(this),
	}

	this.currentTab = "Simulation";

	this.addTab = function(name, render) {
		this.tabs[name] = render.bind(this);
	}

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
		c.scale(sf,-sf);
		this.tabs[this.currentTab](this.state, c, w/sf, h/sf);
		c.restore();
	}
	
	this.getWidth = function () {
		var sf = Math.min(this.height/100, this.width/100);
		return this.width/sf;
	}
	
	this.getHeight = function () {
 		var sf = Math.min(this.height/100, this.width/100);
		return this.height/sf;
	}

	// register mouse listeners
	var canvas = this.canvas;
	function mouseDownListener() {

	}
	this.mouseDownListener = mouseDownListener.bind(this);

	function mouseUpListener() {

	}
	
	function mouseMoveListener() {

	}
}

