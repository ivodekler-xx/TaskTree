function Color(options){
	$.extend(this, $.extend({
		r: 0,
		g: 0,
		b: 0,
		a: 1
	}, options || {}));
}

Color.prototype.randomize = function(){
	this.r = Math.floor(Math.random() * 256);
	this.g = Math.floor(Math.random() * 256);
	this.b = Math.floor(Math.random() * 256);
	return this;
}

Color.prototype.invert = function(){
	return new Color({r: 255 - this.r, g: 255 - this.g, b: 255 - this.b });
}

Color.prototype.toRGBString = function(){
	return 'rgb(' + [this.r, this.g, this.b].join(',') + ')';
}

Color.prototype.toRGBAString = function(){
	return 'rgba(' + [this.r, this.g, this.b, this.a].join(',') + ')';
}

Color.prototype.toArray = function(){ return [this.r, this.g, this.b, this.a ]}

Color.prototype.averageWith = function(colors){
	if(colors instanceof Color) colors = [colors];
	var r = this.r, g = this.g, b = this.b, a = this.a, length = colors.length + 1, index;
	for(index in colors){
		r += colors[index].r;
		g += colors[index].g;
		b += colors[index].b;
		a += colors[index].a;
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