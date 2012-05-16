var $window = $(window),
		$document = $(document),
		$body = $(document.body);

function NodeSystem(options){
	this.init.call(this, options);
}

$.extend(NodeSystem.prototype, {
	init: function(options){
		var NS = this;
		$.extend(this, $.extend({
			systemParams: {},
			renderer: 'default',
			renderOptions: {}
		}, options || {}));
		NS.sys = arbor.ParticleSystem(NS.systemParams);
		if(NS.renderer == 'default') NS.renderer = new NS.defaultRenderer(NS.renderOptions, NS);
		if(NS.debug) console.log(NS);
		$window.on('resize', NS.resize);
	},
	defaultRenderer: function(options, NS){
		this.construct.call(this, options, NS);
	}
});

$.extend(NodeSystem.prototype.defaultRenderer.prototype, {
	preFrame: function(){ this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height); },
	inBetween: function(){},
	postFrame: function(){},
	nodeHandler: function(){
		var Renderer = this;
		this.NS.sys.eachNode(function(node, pt){ node.data.self.x = pt.x; node.data.self.y = pt.y; node.data.self.render.call(node.data.self, pt, Renderer, node); });
	},
	edgeHandler: function(edge, pt1, pt2 ){
		var Renderer = this;
		this.NS.sys.eachEdge(function(edge, pt1, pt2){ edge.data.self.render.call(edge.data.self, pt1, pt2, Renderer, edge); });
	},
	init: function(){ this.ctx.save(); },
	redraw: function(){
		var exports = {};
		this.preFrame.call(this, exports);
		if(this.nodesFirst){
			this.nodeHandler.call(this, exports);
			this.inBetween.call(this, exports);
			this.edgesHandler.call(this, exports);
		}
		else{
			this.edgeHandler.call(this, exports);
			this.inBetween.call(this, exports);
			this.nodeHandler.call(this, exports);
		}
		this.postFrame.call(this, exports);
		return exports;
	},
	construct: function(options, NS){
		var Renderer = this;
		$.extend(this, $.extend({
			$elem: (function(){
				if(!options.$elem){
					var $canvas = $('canvas');
					if(!$canvas.length){
						$canvas = $('<canvas>')
											.attr({width: $body.width(), height: $body.height() })
											.appendTo(document.body);
					}
					Renderer.$canvas = $canvas;
					return $canvas;
				}
			})(),
			bgnd: new Color({r: 255, g: 255, b: 255}),
			//fill: new Color({r: 127, g: 127, b: 127}),
			stroke:new Color()
		}, options || {}));
		
		this.ctx = this.$elem[0].getContext('2d');
		this.NS = NS;
		this.NS.sys.renderer = this;
	}
});

function Node(options){
	this.construct.call(this, options);
}

Node.prototype.render = function(p, renderer){
	var ctx = renderer.ctx;
	ctx.beginPath();
	ctx.arc(p.x, p.y, /*Math.sqrt*/(this.mass), 0, 2*Math.PI, true);
	ctx.closePath();
	ctx.fillStyle = this.color ? this.color.toRGBAString() : renderer.fill ? renderer.fill.toRGBAString() : renderer.bgnd.invert().toRGBAString();
	ctx.fill();
};

Node.prototype.construct = function(options){
	$.extend(this, $.extend({
		x: 0,
		y: 0,
		mass: 1
	}, options));
}
Node.prototype.remove = function(){
	//need ref to sys here
}

function anotherRenderer(){
	NodeSystem.prototype.defaultRenderer.call(this);
}
$.extend(anotherRenderer.prototype, NodeSystem.prototype.defaultRenderer.prototype);

if(confirm('init?')){
	var n = new Node({mass: 10, x: 200, y: 200 }); var hoi = new NodeSystem({/*renderer: new anotherRenderer(),*/ renderOptions: { bgnd: new Color().randomize() }}); hoi.sys.addNode('n', {x: n.x, y: n.y, self: n});
}

//trying to get inheritance working
var b = function(){
	NodeSystem.call(this);
}

/*
sys.eachEdge(function(edge, pt1, pt2){
	ctx.beginPath();
	ctx.moveTo(pt1.x, pt1.y);
	ctx.lineTo(pt2.x, pt2.y);
	
	ctx.strokeStyle = edge.data.color.toRGBString();
	ctx.stroke();
});

$window.on('NodeCreated', function(){
	$('#numNodes').html(nodes.length);
});

$window.on('EdgeCreated', function(){
	$('#numEdges').html(edges.length);
});
*/