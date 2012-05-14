var $canvas = $('canvas'),
		ctx = $canvas[0].getContext('2d'),
		sys = arbor.ParticleSystem({
			precision: 0,
			replusion: 2000
		}),
		width, height,
		bgnd = new Color({r: 0, g: 0, b: 0, a: 0.05}),
		bgndString = bgnd.toRGBAString();

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

$(document).on('click', function(e){
	addConnectedNode(e.clientX, e.clientY);
});

function addConnectedNode(x, y){
	nodes.push(
		sys.addNode(
			'p' + new Date().getTime(),
			{
				x: x,
				y: y,
				mass: (Math.random() * 100) + 10,
				color: new Color().randomize()
			}
		)
	);
	var i = 0, len = nodes.length - 1,
			toNode = nodes[len], fromNode, length, color;
	while(i < len){
		fromNode = nodes[i];
		length = compareArrays(fromNode.data.color.toArray(), toNode.data.color.toArray(), 1);
		color = fromNode.data.color.averageWith(toNode.data.color);
		edges.push( sys.addEdge(fromNode, toNode, { length: length , color: color }) );
		i++;
	}
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

$(document).on('ready', function(){ networkN(50); })