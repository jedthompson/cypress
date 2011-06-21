function curry(fn) {
        var slice = Array.prototype.slice;
        var args = slice.apply(arguments, [1]);
        return function () {
                return fn.apply(null, args.concat(slice.apply(arguments)));
        };
}

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
        // TODO function to scale a vector (doScale & scale)
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

function add(a, b) {
        return a+b;
}

function sub(a, b) {
        return a-b;
}

var addv = vBO(add);
var subv = vBO(sub);
