// arbor-alea bootstrap:
var random = Alea();
var math = Math;

math.random = random;

function anotherRenderer(){
	NodeSystem.prototype.defaultRenderer.call(this);
}
$.extend(anotherRenderer.prototype, NodeSystem.prototype.defaultRenderer.prototype);

if(confirm('init?')){
	var hoi = new NodeSystem({/*renderer: new anotherRenderer(),*/ renderOptions: { bgnd: new Color().randomize() }});
	var n = new Node(hoi, {mass: 10, x: 200, y: 200 });
	setTimeout(function(){
		var o = new Node(hoi, {mass: 20, x: 300, y: 100 });
		var e = new Edge(hoi, o._ref, n._ref);
	},1000);
	//hoi.sys.addEdge('a')
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