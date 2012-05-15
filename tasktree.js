
var $window = $(window),
		$document = $(document),
		$body = $(document.body);

function NodeSystem(options){
	this.init.call(this, options);
}

NodeSystem.prototype.init = function(options){
	var NS = this;
	NS.options = $.extend({
		systemParams: {},
		renderer: 'default',
		renderOptions: {}
	}, options || {});
	NS.sys = arbor.ParticleSystem(NS.options.systemParams);
	console.log(NS);
	if(NS.options.renderer == 'default') NS.renderer = new NS.defaultRenderer(NS.options.renderOptions, NS);
	
	$window.on('resize', NS.resize);
}

var defaultRenderer = NodeSystem.prototype.defaultRenderer = function(options, NS){
	this.construct.call(this, options, NS);
}

defaultRenderer.prototype.preFrame = function(){ console.log('preFrame'); };
defaultRenderer.prototype.inBetween = function(){ console.log('inBetween'); };
defaultRenderer.prototype.postFrame = function(){ console.log('postFrame'); };

defaultRenderer.prototype.nodeHandler = function(){
	this.NS.sys.eachNode(function(node, pt){ node.render() });
};

defaultRenderer.prototype.edgeHandler = function(edge, pt1, pt2 ){ this.NS.sys.eachEdge(function(edge, pt1, pt2){ edge.render(pt1, pt2) }); };

defaultRenderer.prototype.init = function(){ this.ctx.save(); };
defaultRenderer.prototype.redraw = function(){
	var exports = {};
	this.preFrame.call(this, exports);
	if(this.nodesFirst){
		this.nodeHandler.call(this, exports);
		if(this.inBetween) this.inBetween.call(this, exports);
		this.edgesHandler.call(this, exports);
	}
	else{
		this.edgeHandler.call(this, exports);
		if(this.inBetween) this.inBetween.call(this, exports);
		this.nodeHandler.call(this, exports);
	}
	this.postFrame.call(this, exports);
	return exports;
};

defaultRenderer.prototype.construct = function(options, NS){
	var Renderer = this;
	Renderer.options = $.extend({
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
		})()
	}, options || {});
	
	Renderer.context = Renderer.options.$elem[0].getContext('2d');
	Renderer.ctx = Renderer.context;
	Renderer.NS = NS;
	Renderer.NS.sys.renderer = this;
};



/*
var $canvas = $('canvas'),
		ctx = $canvas[0].getContext('2d'),
		sys = arbor.ParticleSystem({
			precision: 0,
			replusion: 2000
		}),
		width, height,
		bgnd = new Color({r: 0, g: 0, b: 0, a: 0.05}),
		bgndString = bgnd.toRGBAString(),
		$window = $(window),
		framesRendered = 0;

function resize(){
	width = $canvas.parent().width();
	height = $canvas.parent().height();
	$canvas.attr('width', width).attr('height', height);
}

var Node = function(){
	this.x;
	this.y;
}

$(window).on('resize', resize);
resize();

var myRenderer = {
	init: function(){
		ctx.lineWidth = 1;
		ctx.fillStyle = bgnd.toRGBString();
		ctx.fillRect(0,0,width,height);
	},
	redraw: function(){
		ctx.save();
		//ctx.clearRect(0,0, width, height);
		ctx.fillStyle = bgndString;
		ctx.fillRect(0,0,width,height);
		
    sys.eachEdge(function(edge, pt1, pt2){
			ctx.beginPath();
			ctx.moveTo(pt1.x, pt1.y);
			ctx.lineTo(pt2.x, pt2.y);
			
			ctx.strokeStyle = edge.data.color.toRGBString();
			ctx.stroke();
		});
		
		sys.eachNode(function(node, pt){
			ctx.beginPath();
			ctx.arc(pt.x, pt.y, Math.sqrt(node.mass), 0, 2*Math.PI, true);
			ctx.closePath();
			
			ctx.fillStyle = node.data.color.toRGBString();
			ctx.fill();
		});
		ctx.restore()
	}
}

sys.renderer = myRenderer;

var nodes = [], edges = [];
*/
var $window = $(window);

$window.on('NodeCreated', function(){
	$('#numNodes').html(nodes.length);
});

$window.on('EdgeCreated', function(){
	$('#numEdges').html(edges.length);
});