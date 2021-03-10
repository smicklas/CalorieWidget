window.onload = function() {
	document.addEventListener('visibilitychange', function() {
	var calorie_box = document.getElementById("calories");
	
	if (tizen.preference.exists('CALORIES')) { //Check whether last measured heart rate value exists or not.
		var cal = tizen.preference.getValue('CALORIES');
		document.getElementById("calories").innerHTML = cal.toFixed(0);
    } else {
    	document.getElementById("calories").innerHTML = "Error";
    }
	
	if (tizen.preference.exists('HEART_RATE')) { //Check whether last measured heart rate value exists or not.
		document.getElementById("hr").innerHTML = tizen.preference.getValue('HEART_RATE');
    } else {
    	document.getElementById("hr").innerHTML = "Error";
    }
	});
}(); 