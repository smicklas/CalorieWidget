var calories_total = 0; 
var remote_message_port;
	//health info, needs to be dynamic 
var age = 23;
var weight_in_lbs = 130;
var weight_in_kgs = weight_in_lbs/ 2.205;
var height_inches = 2;
var height_foot = 5;
var height_cm = (height_foot * 30.48) + (height_inches * 2.54);
var gender = "female";
var bmr_per_min; 
var hr_resting = 65;
var hr = 0;

module.exports.onStart = function() {
  var pkg_id = tizen.application.getCurrentApplication().appInfo.packageId;
  var app_id = tizen.application.getCurrentApplication().appInfo.id;
  remote_message_port = tizen.messageport.requestRemoteMessagePort(app_id, pkg_id + ".DataChannel");
  try {
		tizen.humanactivitymonitor.start("HRM", onChangedCB);
		
  } catch(e) {
		remote_message_port.sendMessage(data_cal);
 }
  init();
};
  
  
module.exports.onStop = function() {
	  console.log("onStop is called");
};

function init(){
	remote_message_port.sendMessage(data_cal);
	setInterval(runCalc, 1000);	
	calculateBMRperMin();
	calculateCurrentCalories();
}

function onsuccessCB(hrmInfo) {
	remote_message_port.sendMessage(data_cal);
}

function onerrorCB(error) {
	remote_message_port.sendMessage(data_cal);
}

function runCalc(){
	//reset the calories at midnight 
	if(tizen.time.getCurrentDateTime().getHours() === 0){
		calories_total = 0; 
	}
	var cal = calcCalorieForMinute();	
	calories_total += cal;
	const data = [{key: "CALORIES", value: calories_total}];
	remote_message_port.sendMessage(data);
}

	function onChangedCB(hrmInfo) {
		hr = hrmInfo.heartRate;
		const data_cal = [{key: "HEART_RATE", value: hrmInfo.heartRate}];
		remote_message_port.sendMessage(data_cal);
	}

	//INIT FUNCTION
	//calculate the base calorie burned per minute, uses Miffling-St Jeor equation 
	//used for heart rates under resting ( hr < ~60)
	function calculateBMRperMin(){
		if(gender === "female"){
			bmr_per_min = ((10 * weight_in_kgs) + (6.25 * height_cm) - (5 * age) - 161)/1440;
		}else{
			bmr_per_min = ((10 * weight_in_kgs) + (6.25 * height_cm) - (5 * age) + 5)/1440;
		}	
	}

	//INIT FUNCTION
	//if starting the application for the first time after midnight, add bmr calories 
	function calculateCurrentCalories(){
		var minutes_since_midnight = (tizen.time.getCurrentDateTime().getHours() * 60) + tizen.time.getCurrentDateTime().getHours();
		calories_total = bmr_per_min * minutes_since_midnight; 
		const data_cal = [{key: "CALORIES", value: calories_total}];
		remote_message_port.sendMessage(data_cal);
	}

	//Figure out what equation to use to calclate calories burned for that minute
	function calcCalorieForMinute(){
		var c_min = 0;
		if(hr <= hr_resting){
			c_min = bmr_per_min; 
		}else if(hr > 89 && hr < 151){
			if(gender === "female"){
				c_min = (-20.4022 + (0.4472 * hr) - (0.1263 * weight_in_kgs) + (0.074 * age)) / 4.184;
			}else{
				c_min = (-55.0969 + (0.6309 * hr) - (0.1988 * weight_in_kgs) + (0.2017 * age)) / 4.184;
			}
		}else{ //hr between resting and 90, or greater than 150  
			c_min = 0.049 * hr - 1.5; //this needs to be adjusted probably 
			//calculate METS
		}
		return c_min; 
	}
	
