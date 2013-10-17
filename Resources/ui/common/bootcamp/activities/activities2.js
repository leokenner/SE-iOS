

function activities2(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var individuals = getChildByUserIdLocal(Titanium.App.Properties.getString('user'));
	var individual = individuals[0];
	var activity = {};
	activity.id = getActivitiesForEntryLocal(getEntryBy('child_id', individual.id)[0].id)[0].id;
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Main Activity', navGroupWindow);
	var navGroup = (navGroupWindow.getChildren())[0];
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "Next you need to enter a description of the main activity that the individual needs to do. "+
				"The main activity is required in order to save the activity. Below is an example of a main entry. "+
				"You may edit it if you wish to. Tap next to continue when you are ready.",
				
	scrollView.add(text);
	
	var main_entry = Ti.UI.createTextArea({ font: { fontSize: 16, }, top: 20, width: 280, height: 200, borderColor: '#CCC', 
										 value: individual.first_name+" needs to exerise their leg once a day for about five days",
										});
	scrollView.add(main_entry);									
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Next' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);		
	
	next_btn.addEventListener('click', function() {
		updateActivityLocal(activity.id, 'main_activity', main_activity.text);
		
		var next = require('ui/common/bootcamp/activities/activities3');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	return self;
}

module.exports = activities2;
