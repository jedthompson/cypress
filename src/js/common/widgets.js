function Widget(x, y, width, height, dataLoc, render, listener) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.dataLoc = dataLoc;
	this.render = render;
	this.listener = listener;
	//this.device = device;
}

/**
 * Handles widget interaction for mouseDown events.
 * 
 * @param xpos The x position of the mouseDown event
 * @param ypos The y position of the mouseDown event
 * @param state A state function that pertains to the individual simulation
 * @param evnt The mouseDown event
 * @param widgets An array of widgets which the mouseDown could possibly affect.  (Likely all the widgets on a given tab)
 * 
 * @return A modified state with any changes performed by the various widgets
 */
function handleMouseDown(xpos, ypos, state, evnt, widgets) {
	for(var i = 0; i < widgets.length; i++) {
		state = widgets[i].listener.mouseDown(xpos, ypos, state, evnt);
	}
	return state;
}

/**
 * Handles widget interaction for mouseUp events.
 * 
 * @param xpos The x position of the mouseUp event
 * @param ypos The y position of the mouseUp event
 * @param state A state function that pertains to the individual simulation
 * @param evnt The mouseUp event
 * @param widgets An array of widgets which the mouseUp could possibly affect.  (Likely all the widgets on a given tab)
 * 
 * @return A modified state with any changes performed by the various widgets
 */
function handleMouseUp(xpos, ypos, state, evnt, widgets) {
	for(var i = 0; i < widgets.length; i++) {
		state = widgets[i].listener.mouseUp(xpos, ypos, state, evnt);
	}
	return state;
}

/**
 * Handles widget interaction for mouseMove events.
 * 
 * @param xpos The x position of the mouseMove event
 * @param ypos The y position of the mouseMove event
 * @param state A state function that pertains to the individual simulation
 * @param evnt The mouseMove event
 * @param widgets An array of widgets which the mouseMove could possibly affect.  (Likely all the widgets on a given tab)
 * 
 * @return A modified state with any changes performed by the various widgets
 */
function handleMouseMove(xpos, ypos, state, evnt, widgets) {
	for(var i = 0; i < widgets.length; i++) {
		state = widgets[i].listener.mouseMove(xpos, ypos, state, evnt);
	}
	return state;
}

/**
 * Generates default widget handler code.  This default code can be overriden by defining simulation.tabs[tab].mouseMove, etc.
 * 
 * @param simulation A simulation object
 * @param tab A string representing the tab to generate the handler code for
 * @param widgetArray An array of widgets representing what widgets could be affected by a mouseEvent on the given tab
 */
function generateDefaultWidgetHandler(simulation, tab, widgetArray) {
	simulation.tabs[tab].mouseMoveDefault = function(x, y, state, ev) {
		state = handleMouseMove(x, y, state, ev, widgetArray);
		return state;
	}
	
	simulation.tabs[tab].mouseUpDefault = function(x, y, state, ev) {
		state = handleMouseUp(x, y, state, ev, widgetArray);
		return state;
	}
	
	simulation.tabs[tab].mouseDownDefault = function(x, y, state, ev) {
		state = handleMouseDown(x, y, state, ev, widgetArray);
		return state;
	}
	
	simulation.tabs[tab].mouseMove = function(x, y, state, ev) {
		state = simulation.tabs[tab].mouseMoveDefault(x, y, state, ev);
		return state;
	}
	
	simulation.tabs[tab].mouseUp = function(x, y, state, ev) {
		state = simulation.tabs[tab].mouseUpDefault(x, y, state, ev);
		return state;
	}
	
	simulation.tabs[tab].mouseDown = function(x, y, state, ev) {
		state = simulation.tabs[tab].mouseDownDefault(x, y, state, ev);
		return state;
	}
}


/**
 * Renders the list of widgets provided.
 * 
 * @param widgets An array of widgets to render
 * @param context The context to draw the rendered widgets on
 * @param state The current state of the simulation
 */
function renderWidgets(widgets, context, state) {
	for(var i = 0; i < widgets.length; i++) {
		widgets[i].render(context, state);
	}
}

