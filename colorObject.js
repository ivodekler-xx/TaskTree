function Color(options){
	this.options = $.extend({
		r: 0,
		g: 0,
		b: 0,
		a: 1
	}, options || {});
}

Color.prototype.randomize = function(){
	this.options.r = Math.floor(Math.random() * 256);
	this.options.g = Math.floor(Math.random() * 256);
	this.options.b = Math.floor(Math.random() * 256);
	return this;
}

Color.prototype.invert = function(){
	return new Color({r: 255 - this.options.r, g: 255 - this.options.g, b: 255 - this.options.b });
}

Color.prototype.toRGBString = function(){
	return 'rgb(' + [this.options.r, this.options.g, this.options.b].join(',') + ')';
}

Color.prototype.toRGBAString = function(){
	return 'rgba(' + [this.options.r, this.options.g, this.options.b, this.options.a].join(',') + ')';
}

Color.prototype.toArray = function(){ return [this.options.r, this.options.g, this.options.b, this.options.a ]}

Color.prototype.averageWith = function(colors){
	if(colors instanceof Color) colors = [colors];
	var r = this.options.r, g = this.options.g, b = this.options.b, a = this.options.a, length = colors.length + 1, index;
	for(index in colors){
		r += colors[index].options.r;
		g += colors[index].options.g;
		b += colors[index].options.b;
		a += colors[index].options.a;
	}
	return new Color({r: Math.floor(r/length), g: Math.floor(g/length), b: Math.floor(b/length), a: Math.floor(a/length) });
}

function compareArrays(arr1, arr2, power){
	if(!power) power = 1;
	var returnVal = 0, i = 0, len = arr1.length;
	while(i < len){
		returnVal += Math.pow(Math.max(arr1[i], arr2[i]) - Math.min(arr1[i], arr2[i]), power);
		i++;
	}
	return returnVal;
}

Color.prototype.toJSON = function(){ return this.toRGBAString(); }