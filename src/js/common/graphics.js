CanvasRenderingContext2D.prototype.text = function(t, x, y) {
	xt = x;
	yt = y;
	this.save();
	this.translate(xt, yt);
	this.scale(1, -1);
	this.scale(1/sf, 1/sf);
	this.translate(-xt, -yt);
	this.fillText(t, x, y);
	this.restore();
}

CanvasRenderingContext2D.prototype.image = function(i, x, y, xd, yd, xdest, ydest, wdest, hdest) {
	if(!hdest) {
		xt = x + xd/2;
		yt = y + yd/2;
		this.save();
		this.translate(xt, yt);
		this.scale(1, -1);
		this.translate(-xt, -yt);
		this.drawImage(i, x, y, xd, yd);
		this.restore();
	} else {
		xt = xdest + wdest/2;
		yt = ydest + hdest/2;
		this.save();
		this.translate(xt, yt);
		this.scale(1, -1);
		this.translate(-xt, -yt);
		this.drawImage(i, x, y, xd, yd, xdest, ydest, wdest, hdest);
		this.restore();
	}
}

CanvasRenderingContext2D.prototype.circle = function(x, y, r) {
	this.arc(x, y, r, 0, Math.PI*2, false);
}

CanvasRenderingContext2D.prototype.drawCircle = function(x, y, r) {
	this.beginPath();
	this.circle(x, y, r);
	this.stroke();
}

CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
	this.beginPath();
	this.circle(x, y, r);
	this.fill();
}

/**
 * Draws a vector from one point towards another.
 * 
 * @param c the context on which to draw the vector
 * @param v1 a vector representing the initial point
 * @param v2 a vector representing the point that the vector is drawn towards
 * @param len a number representing how long the vector should be
 * @param color an optional color for the vector.  If not supplied, defaults to black.
 */
function vector2dTowards(c, v1, v2, len, color) {
	if(!color) {color = "#000";}
	var x1 = v1.data[0];
	var x2 = v2.data[0];
	var y1 = v1.data[1];
	var y2 = v2.data[1];
	var bridgeVec = new Vector(x2-x1, y2-y1);
	var drawVec = bridgeVec.scale(len/magV(bridgeVec));
	drawVector(x1, y1, drawVec, c, color);
}

/**
 * Draws a vector from a starting point with a given magnitude and direction.
 * 
 * @param xStart the starting x-coordinate
 * @param yStart the starting y-coordinate
 * @param length the magnitude of the vector
 * @param angle angular displacement from the positive x-axis, measured counterclockwise in degrees
 * @param context the context on which to draw the vector
 * @param color an optional color for the vector.  If not supplied, defaults to black.
 */
function vector2dAtAngle(xStart, yStart, length, angle, context, color) {
	if (!color)
		color = "#000000";
	var x1=xStart;
	var y1=yStart;
	var len=length;
	var phi=angle*2*Math.PI/360;
	var x2=x1+(len*Math.cos(phi));
	var y2=y1+(len*Math.sin(phi));
	var ctx=context;

	var arrowLength = len/6;
	if(arrowLength > 4) {arrowLength = 4;}
	if(arrowLength < 2) {arrowLength = 2;}

	var xC=x2+arrowLength*(Math.cos(phi-(135*2*Math.PI/360)));
	var yC=y2+arrowLength*(Math.sin(phi-(135*2*Math.PI/360)));
	var xCC=x2+arrowLength*(Math.cos(phi+(135*2*Math.PI/360)));
	var yCC=y2+arrowLength*(Math.sin(phi+(135*2*Math.PI/360)));

	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineTo(xC,yC);
	ctx.moveTo(x2,y2);
	ctx.lineTo(xCC,yCC);
	ctx.closePath();
	var oldcolor = ctx.strokeStyle;
	ctx.strokeStyle=color;
	ctx.stroke();
	ctx.strokeStyle = oldcolor;
}

/**
 * Draws a vector from a given point.
 * 
 * @param xStart the starting x-coordinate of the vector
 * @param yStart the starting y-coordinate of the vector
 * @param vector the vector to draw
 * @param context the context on which to draw the vector
 * @param color an optional color for the vector.  If not supplied, defaults to black.
 */
