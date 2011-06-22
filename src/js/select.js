function select_simulation() {
	var sim = document.location.search.slice(1);
	var script = document.createElement('script');
	script.setAttribute('src',"../js/simulations/"+sim+".js");
	script.onload = function() {
		if (typeof simulation_name == 'undefined') {
			document.getElementById("content").innerHTML
				="Could not load simulation";
			return;
		} else {
			alert("Loaded");
		}
	}
	document.getElementsByTagName("head")[0].appendChild(script);
}

