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

function renderWidgets(widgets, context, state) {
	for(var i = 0; i < widgets.length; i++) {
		widgets[i].render(context, state);
	}
}

function slider(x, y, width, height, dataLoc, device) {
	var widget;
	var isTracking = false;
	var xTrack = 0;
	this.dataLoc = dataLoc;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.device = device;
	//PercentFull is given AS A DECIMAL (.5 = 50%)
	renderIOS = function(context, state) {
		var xTL = x;
		var yTL = y;
		var len = width;
		var pLen = len*320/100;
		var curPos = state.widgetData[dataLoc];
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
			var curPos = state.widgetData[dataLoc];
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
				var pos = ((xev+xTrack-x)/width);
				if(pos >= 0 && pos <= 1) {
					state.widgetData[dataLoc] = pos;
				}else if(pos < 0) {
					pos = 0;
				}else {
					pos = 1;
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