function drawVector(xStart, yStart, vector, context, color) {
	if(!color) {var color = "#000";}
	if(vector.data.length < 2) {
		throw "drawVector: Too few dimensions (need at least 2)";
	}
	var xDist = vector.data[0];
	var yDist = vector.data[1];
	var length = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	if(yDist != 0 && xDist != 0) {if(xDist > 0) {var phi = Math.atan(yDist/xDist);} else {var phi = Math.PI+Math.atan(yDist/xDist);}}
	else if(yDist == 0) {if(xDist > 0) {var phi = 0;} else {var phi = Math.PI;}}
	else {if(yDist > 0) {var phi = Math.PI*1/2;} else {var phi = -1*Math.PI/2;}}
	vector2dAtAngle(xStart, yStart, length, phi*180/Math.PI, context, color);
}

/**
 * Draws a histogram with a given size.
 * 
 * @param xLowLeft the lower-left x-coordinate of the graph (where x=0)
 * @param yLowLeft the lower-left y-coordinate of the graph (where y=0)
 * @param width the width of the graph
 * @param height the height of the graph
 * @param context the context on which to draw the graph
 * @param arrayOfVectors an array of relative position vectors measured from the origin (0, 0)
 * @param shouldDrawAxes a boolean representing whether or not to draw the axes of the graph
 * @param color an optional color parameter.  If not supplied, defaults to black.
 */
function drawHistogram(xLowLeft, yLowLeft, width, height, context, arrayOfVectors, shouldDrawAxes, color) {
	if(!color) {
		color = "#000";
	}
	
	context.save();
	context.strokeStyle = color;
	
	if(shouldDrawAxes) {
		context.beginPath();
		context.moveTo(xLowLeft, yLowLeft);
		context.lineTo(xLowLeft+width, yLowLeft);
		context.moveTo(xLowLeft, yLowLeft);
		context.lineTo(xLowLeft, yLowLeft+height);
		context.stroke();
	}
	
	context.beginPath();
	context.moveTo(xLowLeft+arrayOfVectors[0].data[0], yLowLeft+arrayOfVectors[0].data[1]);
	for(var i = 1; i < arrayOfVectors.length; i++) {
		context.lineTo(xLowLeft+arrayOfVectors[i].data[0], yLowLeft+arrayOfVectors[i].data[1]);
	}
	context.stroke();
	context.restore();
}

/**
 * Draws a path given an array of absolute position vectors.
 * 
 * @param context the context on which to draw the path.
 * @param arrayOfAbsolutePositionVectors the array of absolute position vectors that defines the path.
 * @param color an optional color for the graph.  If not supplied, defaults to black.
 */
function drawPath(context, arrayOfAbsolutePositionVectors, color) {
	if(!color) {color="#000";}
	drawHistogram(0, 0, 100, 100, context, arrayOfAbsolutePositionVectors, false, color);
}

/**
 * Draws a graph given the corners and an array of vectors.  This function will auto-scale the graph to fit in the size you pass to it.
 * 
 * @param lowerLeft a vector representing the lower left corner of the graph
 * @param upperRight a vector representing the upper right corner of the graph
 * @param context the context on which to draw the graph
 * @param arrayOfVectors an array of vectors representing points on the graph
 * @param shouldDrawBox a boolean representing whether or not to draw the border of the graph.  If not supplied, defaults to false.
 * @param color an optional color for the graph.  If not supplied, defaults to black
 * @param xMin the minimum x value to be displayed on the graph
 * @param xMax the maximum x value to be displayed on the graph
 * @param yMin the minimum y value to be displayed on the graph
 * @param yMax the maximum y value to be displayed on the graph
 * @param shouldDrawAxes a boolean representing whether or not to draw axes.  If not supplied, defaults to false.
 * @param shouldDrawTicks a boolean representing whether or not to draw tickmarks.  If not supplied, defaults to false.
 * @param numTicks the number of tickmarks to display on each axis (They will be evenly spaced.)
 */
