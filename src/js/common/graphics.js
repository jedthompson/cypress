CanvasRenderingContext2D.prototype.text = function(t, x, y) {
	xt = x;
	yt = y;
	this.save();
	this.translate(xt, yt);
	this.scale(1, -1);
	this.scale(100/_w, 100/_h);
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

//Angle measured COUNTERCLOCKWISE from positive x-axis
//Angle is in DEGREES
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

function drawHistogram(xLowLeft, yLowLeft, width, height, context, arrayOfVectors, shouldDrawAxes, color) {
	if(!color) {
		color = "#000";
	}
	
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
}

function drawPath(context, arrayOfAbsolutePositionVectors, color) {
	if(!color) {color="#000";}
	drawHistogram(0, 0, 100, 100, context, arrayOfAbsolutePositionVectors, false, color);
}

function drawGraph(lowerLeft, upperRight, context, arrayOfVectors, shouldDrawBox, color) {
	if(!shouldDrawBox) {
		shouldDrawBox = false;
	}
	if(!color) {
		color = "#000";
	}
	
	var oriX = lowerLeft.data[0];
	var oriY = lowerLeft.data[1];
	if(oriX > upperRight.data[0]) {
		oriX = upperRight.data[0];
	}
	if(oriY > upperRight.data[1]) {
		oriY = upperRight.data[1];
	}
	
	if(!arrayOfVectors) {
		throw "drawGraph: No array of vectors given";
	}
	var arrX = sortVectorArrayByX(arrayOfVectors);
	var arrY = sortVectorArrayByY(arrayOfVectors);
	
	var sfx = Math.abs(lowerLeft.data[0]-upperRight.data[0])/(arrX[arrX.length-1].data[0]-arrX[0].data[0]);
	var sfy = Math.abs(lowerLeft.data[1]-upperRight.data[1])/(arrY[arrY.length-1].data[1]-arrY[0].data[1]);
	
	context.save();
		
	if(shouldDrawBox) {
		context.beginPath();
		context.moveTo(lowerLeft.data[0], lowerLeft.data[1]);
		context.lineTo(lowerLeft.data[0], upperRight.data[1]);
		context.lineTo(upperRight.data[0], upperRight.data[1]);
		context.lineTo(upperRight.data[0], lowerLeft.data[1]);
		context.lineTo(lowerLeft.data[0], lowerLeft.data[1]);
		context.stroke();
	}
	
	context.strokeStyle = color;
	
	context.beginPath();
	context.moveTo(oriX, oriY+(arrX[0].data[1]-arrY[0].data[1])*sfy);
	for(var i = 1; i < arrX.length; i++) {
		context.lineTo(oriX+(arrX[i].data[0]-arrX[0].data[0])*sfx, oriY+(arrX[i].data[1]-arrY[0].data[1])*sfy);
	}
	context.stroke();
	
	
	context.restore();
	
}

function getImage(src) {
	img = new Image();
	img.src = "../gr/"+src;
	return img;
}

