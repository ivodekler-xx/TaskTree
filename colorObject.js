function Color(options){
	this.construct(options);
}

(function(){
	this.construct = function(options){ $.extend(this, $.extend({ r: 0, g: 0, b: 0, a: 1 }, options || {} )); };
	this.invert = function(){ var i = ['r', 'g', 'b'], index; for(index in i){ this[i[index]] = 255 - this[i[index]]; } return this };
	this.randomize = function(){ console.log('randomizer called'); var i = ['r', 'g', 'b'], index; for(index in i){ this[i[index]] = Math.floor(Math.random() * 256 ); } return this; }
	this.toArray = function(){ return [this.r, this.g, this.b, this.a ]}
	this.toRGBString = function(){ return 'rgb(' + [this.r, this.g, this.b].join(',') + ')'; }
	this.toRGBAString = function(){ return 'rgba(' + [this.r, this.g, this.b, this.a].join(',') + ')'; }
	this.toJSON = function(){ return this.toRGBAString(); };
	this.averageWith = function(colors){
		if(colors instanceof Color) colors = [colors];
		var newColor = new Color({r: this.r, g: this.g, b: this.b }), length = colors.length + 1,
				i = ['r', 'g', 'b', 'a'],  index, cIndex
		for(cIndex in colors){ for(index in i){ newColor[i[index]] = colors[cIndex][i[index]]; } }
		for(index in i){ newColor[i[index]] = Math.floor( newColor[i[index]] / length ); }
		return newColor;
	}
}).call(Color.prototype);