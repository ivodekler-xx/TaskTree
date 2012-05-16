$(document).on('ready', function(){
	networkN(Math.ceil(Math.random()*25));
	var amt = 0;
	setInterval(function(){
		amt++;
		var fps = sys.fps();
		$('#fps').html(fps);
		if(amt%2 && fps > 4) addConnectedNode(Math.floor(width/2),Math.floor(height/2));
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