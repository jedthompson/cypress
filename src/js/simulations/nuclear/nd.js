function begin_simulation() {
	var pc = 100;
	var hl = 30; // half-life
	var dc = Math.LN2/hl; // decay constant
	var t = 0;
	var pd = dc; // probability of decay

	// draw the axes
	var c = document.getElementById("c");
	var gc = c.getContext("2d");
	gc.clearRect(0, 0, c.width, c.height);
	gc.beginPath();
	gc.moveTo(20, 20);
	gc.lineTo(20, 280);
	gc.lineTo(280, 280);
	gc.stroke();

	var gd = document.getElementById("d").getContext("2d");
	gd.fillRect(100,100,100,100);
	gd.fillStyle="#ddd";

	// draw the first point
	gc.beginPath();
	gc.moveTo(20, 280-pc*2);

	run_simulation();
	function run_simulation() {
		// really, just a hack around step() to avoid cluttering step with setTimeout
		step();
		setTimeout(run_simulation, 50);
	}

	function step() {
		t++;
		pc = pc*(1-pd);
		gc.lineTo(20+t, 280-pc*2);
		gc.stroke();

		for (var x=0; x<10; x++) {
			for (var y=0; y<10; y++) {
				if (Math.random() < pd) {
					gd.fillRect(100+(10*x), 100+(10*y), 10, 10);
				}
			}
		}
	}

}

