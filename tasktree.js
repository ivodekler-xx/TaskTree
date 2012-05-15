var $canvas = $('canvas'),
		ctx = $canvas[0].getContext('2d'),
		sys = arbor.ParticleSystem({
			precision: 5,
			repulsion: 1,
			stiffness: 100,
			friction: 0.2
		}),
		width, height,
		bgnd = new Color({r: 0, g: 0, b: 0, a: 0.01}),
		bgndString = bgnd.toRGBAString(),
		$window = $(window),
		framesRendered = 0;

function resize(){
	width = $canvas.parent().width();
	height = $canvas.parent().height();
	$canvas.attr('width', width).attr('height', height);
}

$(window).on('resize', resize);
resize();

var myRenderer = {
	init: function(){
		ctx.lineWidth = 1;
		ctx.fillStyle = new Color({r: 255, g: 255, b: 255}).toRGBString();
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

$(document).on('click', function(e){
	addConnectedNode(e.clientX, e.clientY);
});

function addConnectedNode(x, y){
	var node = sys.addNode(
		'p' + new Date().getTime(),
		{
			x: x,
			y: y,
			mass: (Math.random() * 100) + 10,
			color: new Color().randomize()
		}
	);
	nodes.push(node);
	
	$window.trigger('NodeCreated', node);
	var i = 0, len = nodes.length - 1, newEdges = [],
			toNode = nodes[len], fromNode, length, color;
	while(i < len){
		fromNode = nodes[i];
		length = compareArrays(fromNode.data.color.toArray(), toNode.data.color.toArray(), 1);
		color = fromNode.data.color.averageWith(toNode.data.color);
		var edge = sys.addEdge(fromNode, toNode, { length: length , color: color });
		newEdges.push(edge)
		edges.push(edge);
		i++;
	}
	$window.trigger('EdgeCreated', newEdges);
}

function networkN(n){
	var x = Math.floor(width/2), y = Math.floor(height/2);
	addConnectedNode(x, y);
	setTimeout(function(){
		var i = 0;
		while(i < n){
			setTimeout(function(){ addConnectedNode(x, y); }, i);
			i++;
		}
	}, 100);
}

function Family(options){
	this.options = $.extend({
		maxSize: 50,
		
	}, options || {});
	this.nodes = [];
	this.edges = [];
}

Family.prototype.spawn = function(node){
	
}

$(document).on('readyo', function(){
	networkN(Math.ceil(Math.random()*25));
	var amt = 0;
	setInterval(function(){
		amt++;
		var fps = sys.fps();
		$('#fps').html(fps);
		if(amt%2 && fps > 8) addConnectedNode(Math.floor(width/2),Math.floor(height/2));
	}, 1000);
	setTimeout(function(){
		if($('#fps').html() == 'Infinity') location.reload();
	}, 100);
});

$canvas.on('click', function(e){
	console.log(e.ctrlKey);
});

$window.on('NodeCreated', function(){
	$('#numNodes').html(nodes.length);
});

$window.on('EdgeCreated', function(){
	$('#numEdges').html(edges.length);
});