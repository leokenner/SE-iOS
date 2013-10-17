

function activities4(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var individuals = getChildByUserIdLocal(Titanium.App.Properties.getString('user'));
	var individual = individuals[0];
	var activity = getActivitiesForEntryLocal(getEntryBy('child_id',individual.id)[0].id)[0];
	activity.times = [];
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Activity Alerts', navGroupWindow);
	var navGroup = (navGroupWindow.getChildren())[0];
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "Now it is time to set alerts for the activity. This means that if you want the activity to "+
				"be done twice a day for five days, you can set times at which to be reminded and StarsEarth will "+
				"setup notifications for you on your device calendar. You can, of course, also choose not to receive any notifications.\n\n"+
				"In the previous section, you set the activity to happen "+activity.frequency+" times "+activity.interval+". You can now select upto "+
				activity.frequency+" times at which to be notified. You can also select how long before the actual time you wish to be notified. "+
				"When complete, tap next to continue. Alternatively, if you do not wish to set notifications, tap Continue without notifications.\n\n"+
				"Note that in order to set notifications, StarsEarth will need access to your on-device calendar. Please allow this access when prompted.",				
	scrollView.add(text);
	
	function addRemoveTimes(how_many) 
	{
		if(how_many > 0) {
			for(var i=0; i < how_many; i++) {
				var theTime = roundMinutes(new Date());
				theTime = timeFormatted(theTime);
				times.push(theTime.time);
			}
		}
		else {
			for(var i=0; i < how_many*(-1); i++) {
				times.pop();
			}
		}
	}
	
	addRemoveTimes(activity.frequency);
	var view = Ti.UI.createView({ borderColor: '#CCC', top: 10, width: 240, height: 90, layout: 'vertical' });
	var the_times = Ti.UI.createLabel({ left: 5, font: {fontSize: 16 }, text: activity.times.length+" times set", height: 45, width: '100%', bubbleParent: false, });
	var alert_text = Ti.UI.createLabel({ left: 5, font: {fontSize: 16 }, text: 'When to alert?: '+activity.interval, height: 45, width: '100%', bubbleParent: false, });

	view.add(the_times);
	view.add(alert_text);
	scrollView.add(view);									
	
	var no_save_next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'red' });
	var no_save_next_txt = Ti.UI.createLabel({ color: 'white', text: 'Continue without notifications' });
	no_save_next_btn.add(no_save_next_txt);
	scrollView.add(no_save_next_btn);
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Next' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);
	
	
	the_times.addEventListener('click', function(e) {
		var alerts_page = require('ui/common/helpers/alerts');
		alerts_page = new alerts_page(times, activity.interval);
		navGroup.open(alerts_page);
		
		alerts_page.addEventListener('close', function() {
			activity.times = alerts_page.result;
			the_times.text = activity.times.length+' times set';
		});  
	});
	
	
	alert_text.addEventListener('click', function(e) {	
		var data = [];
		data[0] = 'Time of event';
		data[1] = '5 minutes before';
		data[2] = '10 minutes before';
		data[3] = '15 minutes before';
		data[4] = '30 minutes before';
		data[5] = '1 hour before';
		data[6] = 'Never';
		
		modalPicker = require('ui/common/helpers/modalPicker');
		modalPicker = new modalPicker(null,data,activity.alert); 
	
		if(Titanium.Platform.osname == 'iphone') modalPicker.open();
		if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: alert_text, });
	
	
		var picker_closed = function() {
			if(modalPicker.result) {
				activity.alert = modalPicker.result;
				alert_text.text = 'When to alert? '+activity.alert;
			}
		};
			
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
	});	
	
	no_save_next_btn.addEventListener('click', function() {
		updateActivityLocal(activity.id, 'alert', activity.alert);
		
		var next = require('ui/common/bootcamp/activities5');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	next_btn.addEventListener('click', function() {
		if(activity.frequency > activity.times.length) {
			alert('This activity is meant to take place '+activity.frequency+' times '+activity.interval+' but you have only entered '+activity.times.length+' times');
			return;
		}
		
		updateActivityLocal(activity.id, 'alert', activity.alert);
		for(var i=0; i < activity.times.length; i++) {
			insertTimeForActivityLocal(activity.id, activity.times[i]);
		}
		scheduleNotification('activity', activity);
		
		var next = require('ui/common/bootcamp/activities/activities5');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	return self;
}

module.exports = activities4;
