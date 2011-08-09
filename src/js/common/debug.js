//
// debug module, pops up new limited function window just for debugging.
// DBG.write(string) to use
//
var DBG = {
	enabled : false,
	write : function(txt){
		if (!this.enabled) return;
		if (!window.dbgwnd) {
			window.dbgwnd = window.open("","debug","status=0,toolbar=0,location=0,menubar=0,directories=0,resizable=0,scrollbars=1,width=600,height=250");
			window.dbgwnd.document.write('<html><head></head><body style="background-color:black"><div id="main" style="color:green;font-size:12px;font-family:Courier New;"></div></body></html>');
		}
		var x = window.dbgwnd.document.getElementById("main");
		this.line=(this.line==null)?1:this.line+=1;
		txt=this.line+': '+txt;
		if (x.innerHTML == "") {
			x.innerHTML = txt;
		}
		else {
			x.innerHTML = txt + "<br/>" + x.innerHTML;
		}
	}
}

