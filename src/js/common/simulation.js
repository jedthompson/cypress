function Simulation(name, description) {
	this.name = name;
	this.description = description;
	this.canvas = null;

	this.start = function() {
		if (this.canvas == null) {
			alert("Error!");
		}
		canvas = this.canvas;
		width = canvas.width;
		height = canvas.height;
		c = canvas.getContext("2d");

		c.fillRect(0,0,width,height);
	}
}

