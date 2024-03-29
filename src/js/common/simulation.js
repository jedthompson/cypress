/**
 * Represents a single simulation, presented to the user as a multi-tabbed
 * page.
 *
 * \param name The name of this simulation.
 */
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
	this.rendergl = null;
	this.renderSettings = null;
	this.mouseDown = null;

	this.renderSimulation = function (s, c, w, h) {
		if (this.render2d != null) {
			c.font = "20pt arial";
			this.render2d(s, c, w, h);
		}
	}
	this.renderSimulation3d = function (s, c, w, h) {
		this.render3d(s, this.gl, w, h);
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
		if (this.render3d != null) {
			// try to set up webgl
			this.gl = null;
			if (window.WebGLRenderingContext)
				try {
					var glcanvas = document.getElementById("glcanvas");
					this.gl = glcanvas.getContext("experimental-webgl");
				} catch (e) {}
			if (this.gl != null) {
				// use 3d rendering
				this.renderSimulation = this.renderSimulation3d;
			} else {
			}
		}

		this.context = canvas.getContext("2d");
		canvas.addEventListener('mousedown', mouseDownListener.bind(this), false);
		canvas.addEventListener('mouseup', mouseUpListener.bind(this), false);
		canvas.addEventListener('mousemove', mouseMoveListener.bind(this), false);
		canvas.addEventListener('mouseover', function() {curElem = false;}, false);
		if(this.setup != null) {
			state = this.setup(this.state);
		}
		_w = this.width;
		_h = this.height;

		canvas2 = this.canvas2;
		canvas2.addEventListener('mousedown', mouseDownListener2.bind(this), false);
		canvas2.addEventListener('mouseup', mouseUpListener2.bind(this), false);
		canvas2.addEventListener('mousemove', mouseMoveListener2.bind(this), false);
		canvas2.addEventListener('mouseover', function() {curElem = true;}, false);
		this.context2 = canvas2.getContext("2d");

		this.run();
	}

	// recursive function to run step() and render()
	this.run = function () {
		setTimeout(this.run.bind(this), this.dt);
		if (!this.paused)
			this.state = this.step(this.state);

		w = this.width;
		h = this.height;
		_w = w;
		_h = h;
		sf = (w>h)?(h/100):(w/100);
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.fillStyle='white';
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.fillStyle='black';
		this.context.width = w;
		this.context.height = h;
		this.context.sf = sf;

		c = this.context;
		c.save();
		this.context.lineWidth=0.4;
		c.translate(w/2, h/2);
		c.scale(sf,-sf);
		if(sim.doubleTab) {
			this.tabs["Simulation"](this.state, c, w/sf, h/sf);
		} else
			this.tabs[this.currentTab](this.state, c, w/sf, h/sf);
		c.restore();
		
		if(sim.doubleTab) {
			// render the second tab
			c2 = this.context2;
			var w = this.canvas2.width;
			var h = this.canvas2.height;
			var _w = w;
			var _h = h;
			c2.width = w;
			c2.height = h;
			sf = (w>h)?(h/100):(w/100);
			c2.sf = sf;
			c2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
			c2.fillStyle='white';
			c2.fillRect(0, 0, this.canvas2.width, this.canvas2.height);
			c2.fillStyle='black';
			
			c2.save();
			this.context2.lineWidth=0.4;
			c2.translate(w/2, h/2);
			c2.scale(sf,-sf);
			this.tabs[this.currentTab](this.state, c2, w/sf, h/sf);
			c2.restore();
		}
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

	this.callMouseFunc = function(f, ev) {
		if (!curElem)
			elem = this.canvas;
		else
			elem = this.canvas2;
		w = elem.width;
		h = elem.height;
		sf = (w>h)?(h/100):(w/100);
		var absX = ev.clientX - elem.offsetLeft;
		var absY = ev.clientY - elem.offsetTop;
		var x = (absX - w/2)/sf;
		var y = -absY/sf + h/sf/2;
		this.state = f(x, y, this.state, ev, elem);
	}

	function mouseDownListener(ev) {
		if (this.mouseDown != null)
			this.callMouseFunc(this.mouseDown,ev);
		if(!sim.doubleTab && this.tabs[this.currentTab].mouseDown != null)
			this.callMouseFunc(this.tabs[this.currentTab].mouseDown, ev);
		else if(this.tabs["Simulation"].mouseDown != null)
			this.callMouseFunc(this.tabs["Simulation"].mouseDown, ev);
	}

	function mouseUpListener(ev) {
		if (this.mouseUp != null)
			this.callMouseFunc(this.mouseUp,ev);
		if(!sim.doubleTab && this.tabs[this.currentTab].mouseUp != null)
			this.callMouseFunc(this.tabs[this.currentTab].mouseUp, ev);
		else if(this.tabs["Simulation"].mouseUp != null)
			this.callMouseFunc(this.tabs["Simulation"].mouseUp, ev);
	}
	
	function mouseMoveListener(ev) {
		if (this.mouseMove != null)
			this.callMouseFunc(this.mouseMove,ev);
		if(!sim.doubleTab && this.tabs[this.currentTab].mouseMove != null)
			this.callMouseFunc(this.tabs[this.currentTab].mouseMove, ev);
		else if(this.tabs["Simulation"].mouseMove != null)
			this.callMouseFunc(this.tabs["Simulation"].mouseMove, ev);
	}

	function mouseDownListener2(ev) {
		if (this.mouseDown != null)
			this.callMouseFunc(this.mouseDown,ev);
		if(this.tabs[this.currentTab].mouseDown != null)
			this.callMouseFunc(this.tabs[this.currentTab].mouseDown, ev);
	}
	//this.mouseDownListener = mouseDownListener.bind(this);

	function mouseUpListener2(ev) {
		if (this.mouseUp != null)
			this.callMouseFunc(this.mouseUp,ev);
		if(this.tabs[this.currentTab].mouseUp != null)
			this.callMouseFunc(this.tabs[this.currentTab].mouseUp, ev);
	}
	
	function mouseMoveListener2(ev) {
		if (this.mouseMove != null)
			this.callMouseFunc(this.mouseMove,ev);
		if(this.tabs[this.currentTab].mouseMove != null)
			this.callMouseFunc(this.tabs[this.currentTab].mouseMove, ev);
	}
}

