function Vector() {
        this.data = [];
        for(var i=0; i<arguments.length; i++) {
                this.data[i] = arguments[i];
        }
        this.doForeach = function (f) {
                for(var i=0; i<this.data.length; i++) {
                        this.data[i] = f(this.data[i]);
                }
                return this;
        }
        this.foreach = function (f) {
                var n = new Vector();
                n.data = this.data.slice();
                n.doForeach(f);
                return n;
        }
        this.doScale = function (f) {
                return this.doForeach(function (x) {
                        return x*f;
                });
        }
        this.scale = function (f) {
                var n = new Vector();
                n.data = this.data.slice();
                return n.doScale(f);
        }
        this.toString = function() { return this.data.toString(); }
}

function vBO(f) {
        return function (a,b) {
                if(a.data.length != b.data.length) {
                        return undefined;
                }
                var len = a.data.length;
                var v = new Vector();
                v.data = a.data.slice();
                for(var i=0; i<len; i++) {
                        v.data[i] = f(v.data[i], b.data[i]);
                }
                return v;
        }
}

var addv = vBO(function (a,b) {
	return a+b;
});
var subv = vBO(function (a,b) {
	return a-b;
});

