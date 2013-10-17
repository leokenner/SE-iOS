

function activities5(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var individuals = getChildByUserIdLocal(Titanium.App.Properties.getString('user'));
	var individual = individuals[0];
	var entry = getEntryBy('individual_id',individual.id)[0];
	var activity = getActivitiesForEntryLocal(entry.id)[0];
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Activity Alerts', navGroupWindow);
	var navGroup = (navGroupWindow.getChildren())[0];
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "An activity must always be intended for an individual. They must also be related to an entry. In this example, "+
				"the activity is intended for "+individual.first_name+" "+individual.last_name+". It is related to the following entry:\n\n"+
				entry.main_entry". Tap Save and continue to save this activity and proceed.\n\n Once this activity is saved, you can check your calendar app for "+
				"the reminders if you chose to receive them.";				
	scrollView.add(text);
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Save and continue' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);
	
	next_btn.addEventListener('click', function() {
		createActivityACS(activity, entry);
		
		var next = require('ui/common/bootcamp/choose_events');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	return self;
}

module.exports = activities5;
