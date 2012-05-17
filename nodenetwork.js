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
			renderOptions: {},
			appendQueue: {nodes: [], edges: [] },
		}, options || {}));
		NS.sys = arbor.ParticleSystem(NS.systemParams);
		if(NS.renderer == 'default') NS.renderer = new NS.defaultRenderer(NS.renderOptions, NS);
		if(NS.debug) console.log(NS);
		$window.on('resize', NS.resize);
	},
	defaultRenderer: function(options, NS){ this.construct.call(this, options, NS); },
	addNodes: function(){
		for(var index in arguments) this.appendQueue.nodes.push(arguments[index]);
		this.renderer.doBeforeDraw = this.appendNew;
		if(this.sys.fps() == Infinity ) this.sys.start();
		return this;
	},
	addEdges: function(){
		this.appendQueue.edges.concat(arguments);
		this.renderer.doBeforeDraw = this.appendNew;
		if(this.sys.fps() == Infinity ) this.sys.start();
		return this;
	},
	appendNew: function(){
		console.log(this.appendQueue, this.appendQueue.nodes.length);
		if(this.appendQueue.nodes.length < 2){
			console.log('attempting to fail!');
			var node = this.appendQueue.nodes[0].pop();
			node._ref = this.sys.addNode(node.name, {x: node.p.x, y: node.p.y, mass: node.mass, self: node });
		}else if(this.appendQueue.edges.length < 2){
			if(!this.appendQueue.edges.length) {
				var nodes = {};
				for(var index in this.appendQueue.nodes){ var node = this.appendQueue.nodes[index]; nodes[index] = {x: node.p.x, y: node.p.y, mass: self.mass, self: node} };
				console.log(nodes);	
				this.sys.graft({nodes: nodes});
				while(this.appendQueue.nodes.length){
					node = this.appendQueue.nodes.pop();
					console.log(node, node.name);
					node._ref = this.sys.getNode(node.name);
					if(!node._ref) debugger;
				}
			}
			else{
				//add single edge
			}
		}
		else{
			console.log('hoi!', this.appendQueue);
		}
		this.renderer.doBeforeDraw = function(){};
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
	doBeforeDraw: function(){},
	init: function(){ this.ctx.save(); },
	redraw: function(){
		var exports = {};
		this.doBeforeDraw.call(this.NS);
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

function Node(NS, options){
	this.construct.call(this, NS, options);
}

$.extend( Node.prototype, {
	render: function(p, renderer){
		var ctx = renderer.ctx;
		ctx.beginPath();
		ctx.arc(p.x, p.y, /*Math.sqrt*/(this.mass), 0, 2*Math.PI, true);
		ctx.closePath();
		ctx.fillStyle = this.color ? this.color.toRGBAString() : renderer.fill ? renderer.fill.toRGBAString() : renderer.bgnd.invert().toRGBAString();
		ctx.fill();
	},
	construct: function(NS, options){
		$.extend(
			this,
			$.extend(
				{
					p: { x: 0, y: 0 },
					mass: 1,
					name: 'n' + new Date().getTime()
				},
				options || {}
			)
		);
		this.NS = NS.addNodes(this);
	},
	remove: function(){
	//	NS.
	}
});

function Edge(NS, fromNode, toNode, options){
	this.construct.call(this, NS, fromNode, toNode, options);
}

$.extend( Edge.prototype, {
	render: function(p1, p2, renderer){
		var ctx = renderer.ctx;
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.strokeStyle = this.color ? this.color.toRGBAString() : renderer.fill ? renderer.fill.toRGBAString() : renderer.bgnd.invert().toRGBAString();
		ctx.stroke();
	},
	construct: function(NS, fromNode, toNode, options){
		$.extend(this, $.extend({
			x: 0,
			y: 0,
			mass: 1,
		}, options));
		this.NS = NS;
		NS.addEdges()
		//this._ref = NS.sys.addEdge(fromNode || new Date().getTime(), toNode || new Date().getTime(), { self: this });
	},
	remove: function(){
		//need ref to sys here
	}
});