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
	this.rendergl = null;
	this.renderSettings = null;
	this.mouseDown = null;

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
		canvas.addEventListener('mousedown', mouseDownListener.bind(this), false);
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
	function mouseDownListener(ev) {
		//TODO Check if belongs to any widget
		if (this.mouseDown != null) {
			w = this.width;
			h = this.height;
			sf = (w>h)?(h/100):(w/100);
			var absX = ev.clientX - this.canvas.offsetLeft;
			var absY = ev.clientY - this.canvas.offsetTop;
			var x = absX/sf;
			var y = absY/sf;
			x = x-w/(2*sf);
			y = -(y-h/(2*sf));
			//alert("x is " + x + "\ny is " + y);
			this.state = this.mouseDown(x, y, this.state, ev, this.canvas);
		}
	}
	//this.mouseDownListener = mouseDownListener.bind(this);

	function mouseUpListener(ev) {
		//TODO Check if belongs to any widget
		if (this.mouseUp != null) {
			w = this.width;
			h = this.height;
			sf = (w>h)?(h/100):(w/100);
			var absX = ev.clientX - this.canvas.offsetLeft;
			var absY = ev.clientY - this.canvas.offsetTop;
			var x = absX/sf;
			var y = absY/sf;
			x = x-w/(2*sf);
			y = -(y-h/(2*sf));
			//alert("x is " + x + "\ny is " + y);
			this.state = this.mouseUp(x, y, this.state, ev, this.canvas);
		}
	}
	
	function mouseMoveListener(ev) {
		//TODO Check if belongs to any widget
		if (this.mouseMove != null) {
			w = this.width;
			h = this.height;
			sf = (w>h)?(h/100):(w/100);
			var absX = ev.clientX - this.canvas.offsetLeft;
			var absY = ev.clientY - this.canvas.offsetTop;
			var x = absX/sf;
			var y = absY/sf;
			x = x-w/(2*sf);
			y = -(y-h/(2*sf));
			//alert("x is " + x + "\ny is " + y);
			this.state = this.mouseMove(x, y, this.state, ev, this.canvas);
		}
	}
}