/**
 * A very basic UI element that allows for smooth changing of a single value.
 * 
 * @param x the x-coordinate of the upper-left point
 * @param y the y-coordinate of the upper-left point
 * @param width the width of the slider
 * @param height the height of the slier (NOTE: This is meaningless for fixed-height sliders like the iOS slider, but is included to preserve symmetry between UI elements)
 * @param dataLoc a string representing where the data for the slider should be stored
 * @param min the minimum value of the slider.  If not provided, defaults to 0.
 * @param max the maximum value of the slider.  If not provided, defaults to 1.
 */
function Slider(x, y, width, height, dataLoc, min, max) {
	var widget;
	var isTracking = false;
	var xTrack = 0;
	this.dataLoc = dataLoc;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	//this.device = _platform;
	if(!min) {
		this.min = 0;
	} else {
		this.min = min;
	}
	if(!max) {
		this.max = 1;
	} else {
		this.max = max;
	}
	this.renderIOS = function(context, state) {
		var xTL = x;
		var yTL = y;
		var len = width;
		var pLen = len*320/100;
		var curPos = state[dataLoc]/(max-min);
		if(curPos > 1) {curPos = 1;}
		if(curPos < 0) {curPos = 0;}
		var ctx = context;
		
		var pXTL = xTL*320/100;
		var pYTL = yTL*320/100;
		var pCurLen = curPos*pLen;

		//TODO Fix graphics code
		//ctx.image(window.images["IOSSliderBlue"], xTL, yTL, curPos*len, 9/4.8, 0, 0, pCurLen, 9);
		ctx.image(window.images["IOSSliderBlue"], 0, 0, pCurLen, 9, xTL, yTL, curPos*len, 9/4.8);
		ctx.image(window.images["IOSSliderWhite"], (480-pLen+pCurLen), 0, pLen-pCurLen, 9, xTL+(curPos*len), yTL, (len-curPos*len), 9/4.8);
		ctx.image(window.images["IOSSliderCenter"], xTL+(curPos*len)-12/4.8, yTL-(7/4.8), 23/4.8, 23/4.8);
	}
	this.renderDefault = function(c, state) {
		var curPos = state[dataLoc]/(max-min)
		if (curPos > 1) {curPos = 1;}
		if (curPos < 0) {curPos = 0;}
		c.beginPath();
		c.moveTo(-width/2, 0);
		c.lineTo(width/2, 0);
		c.stroke();
		c.beginPath();
		c.fillRect(-2 - width/2 + curPos*width, -3, 4, 6);
		c.stroke();
	}

	var listener = {};
	listener.mouseUp = function(xev, yev, state, evnt) {
		if(isTracking) {
			isTracking = false;
		}
		return state;
	}
	listener.mouseDown = function(xev, yev, state, evnt) {
		var curPos = state[dataLoc]/(max-min);
		xTrack = x+width*curPos-xev;
		isTracking = true;
		return state;
	}
	listener.mouseMove = function(xev, yev, state, evnt) {
		if(isTracking) {
			var pos = ((xev+xTrack-x)/width)*(max-min);
			if(pos >= min && pos <= max) {
				state[dataLoc] = pos;
			} else if(pos < min) {
				state[dataLoc] = min;
			} else {
				state[dataLoc] = max;
			}
		}
		return state;
	}
	
	var iOSListener = {};
	iOSListener.mouseUp = function(xev, yev, state, evnt) {
		if(isTracking) {
			isTracking = false;
		}
		return state;
	}
	
	iOSListener.mouseDown = function(xev, yev, state, evnt) {
		var curPos = state[dataLoc]/(max-min);
		var dist = Math.sqrt(Math.pow(x+width*curPos-xev, 2) + Math.pow(y+4.5/4.8-yev, 2));
		if(dist < 11.5/4.8) {
			xTrack = x+width*curPos-xev;
			isTracking = true;
		}
		return state;
	}
	
	iOSListener.mouseMove = function(xev, yev, state, evnt) {
		if(isTracking) {
			var pos = ((xev+xTrack-x)/width)*(max-min);
			if(pos >= min && pos <= max) {
				state[dataLoc] = pos;
			} else if(pos < min) {
				state[dataLoc] = min;
			} else {
				state[dataLoc] = max;
			}
		}
		//state.widgetData[dataLoc] = x;
		return state;
	}
	if(_platform == "iOS") {
		widget = new Widget(x, y, width, height, dataLoc, this.renderIOS.bind(this), iOSListener);
	} else 
		widget = new Widget(x, y, width, height, dataLoc, this.renderDefault.bind(this), listener);
	return widget;
}

