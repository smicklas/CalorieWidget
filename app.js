(function() {
	var heart_rate_box; 
	var calorie_box;
	var counter = 0;
	const counter_limit = 10;
	
	//health info, needs to be dynamic 
	var age = 23;
	var weight_in_lbs = 130;
	var weight_in_kgs = weight_in_lbs/ 2.205;
	var height_inches = 2;
	var height_foot = 5;
	var height_cm = (height_foot * 30.48) + (height_inches * 2.54);
	var gender = "female";
	var time_sleep = 0;
	var time_active = 0;
	var time_steady = 0;
	var calories_total = 0;
	var bmr_per_min; 
	//needs to be dynamic :( 
	var hr_resting = 65;
	var hr = 0;
	var step_box; 
	var heart_rate_box;
	var remote_message_port;
	
    /**
     * Handles the hardware key event.
     * @private
     * @param {Object} event - The hardware key event object
     */
    function keyEventHandler(event) {
        if (event.keyName === "back") {
            try {
                // If the back key is pressed, exit the application.
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    }

    function init() {
        // Add hardware event listener
        document.addEventListener("tizenhwkey", keyEventHandler);
        //getBaseHealthInfo();
        //set up comms with web service
        var pkg_id = tizen.application.getCurrentApplication().appInfo.packageId;
        var app_id = tizen.application.getCurrentApplication().appInfo.id;
        //import 
        var local_message_port = tizen.messageport.requestLocalMessagePort(pkg_id + ".DataChannel");
        var message_port_listener = local_message_port.addMessagePortListener(OnReceived);
        //var cal = tizen.preference.getValue('KEY');
        tizen.humanactivitymonitor.setAccumulativePedometerListener(onchangedCB);

    }
    

    
    function OnReceived(data) {
    	if(data[0].key === "CALORIES"){
    		document.getElementById("full_calories").innerHTML= data[0].value;	 
    	    tizen.preference.setValue('CALORIES', data[0].value); 
    	}else if(data[0].key === "HEART_RATE"){
    		console.log("hr is " + data[0].value);  
    	}else{
    		console.log("debug is " + data[0].key + " " + data[0].value);
    	}
    }
    // The function "init" will be executed after the application successfully loaded.
    window.onload = init;
}());