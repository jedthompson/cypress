Writing Simulations
===================

Overview
--------

All simulations must have at least four components: an initial state, a `step`
function, a `render2d` function, and an entry in simulations.xml.

The state (`simulation.state`) is an arbitrary value stored in the simulation
object. For most simulations, it will be an object of its own. The initial
state is set like so:

	simulation.state = {
		text: "Hello, world!",
		value: 1
	}

The simulation's `step` takes the current state and returns a new one to
replace it.

	simulation.step = function(state) {
		state.value++;
		return state;
	}

Finally, `render2d` is called (after `step`) to draw the graphics for a state
to the screen. It will take 4 arguments: the current state, a 2D graphics
drawing context, the width of the screen, and the height of the screen. Nothing
should be assumed about the width and the height, except that the smallest of
the two will be measured as exactly 100 units. (Simulations may, however,
safely only regard the central 100x100 square as the drawing area, ignoring
everything else.) The `render2d` show below will draw a line that gets longer
as time goes on.

	simulation.render2d = function(state, c, w, h) {
		c.beginPath();
		c.moveTo(0,0);
		for (var i=0; i<state.value; i++) {
			c.lineTo(0, i/10);
		}
		c.stroke();
	}

The `render2d` function should consider the drawing space to be addressed by
standard cartesian coordinates (rather than more conventional systems centered
on the upper-left-hand corner).

### Hello, world!

In full, our simulation looks like this:

	var simulation_name = "Hello, world!";
	var simulation = new Simulation(simulation_name);
	simulation.description = "Hello world simulation";

	simulation.state = {
		text: "Hello, world!",
		value: 1
	}

	simulation.step = function(state) {
		state.value++;
		return state;
	}

	simulation.render2d = function(state, c, w, h) {
		c.beginPath();
		c.moveTo(0,0);
		for (var i=0; i<state.value; i++) {
			c.lineTo(0, i/10);
		}
		c.stroke();
	}

Displaying Images
-----------------

Images are accessible through the `window.images` object, and are drawn with
`context.image`. (Note that this is not the same function as
`context.drawImage`. The former is a wrapper around the latter to orient the
images properly.)

	c.image(window.images["particle-red"], xpos, ypos, width, height);

Images are defined in `src/js/platform.js`. Different images may be served
according to the client platform - in general, the simulation should not be
concerned with what platform it is running on.

Other Tricks
------------

If you intend to reset the simulation at some point, either by a button or after a certain length of time, you may want to create a function `init_state` that takes a state variable and sets it to the desired initial state, returning the result. This can then be used to create the simulation's initial state as well:

	function init_state(state) {
		state.text = "Hello, world!";
		state.value = 1;
	}
	simulation.state = init_state(simulation.state);

### Adding Tabs

The list of tabs at the bottom is not static - it is accessible via the `simulation.tabs` variable. In most cases, you will simply want to add a tab - for this, use `simulation.addTab` (which handles various scoping problems nicely).

	simulation.renderGraph = function(state, c, w, h) {
		// do some drawing here
	}
	simulation.addTab('Graph', simulation.renderGraph);

### Changing the Framerate

For various reasons, you may wish for `step` and `renderX` to run moreor less
frequently. This behaviour is controlled by `simulation.dt`, which sets the
number of milliseconds in between calls to `step`. Values above `50` will tend
to be noticably jumpy; values too far below `20` may cause inconsistent
behaviour (thanks to multiple calls to `step` taking place at once).

