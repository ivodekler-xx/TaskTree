var $canvas = $('canvas'),
		ctx = $canvas[0].getContext('2d'),
		sys = arbor.ParticleSystem({
			precision: 0,
			repulsion: 10000000,
			stiffness: 0,
			friction: 0
		}),
		width, height,
		bgnd = new Color({r: 0, g: 0, b: 0, a: 0.00}),
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
		ctx.lineCap = 'round';
		//ctx.fillStyle = new Color({r: 255, g: 255, b: 255}).toRGBString();
		//ctx.fillRect(0,0,width,height);
	},
	redraw: function(){
		ctx.save();
		//ctx.clearRect(0,0, width, height);
		//ctx.fillStyle = bgndString;
		//ctx.fillRect(0,0,width,height);
		
		/*
    sys.eachEdge(function(edge, pt1, pt2){
			ctx.beginPath();
			ctx.moveTo(pt1.x, pt1.y);
			ctx.lineTo(pt2.x, pt2.y);
			
			var actualLength = Math.sqrt( Math.pow( Math.abs(pt1.x - pt1.x), 2 ) + Math.pow( Math.abs(pt1.y - pt2.y), 2) );
			
			edge.data.ratio = Math.max(edge.length, actualLength) / Math.min(edge.length, actualLength);
			
			ctx.lineWidth = Math.max(1, Math.pow(edge.data.ratio, .3) * 2);
			ctx.strokeStyle = edge.data.color.toRGBString();
			ctx.stroke();
		});*/
		
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