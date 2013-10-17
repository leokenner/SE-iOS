

function activities(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var activity = {
		appointment_id: null,
		main_activity: null,
		start_date: null,
		end_date: null,
		frequency: null,
		interval: null,
		alert: null,
		goals: ['Leg needs to heal'],
	};
	var users = getUserLocal(Titanium.App.Properties.getString('user'));
	var user = users[0]; 
	var individuals = getChildByUserIdLocal(Titanium.App.Properties.getString('user'));
	var individual = individuals[0];
	activity.record_id = getEntryBy('child_id',individual.id)[0].record_id;
	activity.entry_id = getEntryBy('child_id', individual.id)[0].id;
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Goals', navGroupWindow);
	var navGroup = (navGroupWindow.getChildren())[0];
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "Each activity must be created with at least one goal in mind. This goal or goals are what you "+
				"want the individual to accomplish by the end of the activity. For example, in the case of this activity, "+
				"we can set a goal as requiring the leg to heal. Click the link below to access the list of goals. Tap next when done.",
				
	scrollView.add(text);
	
	var goals_view = Ti.UI.createView({ top: 20, width: 280, height: 50, backgroundColor: 'red', });
	var view_txt = Ti.UI.createLabel({ text: activity.goals.length + ' goal listed', left: 5, color: 'white' });
	goals_view.add(view_txt);
	
	scrollView.add(goals_view);
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Next' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);
	
	goals_view.addEventListener('click', function(e) {
			var goals_page = require('ui/common/helpers/items');
			goals_page = new goals_page(activity.goals, 'Goals');
			navGroup.open(goals_page);
			
			goals_page.addEventListener('close', function() { 
				goals = goals_page.result;
				if(goals.length == 0) view_txt.text = "No goals listed"; 
				else if(goals.length == 1) view_txt.text = goals.length+" goal listed";
				else if(goals.length > 1) view_txt.text = goals.length+ " goals listed";
			});
		});		
	
	next_btn.addEventListener('click', function() {
		activity.id = insertActivityLocal(activity.entry_id, activity.appointment_id, main_activity.text, 
										start_date.text, end_date.text, frequency.text, interval.text, alert_text.text);
		
		for(var i=0; i < activity.goals.length; i++) {
			activity.goals[i] = removeWhiteSpace(activity.goals[i]);
			insertGoalForActivityLocal(activity.id, activity.goals[i]);
		}
	
		var next = require('ui/common/bootcamp/activities/activities2');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	return self;
}

module.exports = activities;
