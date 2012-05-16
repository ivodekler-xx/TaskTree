var nodes = [], edges = [],
		System = new NodeSystem();


if(confirm('init?')){
	var hoi = new NodeSystem({
		repulsion: 100	
	});
	
	$(document).on('click', function(e){
		addConnectedNode(e.clientX, e.clientY);
	});
	
	function addConnectedNode(x, y){
		var node = new Node( System, {
			x: x,
			y: y,
			mass: (Math.random() * 100) + 10,
			color: new Color().randomize(),
			render: function(p, renderer){
				var ctx = renderer.ctx;
				ctx.beginPath();
				ctx.arc(p.x, p.y, Math.sqrt(this.mass), 0, 2*Math.PI, true);
				ctx.closePath();
				ctx.fillStyle = this.color ? this.color.toRGBAString() : renderer.fill ? renderer.fill.toRGBAString() : renderer.bgnd.invert().toRGBAString();
				ctx.fill();
			}
		});
		nodes.push(node);
		
		$window.trigger('NodeCreated', node);
		var i = 0, len = nodes.length - 1, newEdges = [],
				toNode = nodes[len], fromNode, length, color;
		while(i < len){
			fromNode = nodes[i];
			length = compareArrays(fromNode.color.toArray(), toNode.color.toArray(), 1);
			//console.log(length);
			color = fromNode.color.averageWith(toNode.color);
			var edge = new Edge(System, fromNode._ref, toNode._ref, { length: length , color: color , render: function(){} });
			newEdges.push(edge)
			edges.push(edge);
			i++;
		}
		$window.trigger('EdgeCreated', newEdges);
	}
	
	var $canvas = System.renderer.$canvas,
			width = System.renderer.ctx.canvas.width,
			height = System.renderer.ctx.canvas.height;
	
	function networkN(n){
		var x = Math.floor(System.renderer.ctx.canvas.width / 2), y = Math.floor(System.renderer.ctx.canvas.height / 2);
		addConnectedNode(x, y);
		setTimeout(function(){
			var i = 0;
			while(i < n){
				setTimeout(function(){ addConnectedNode(x, y); }, i);
				i++;
			}
		}, 100);
	}
	
	$(document).on('ready', function(){
		networkN(Math.ceil(Math.random()*25));
		var amt = 0;
		setInterval(function(){
			amt++;
			var fps = System.sys.fps();
			$('#fps').html(fps);
			if(amt%2 && fps > 4) addConnectedNode(Math.floor(width/2),Math.floor(height/2));
		}, 1000);
		setTimeout(function(){
			if($('#fps').html() == 'Infinity') location.reload();
		}, 100);
	});
	
	$canvas.on('click', function(e){
		//console.log(e.ctrlKey);
	});
	
	$window.on('NodeCreated', function(){
		$('#numNodes').html(nodes.length);
	});
	
	$window.on('EdgeCreated', function(){
		$('#numEdges').html(edges.length);
	});
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