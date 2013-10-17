

function activities5(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var individuals = getChildByUserIdLocal(Titanium.App.Properties.getString('user'));
	var individual = individuals[0];
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Activity Alerts', navGroupWindow);
		self.rightNavButton = null;
	var navGroup = (navGroupWindow.getChildren())[0];
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "Congratulations, you have now successfully created an activity for "+individual.first_name+" "+individual.last_name+
				". You have successfully opened a record book, created an entry and created an activity. You have now completed the "+
				"basic tutorial.\n\nYou can tap the Start using StarsEarth button below to begin using the app. Alternatively, you can also "+
				"try the tutorials for appointments and treatments. Note that these tutorials will always be available for you in the help "+
				"section, which can be accessed via the main menu.";
	scrollView.add(text);
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Start using StarsEarth' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);
	
	var appointments_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'black' });
	var appointments_txt = Ti.UI.createLabel({ color: 'white', text: 'Appointments Tutorial' });
	appointments_btn.add(appointments_txt);
	scrollView.add(appointments_btn);
	
	var treatments_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'black' });
	var treatments_txt = Ti.UI.createLabel({ color: 'white', text: 'Treatments Tutorial' });
	treatments_btn.add(treatments_txt);
	scrollView.add(treatments_btn);
	
	next_btn.addEventListener('click', function() {
		var next = require('ui/common/bootcamp/choose_events');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	appointments_btn.addEventListener('click', function() {
		var next = require('ui/common/bootcamp/appointments/appointment');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	treatments_btn.addEventListener('click', function() {
		var next = require('ui/common/bootcamp/treatments/treatment');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	
	
	return self;
}

module.exports = activities5;
