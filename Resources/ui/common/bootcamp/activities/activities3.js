

function activities3(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var activity = {
		startDate: timeFormatted(new Date()),
		endDate: timeFormatted(new Date()),
		frequency: 1,
		interval: 'Every day',
	}
	var individuals = getChildByUserIdLocal(Titanium.App.Properties.getString('user'));
	var individual = individuals[0];
	
	activity.id = getActivitiesForEntryLocal(getEntryBy('child_id', individual.id)[0].id)[0].id;
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Activity Dates', navGroupWindow);
	var navGroup = (navGroupWindow.getChildren())[0];
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "An activity on StarsEarth needs to be scheduled between two dates. For example, this activity should be done "+
				"for a certain amount of days. Accordingly, you can change the start date and the end date of the activity, as well as mention "+
				"how many times it should happen and in what interval",				
	scrollView.add(text);
	
	var view = Ti.UI.createView({ borderColor: '#CCC', top: 10, width: 240, height: 180, layout: 'vertical' });
	var start_date = Ti.UI.createLabel({ left: 5, font: {fontSize: 16 }, text: 'Start Date: '+activity.startDate.date, height: 45, width: '100%', bubbleParent: false, });
	var end_date = Ti.UI.createLabel({ left: 5, font: {fontSize: 16 }, text: 'End Date: '+activity.endDate.date, height: 45, width: '100%', bubbleParent: false, });
	var frequency = Ti.UI.createLabel({ left: 5, font: {fontSize: 16 }, text: 'How many times: '+activity.frequency, height: 45, width: '100%', bubbleParent: false, });
	var interval = Ti.UI.createLabel({ left: 5, font: {fontSize: 16 }, text: 'Interval: '+activity.interval, height: 45, width: '100%', bubbleParent: false, });

	view.add(start_date);
	view.add(end_date);
	view.add(frequency);
	view.add(interval);
	scrollView.add(view);									
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Next' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);
	
	
	function changeDate(date)
	{
		modalPicker = require('ui/common/helpers/modalPicker');
		modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE,null,date.text); 
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.open(); 
		if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: date, });
		
		 
		var picker_closed = function() {
			if(modalPicker.result) { 
				var newDate = modalPicker.result.toDateString();
				var string = date.text.split(': ')[0];
				date.text = string + ': ' + newDate;
			}
		};
			
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
	
	}
	
	start_date.addEventListener('click', function(e) {	
		changeDate(start_date);
		activity.startDate = start_date.text.split(': ')[1];
	});

	end_date.addEventListener('click', function(e) {	
		changeDate(end_date);
		activity.endDate = end_date.text.slice(': ')[1];
	});	
	
	frequency.addEventListener('click', function(e) {	
		var data = '123456789';
		
		modalPicker = require('ui/common/helpers/modalPicker');
		modalPicker = new modalPicker(null,data,activity.frequency); 
	
		if(Titanium.Platform.osname == 'iphone') modalPicker.open();
		if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: frequency, });
	
	 
		var picker_closed = function() {
			if(modalPicker.result) { 
				activity.frequency = modalPicker.result;
				frequency.text = 'How many times? '+activity.frequency;
			}
		};
			
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
			
	});
	
	
	interval.addEventListener('click', function(e) {	
		var data = [];
		data[0] = 'once only';
		data[1] = 'every day';
		data[2] = 'every week';
		data[3] = 'every month';
		data[4] = 'every year';
			
		modalPicker = require('ui/common/helpers/modalPicker');
		modalPicker = new modalPicker(null,data,activity.interval); 
	
		if(Titanium.Platform.osname == 'iphone') modalPicker.open();
		if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: interval, });
	
	
		var picker_closed = function() {
			if(modalPicker.result) {
				activity.interval = modalPicker.result;
				interval.text = 'Interval: '+activity.interval;
			}
		};
			
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
	});	
	
	next_btn.addEventListener('click', function() {
		updateActivityLocal(activity.id, 'start_date', activity.startDate);
		updateActivityLocal(activity.id, 'end_date', activity.endDate);
		updateActivityLocal(activity.id, 'frequency', activity.frequency);
		updateActivityLocal(activity.id, 'interval', activity.interval);
		
		var next = require('ui/common/bootcamp/activities/activities4');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	return self;
}

module.exports = activities3;