function drawGraph(lowerLeft, upperRight, context, arrayOfVectors, shouldDrawBox, color, xMin, xMax, yMin, yMax, shouldDrawAxes, shouldDrawTicks, numTicks) {
	if(!shouldDrawBox) {
		shouldDrawBox = false;
	}
	if(!color) {
		color = "#000";
	}
	if(!shouldDrawAxes) {
		shouldDrawAxes = false;
	}
	if(!shouldDrawTicks) {
		shouldDrawTicks = false;
	}
	if(!numTicks) {
		numTicks = 10;
	}
	
	if(!arrayOfVectors) {
		throw "drawGraph: No array of vectors given";
	}
	var arrX = sortVectorArrayByX(arrayOfVectors);
	var arrY = sortVectorArrayByY(arrayOfVectors);
	
	if(!xMin) {
		xMin = arrX[0].data[0];
	}
	if(!xMax) {
		xMax = arrX[arrX.length-1].data[0];
	}
	if(!yMin) {
		yMin = arrY[0].data[1];
	}
	if(!yMax) {
		yMax = arrY[arrY.length-1].data[1];
	}
	
	var sfx = Math.abs(100)/(xMax-xMin);
	var sfy = Math.abs(95)/(yMax-yMin);
	
	context.save();
	
	var w = context.canvas.width;
	var h = context.canvas.height;
	var sf = (w>h)?(h/100):(w/100);
	
	var newW = upperRight.data[0]-lowerLeft.data[0];
	var newH = upperRight.data[1]-lowerLeft.data[1];
	
	context.translate(lowerLeft.data[0], lowerLeft.data[1]);
	context.scale((newW)/(100), (newH)/(100));
	
		
	if(shouldDrawBox) {
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(0, 100);
		context.lineTo(100, 100);
		context.lineTo(100, 0);
		context.lineTo(0, 0);
		context.stroke();
	}
	
	context.strokeStyle = color;
	
	context.beginPath();
	var hasStarted = false;
	for(var i = 1; i < arrX.length; i++) {
		if((arrX[i].data[0]-xMin)*sfx < 0) {
			continue;
		}else if(!hasStarted) {
			context.moveTo((arrX[i].data[0]-xMin)*sfx, (arrX[i].data[1]-yMin)*sfy);
			hasStarted = true;
			continue;
		}
		if((arrX[i].data[0]-xMin)*sfx > 100) {
			break;
		}
		context.lineTo((arrX[i].data[0]-xMin)*sfx, (arrX[i].data[1]-yMin)*sfy);
	}
	context.stroke();
	
	context.restore();
	
	/*if(!shouldDrawBox) {
		shouldDrawBox = false;
	}
	if(!color) {
		color = "#000";
	}
	if(!shouldDrawAxes) {
		shouldDrawAxes = false;
	}
	if(!shouldDrawTicks) {
		shouldDrawTicks = false;
	}
	if(!numTicks) {
		numTicks = 10;
	}
	
	if(!arrayOfVectors) {
		throw "drawGraph: No array of vectors given";
	}
	var arrX = sortVectorArrayByX(arrayOfVectors);
	var arrY = sortVectorArrayByY(arrayOfVectors);
	
	if(!xMin) {
		xMin = arrX[0].data[0];
	}
	if(!xMax) {
		xMax = arrX[arrX.length-1].data[0];
	}
	if(!yMin) {
		yMin = arrY[0].data[1];
	}
	if(!yMax) {
		yMax = arrY[arrY.length-1].data[1];
	}
	
	var sfx = Math.abs(100)/(xMax-xMin);
	var sfy = Math.abs(95)/(yMax-yMin);
	
	var tempC = clone(context);
	
	context.save();
	
	var w = tempC.canvas.width;
	var h = tempC.canvas.height;
	var sf = (w>h)?(h/100):(w/100);
	
	var newW = upperRight.data[0]-lowerLeft.data[0];
	var newH = upperRight.data[1]-lowerLeft.data[1];
	
	tempC.translate(lowerLeft.data[0], lowerLeft.data[1]);
	tempC.scale((newW)/(100), (newH)/(100));
	
		
	if(shouldDrawBox) {
		tempC.beginPath();
		tempC.moveTo(0, 0);
		tempC.lineTo(0, 100);
		tempC.lineTo(100, 100);
		tempC.lineTo(100, 0);
		tempC.lineTo(0, 0);
		tempC.stroke();
	}
	
	tempC.strokeStyle = color;
	
	tempC.beginPath();
	var hasStarted = false;
	tempC.moveTo((arrX[0].data[0]-xMin)*sfx, (arrX[i].data[1]-yMin)*sfy);
	for(var i = 1; i < arrX.length; i++) {
		if((arrX[i].data[0]-xMin)*sfx < 0) {
			continue;
		}else if(!hasStarted) {
			
			hasStarted = true;
			continue;
		}
		if((arrX[i].data[0]-xMin)*sfx > 100) {
			break;
		}
		context.lineTo((arrX[i].data[0]-xMin)*sfx, (arrX[i].data[1]-yMin)*sfy);
	}
	context.stroke();
	
	context.restore();*/
	
}

/**
 * Retrieves an image from a file.
 * 
 * @param src a string representing the path to the file
 * 
 * @return the image stored in the file
 */
function getImage(src) {
	img = new Image();
	img.src = "../gr/"+src;
	return img;
}

