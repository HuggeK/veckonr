chrome.alarms.create('update', {periodInMinutes: 60 * 8});

chrome.runtime.onInstalled.addListener(function() {
	init();
});

chrome.runtime.onStartup.addListener(function() {
	init();
});

chrome.alarms.onAlarm.addListener(function(alarm) {
	init();
});

var init = function() {
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 19;
	canvas.height = 19;
	
	var background = new Image();
	background.src = "/images/calendar3.png";
	
	background.onload = function() {
		updateIcon(ctx, canvas, background);
	}
}

var updateIcon = function(ctx, canvas, background) {
	drawBackground(ctx, background);

		//Test med native JS!
	function getWeek(date) {
		if (!(date instanceof Date)) date = new Date();
	  
		// ISO week date weeks start on Monday, so correct the day number
		var nDay = (date.getDay() + 6) % 7;
	  
		// ISO 8601 states that week 1 is the week with the first Thursday of that year
		// Set the target date to the Thursday in the target week
		date.setDate(date.getDate() - nDay + 3);
	  
		// Store the millisecond value of the target date
		var n1stThursday = date.valueOf();
	  
		// Set the target to the first Thursday of the year
		// First, set the target to January 1st
		date.setMonth(0, 1);
	  
		// Not a Thursday? Correct the date to the next Thursday
		if (date.getDay() !== 4) {
		  date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
		}
	  
		// The week number is the number of weeks between the first Thursday of the year
		// and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
		return 1 + Math.ceil((n1stThursday - date) / 604800000);
	  }
	  var textnumber = getWeek(); 
	  var text = String(textnumber); //Snygga upp! Fixar så att två värdesiffror blir justerade.
	  
	  console.log(text);

	drawText(ctx, text); //det här att ta -2 riktigt sketchy.

	chrome.browserAction.setIcon({
		"imageData": ctx.getImageData(0, 0, canvas.width, canvas.height)
	});
}

var drawBackground = function(ctx, background) {
	ctx.drawImage(background, 0, 0);
}

var drawText = function(ctx, text) {
	var xOffset;

	ctx.fillStyle = 'rgba(0, 0, 0, 255)';
	ctx.font = "bold 10px Arial";

	if (text.length > 1) {
		xOffset = 4;
	} else {
		xOffset = 7;
	}
	
	ctx.fillText(text, xOffset, 15, 19);
}
