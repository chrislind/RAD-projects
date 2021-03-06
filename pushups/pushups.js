var myo = Myo.create();

myo.on('pushup', function(){
	console.log('PUSHUP');
});


getEulerAngles = function(q){
	return {
		roll : Math.atan2(2.0*(q.y*q.z + q.w*q.x), q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z),
		pitch : Math.asin(-2.0*(q.x*q.z - q.w*q.y)),
		yaw : Math.atan2(2.0*(q.x*q.y + q.w*q.z), q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z)
	}
}


var getDummyData = function(){
	return _.times(500, function(index){
		return 0
	});
}

var data = {
	roll : getDummyData(),
	pitch : getDummyData(),
	yaw : getDummyData()
};



var genData = function(){
	return _.map(data, function(vals, key){
		return {
			label : key,
			data : _.map(vals, function(d, index){
				return [index, d]
			})
		}
	})
}

console.log(genData());


var graph = $.plot('#plot', genData(),{
	series: {shadowSize: 0},
	colors: [ '#04fbec', '#ebf1be', '#c14b2a', '#8aceb5'],
	yaxis : {
		min : -3,
		max : 3
	},
});

var addData = function(angles){

	//console.log(angles);

	_.each(angles, function(val, key){
		data[key].shift();
		data[key].push(val);
	});



}


var prevVal = 0;


myo.on('orientation', function(o){
	var ea = getEulerAngles(o)

	addData(ea);
	graph.setData(genData());
	graph.draw();

	$('#roll').text(ea.roll);

});


var numOfPushups = 0;

var isDown = false;

myo.on('push_down', function(){
	isDown = true;
})

myo.on('push_up', function(){
	if(isDown){
		isDown = false;
		numOfPushups++;
		$('#pushUpCounter').text(numOfPushups.toString());
	}
})