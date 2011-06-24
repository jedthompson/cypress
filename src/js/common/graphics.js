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

function getImage(src) {
	img = new Image();
	img.src = "../gr/"+src;
	return img;
}

