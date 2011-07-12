function Widget(x, y, width, height, dataLoc, device, render, listener) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.dataLoc = dataLoc;
	this.render = render;
	this.listener = listener;
	this.device = device;
}

function handleMouseDown(xpos, ypos, state, evnt, widgets) {
	for(var i = 0; i < widgets.length; i++) {
		state = widgets[i].listener.mouseDown(xpos, ypos, state, evnt);
	}
	return state;
}

function handleMouseUp(xpos, ypos, state, evnt, widgets) {
	for(var i = 0; i < widgets.length; i++) {
		state = widgets[i].listener.mouseUp(xpos, ypos, state, evnt);
	}
	return state;
}

function handleMouseMove(xpos, ypos, state, evnt, widgets) {
	for(var i = 0; i < widgets.length; i++) {
		state = widgets[i].listener.mouseMove(xpos, ypos, state, evnt);
	}
	return state;
}

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

function renderWidgets(widgets, context, state) {
	for(var i = 0; i < widgets.length; i++) {
		widgets[i].render(context, state);
	}
}

//NOTE: height is meaningless for Slider, it is only included for the sake of standardizing variables among all widgets
function Slider(x, y, width, height, dataLoc, device, min, max) {
	var widget;
	var isTracking = false;
	var xTrack = 0;
	this.dataLoc = dataLoc;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.device = device;
	if(!min) {
		this.min = 0;
	}else {
		this.min = min;
	}
	if(!max) {
		this.max = 1;
	}else {
		this.max = max;
	}
	renderIOS = function(context, state) {
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
	
	var listener = new Object ();
		listener.mouseUp = function(xev, yev, state, evnt) {
			//TODO MouseUp code here
			if(isTracking) {
				isTracking = false;
			}
			return state;
		}
		
		listener.mouseDown = function(xev, yev, state, evnt) {
			//TODO MouseDown code here
			var curPos = state[dataLoc]/(max-min);
			var dist = Math.sqrt(Math.pow(x+width*curPos-xev, 2) + Math.pow(y+4.5/4.8-yev, 2));
			if(dist < 11.5/4.8) {
				xTrack = x+width*curPos-xev;
				isTracking = true;
			}
			return state;
		}
		
		listener.mouseMove = function(xev, yev, state, evnt) {
			//TODO MouseMove code here
			if(isTracking) {
				var pos = ((xev+xTrack-x)/width)*(max-min);
				if(pos >= min && pos <= max) {
					state[dataLoc] = pos;
				}else if(pos < min) {
					state[dataLoc] = min;
				}else {
					state[dataLoc] = max;
				}
			}
			//state.widgetData[dataLoc] = x;
			return state;
		}
	if(device == "IOS") {
		widget = new Widget(x, y, width, height, dataLoc, device, renderIOS, listener);
	}
	return widget;
}

