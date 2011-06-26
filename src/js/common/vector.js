// Represents a fixed-length vector.
function Vector() {
        this.data = [];
        for(var i=0; i<arguments.length; i++) {
                this.data[i] = arguments[i];
        }
	// Applies the given function to every element of this vector,
	// returning the result and modifying this object.
	this.doForeach = function (f) {
                for(var i=0; i<this.data.length; i++) {
                        this.data[i] = f(this.data[i]);
                }
                return this;
        }
	// Applies the given function to every element of this vector, and
	// returns the resulting vector. This object is not modified.
	this.foreach = function (f) {
                var n = new Vector();
                n.data = this.data.slice();
                n.doForeach(f);
                return n;
        }
	// Scales all elements in this vector by a given factor, returning the
	// result and modifying this object.
	this.doScale = function (f) {
                return this.doForeach(function (x) {
                        return x*f;
                });
        }
	// Scales all elements in this vector by a given factor, returning the
	// result. This object is not modified.
	this.scale = function (f) {
                var n = new Vector();
                n.data = this.data.slice();
                return n.doScale(f);
        }
        this.toString = function() { return this.data.toString(); }
}

// Convert a binary function into a binary function on vectors, applying the
// operation to each pair of corresponding elements.
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

// Add two vectors.
var addV = vBO(function (a,b) {
	return a+b;
});
// Subtracts the second vector from the first.
var subV = vBO(function (a,b) {
	return a-b;
});

// Compute the length of a vector
function magV(v) {
	len = 0;
	for(var i=0; i<v.data.length; i++) {
		len += Math.pow(v.data[i], 2);
	}
	return Math.sqrt(len);
}

// Take the cross product of two vectors
function crossV(m, n) {
	if(m.data.length != 3 || n.data.length != 3)
		throw "crossV: wrong number of dimensions in vector (target: 3)";
	
	return new Vector(
		(m.data[1]*n.data[2] - m.data[2]*n.data[1]),
		(m.data[2]*n.data[0] - m.data[0]*n.data[2]),
		(m.data[0]*n.data[1] - m.data[1]*n.data[0]));
}

// Compute the distance between two vectors (interpreted as points)
function dist(a, b) {
	return magV(subV(a, b));
}

