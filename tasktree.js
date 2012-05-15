
var $window = $(window),
		$document = $(document),
		$body = $(document.body);

function NodeSystem(options){
	var NS = this;
	NS.options = $.extend({
		systemParams: {},
		renderer: 'default',
		renderOptions: {}
	}, options || {});
	NS.sys = arbor.ParticleSystem(NS.options.systemParams);
	if(NS.options.renderer == 'default') NS.renderer = new NS.defaultRenderer(NS.options.renderOptions);
	
	$window.on('resize', NS.resize);
}

NodeSystem.prototype.defaultRenderer = function(options){
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
	}, options || {})
	Renderer.context = Renderer.options.$elem[0].getContext('2d');
	console.log(Renderer.context);
}



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