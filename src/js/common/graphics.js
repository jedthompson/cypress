function vector2dTowards(c, v1, v2, len) {
	x1 = v1.data[0];
	x2 = v2.data[0];
	y1 = v1.data[1];
	y2 = v2.data[1];

	sx = x1;
	sy = y1;
	prop = len / dist(v1, v2);
	dx = x1 + (x2 - x1)*prop;
	dy = y1 + (y2 - y1)*prop;
	c.beginPath();
	c.moveTo(sx, sy);
	c.lineTo(dx, dy);
	c.closePath();
	c.stroke();
}

//Angle measured COUNTERCLOCKWISE from positive x-axis
//Angle is in DEGREES
function vector2dAtAngle(xStart, yStart, length, angle, context) {
	var x1=xStart;
	var y1=yStart;
	var len=length;
	var phi=(360-angle)*2*Math.PI/360;
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
	ctx.strokeStyle="#000";
	ctx.stroke();
}

function getImage(src) {
	img = new Image();
	img.src = "../gr/"+src;
	return img;
}

