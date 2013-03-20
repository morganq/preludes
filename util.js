define([], function() { 
	Array.prototype.each = function(cb) {
		for(var i = 0; i < this.length; i++) {
			cb(this[i], i);
		}
	};
	Array.prototype.map = function(cb) {
		var ret = []
		for(var i = 0; i < this.length; i++) {
			ret.push(cb(this[i], i));
		}
		return ret;
	};
	Array.prototype.extend = function(other) {
		this.push.apply(this, other);
	};
	return {};
});
