function curry(fn) {
        var slice = Array.prototype.slice;
        var args = slice.apply(arguments, [1]);
        return function () {
                return fn.apply(null, args.concat(slice.apply(arguments)));
        };
}

// Performs binary search, on the assumption that p(v) is false on the left and
// true on the right.
function binarySearch(p, d, s, e) {
	v = (s+e)/2;
	dist = (e-s)/4;
	for (i=0; i<d; i++) {
		if (p(v)) // move to the left
			v -= dist;
		else // move to the right
			v += dist;
		dist /= 2;
	}
	return v;
}

//TODO Replace with better sort algorithm (probably quicksort)
function sortVectorArrayByX(arr) {
	var array = sortVectorArrayByDimension(arr, 0);
	return array;
}

function sortVectorArrayByY(arr) {
	var array = sortVectorArrayByDimension(arr, 1);
	return array;
}

function sortVectorArrayByDimension(arr, num) {
	var array = arr.slice();
	for(var x = 0; x < array.length; x++) {
    	for(var y = 0; y < (array.length-1); y++) {
    		if(array[y].data[num] > array[y+1].data[num]) {
    			temp = array[y+1];
    			array[y+1] = array[y];
    			array[y] = temp;
      		}
    	}
  	}
	return array;
}

function round(n, d) {
	return Math.round(n * Math.pow(10, d)) / Math.pow(10,d);
}

