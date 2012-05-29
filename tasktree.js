//// arbor-alea bootstrap:
//var random = Alea();
//var math = Math;
//
//math.random = random;
//
//function anotherRenderer(){
//	NodeSystem.prototype.defaultRenderer.call(this);
//}
//$.extend(anotherRenderer.prototype, NodeSystem.prototype.defaultRenderer.prototype);

if(confirm('init?')){
	var ns = new NodeSystem({renderOptions: { bgnd: new Color().randomize() }});
	var o = new Node(ns, {name: 'ivo', mass: 20, color: new Color({r: 255, g: 0, b: 0}).invert(), p: { x: 300, y: 100} });
	var q = new Node(ns, {mass: 20, p: { x: 500, y: 100}, color: new Color({r: 255, g: 0, b: 0}).invert() });
	setTimeout(function(){
		
		var e = new Edge(ns, o.name, q.name);
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

//function compareArrays(arr1, arr2, power){
//	if(!power) power = 1;
//	var returnVal = 0, i = 0, len = arr1.length;
//	while(i < len){
//		returnVal += Math.pow(Math.max(arr1[i], arr2[i]) - Math.min(arr1[i], arr2[i]), power);
//		i++;
//	}
//	return returnVal;
//}