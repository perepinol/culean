function getValues(text) {

	if (text.length==0){
		return [];
	}

    var patt = new RegExp("[A-Z]|[a-z]");
    var res = patt.test(text);
	if(res){
		return [];
	}

	var totalWeeks = 18;
	var array = text.split('\n');
	if (array[array.length - 1] === "") {
		array = array.slice(0, array.length - 1);
	}

	// Get x and y
	var coords = [];
	var parts, x, y;
	for (var i = 0; i < array.length && array[i] !== ""; i++) {
		parts = array[i].split(",");
		coords.push({"x": parseInt(parts[0], 10), "y": parseFloat(parts[1], 10)});
	}
		
	// Construct data array
	var factor = 0.4;
	var data = [];
	var i = 0;
	// Skip first weeks where the machine has 0 hours
	for (; i < array.length && +coords[i].y == 0 && i < totalWeeks; i++) {
		data.push({
			"yhat": 0,
			"y": +coords[i].y,
			"x": +coords[i].x + 1
		})
	}
		
	// Add first week with hours and its yhat
	data.push({
		"yhat": round(factor * +coords[i].y),
		"y": +coords[i].y,
		"x": +coords[i++].x + 1
	});
		
	// Calculate other yhats and add
	for (; i < array.length && i < totalWeeks; i++) {
		data.push({
			"yhat": round(data[i-1].yhat + (+coords[i].y - data[i-1].yhat) * factor),
			"y": +coords[i].y,
			"x": +coords[i].x + 1
		})
	}
	return data;
}

function round(value) {
  return Number(Math.round(value+'e'+2)+'e-'+2);
}

function getNames(text) {
	if (text.length==0){
		return [];
	}

    var res = text.includes("<html>");
	if(res){
		return {};
	}
	
	var array = text.split("\n");
	var users = [];
	var result = {};
	var country;
	var user;

	
	for (var i = 0; i < array.length; i++) {
		country = {};
		users = array[i].split(";");

		for (var j = 1; j < users.length; j++) {
			user = users[j].split(",");
			country[user[0]] = user.slice(1, user.length);
		}
		result[users[0]] = country;
	}
	return result;
}

module.exports = {"getValues": getValues, "getNames": getNames }
