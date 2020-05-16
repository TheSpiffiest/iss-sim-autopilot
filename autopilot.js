function AutoPilot() {
// a bunch of helper functions for clicking and getting values.
var controll_loop_interval_id = 0;
var controll_loop_interval = 1000;

var translate_left_count = 0;
var translate_right_count = 0;
var translate_up_count = 0;
var translate_down_count = 0;
var translate_forward_count = 0;
var translate_back_count = 0;

var tanslate_x = 0;
var tanslate_y = 0;
var tanslate_z = 0;


this.pitch_up = function() {
	$("#pitch-up-button").click();
}

this.pitch_down = function() {
	$("#pitch-down-button").click();
}

this.yaw_left = function() {
	$("#yaw-left-button").click();
}

this.yaw_right = function() {
	$("#yaw-right-button").click();
}

this.roll_left = function() {
	$("#roll-left-button").click();
}

this.roll_right = function() {
	$("#roll-right-button").click();
}

this.translate_left = function() {
	$("#translate-left-button").click();
	translate_left_count += 1;
	tanslate_y -= 1;
}

this.translate_right = function() {
	$("#translate-right-button").click();
	translate_right_count += 1;
	tanslate_y += 1;
}

this.translate_up = function() {
	$("#translate-up-button").click();
	translate_up_count += 1;
	tanslate_z += 1;
}

this.translate_down = function() {
	$("#translate-down-button").click();
	translate_down_count += 1;
	tanslate_z -= 1;
}

this.translate_forward = function() {
	$("#translate-forward-button").click();
	translate_forward_count += 1;
	tanslate_x -= 1;
}

this.translate_backward = function() {
	$("#translate-backward-button").click();
	translate_back_count += 1;
	tanslate_x += 1;
}

this.getPitchRate = function() {
	return parseFloat($("#pitch .rate").innerText);
}

this.getYawRate = function() {
	return parseFloat($("#yaw .rate").innerText);
}

this.getRollRate = function() {
	return parseFloat($("#roll .rate").innerText);
}

this.getPitch = function() {
	return parseFloat($("#pitch .error").innerText);
}

this.getYaw = function() {
	return parseFloat($("#yaw .error").innerText);
}

this.getRoll = function() {
	return parseFloat($("#roll .error").innerText);;
}

// get position
this.getPos = function() {
	var x = parseFloat($("#x-range > div").innerText);
	var y = parseFloat($("#y-range > div").innerText);
	var z = parseFloat($("#z-range > div").innerText);
	return new THREE.Vector3(x,y,z);
}

this.getRate = function() {
	return parseFloat($("#rate > div.rate").innerText);
}

this.getRange = function() {
	return parseFloat($("#range > div.rate").innerText);
}

this.restart = function() {
	this.stop();
	
	$('#option-restart').click();
	translate_left_count = 0;
	translate_right_count = 0;
	translate_up_count = 0;
	translate_down_count = 0;
	translate_forward_count = 0;
	translate_back_count = 0;
	
	

}

//////////////////

var maxRoll = 0.2;
var minRoll = -0.2;
var maxPitch = 0.2;
var minPitch = -0.2;
var maxYay = 0.2;
var minYaw = -0.2;
var slowRange = 5;
var maxSlowRate = -0.2;
var maxRate = -1;



// estimate docking time
this.getDockingTime = function() {
	var rate = getRate();
	var range = getRange();
	var seconds = 0;
	if (rate != 0) {
		seconds = range / rate;
	}
	console.log("At this rate (" + rate + ") we should dock with ISS in " + seconds);
	
}


this.translateStep = function() {
	var pos = getPos();
	
	if (pos.x > 0) {
		
	}
}

this.estimateCorrectionTimes = function() {
	var roll = this.getRoll();
	var rollRate = this.getRollRate();
	var rollDirection = "";

	var pitch = this.getPitch();
	var pitchRate = this.getPitchRate();
	var pitchDirection = "";
	
	var yaw = this.getYaw();
	var yawRate = this.getYawRate();
	var yawDirection = "";
	
	if (roll > 0) {
		rollDirection = "Right";
	}
	if (roll < 0) {
		rollDirection = "Left";
	}
	if (roll != 0 && rollRate == 0) {
		console.log("WARNING - Roll is too far " + rollDirection + ", but no roll correction active");
	}

	if (pitch > 0) {
		pitchDirection = "Up";
	}
	if (pitch < 0) {
		pitchDirection = "Down";
	}
	if (pitch != 0 && pitchRate == 0) {
		console.log("WARNING - Pitching is too far " + pitchDirection + ", but no pitch correction active");
	}

	if (yaw > 0) {
		yawDirection = "Right";
	}
	if (yaw < 0) {
		yawDirection = "Left";
	}
	if (yaw != 0 && yawRate == 0) {
		console.log("WARNING - yawing is too far " + yawDirection + ", but no yaw correction active");
	}
	
}

this.correctRollPitchYaw = function() {
	var roll = this.getRoll();
	var rollRate = this.getRollRate();
	
	var pitch = this.getPitch();
	var pitchRate = this.getPitchRate();
	
	var yaw = this.getYaw();
	var yawRate = this.getYawRate();
	
	if (roll > 0 && rollRate >= 0) {
		console.log("Roll is " + roll + ", rollRate is " + rollRate + ", rolling right");
		if (rollRate < maxRoll) {
			console.log(" - roll rate is below " + maxRoll + ", rolling right");
			this.roll_right();
		}
	}
	if (roll < 0 && rollRate <= 0) {
		console.log("Roll is " + roll + ", rollRate is " + rollRate + ", rolling left");
		if (rollRate > minRoll) {
			console.log(" - roll rate is below " + minRoll + ", rolling left");
			this.roll_left();
		}
	}
	
	if (pitch > 0 && pitchRate >= 0) {
		console.log("Pitch is " + roll + ", pitchRate is " + rollRate + ", pitching down");
		if (pitchRate > maxPitch) {
			console.log(" - pitchRate is below " + maxPitch + ", pitching down");
			this.pitch_down();
		}
	}
	if (pitch < 0 && pitchRate <= 0) {
		console.log("Pitch is " + roll + ", pitchRate is " + rollRate + ", pitching up");
		if (pitchRate > minPitch) {
			console.log(" - pitchRate is abouve " + minPitch + ", pitching up");
			this.pitch_up();
		}
	}
}


this.controlLoop = function() {
	correctRollPitchYaw();
}


this.start = function() {
	controll_loop_interval_id = setInterval(controlLoop, controll_loop_interval);
}

this.stop = function() {
	clearInterval(controll_loop_interval_id);
}
	return this;
}

a = new AutoPilot();
a.estimateCorrectionTimes();
a.getDockingTime();