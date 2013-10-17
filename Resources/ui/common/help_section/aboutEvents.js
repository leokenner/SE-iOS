

function aboutEvents(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About events',
});
self.result=null;

if(!navGroup) { 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroup = (navGroupWindow.getChildren())[0];
		navGroupWindow.result = null;
}

function getNavGroup()
{
	if(navGroupWindow) return (navGroupWindow.getChildren())[0];
	else return navGroup; 
}

var close_btn = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.DONE
});

close_btn.addEventListener('click', function() {
	if(navGroupWindow) navGroupWindow.close();
	else navGroup.close(self);
});
//self.leftNavButton = close_btn;

var scrollView = Ti.UI.createScrollView({ width: '99%', });
var main_text = Ti.UI.createLabel({ text: "Events are anything that happens at a particular date and time. There are 3 types of events "+
											"on StarsEarth: appointments, activities and treatments. \n\nYou should use appointments if you want "+
											"to schedule keep a record of an individual's appointment with a doctor or other medical professional. "+
											"Please note that at the moment creating a new appointment on StarsEarth does not schedule an actual "+
											"appointment with them. It is simply your personal record of the appointment. \n\nActivities are any action "+
											"that you want to schedule at certain activities. Examples include doing homework on their own, cleaning the "+
											"table after a meal or even getting up on time in the morning. Activities must always be set with a goal in mind. "+
											"\n\nTreatments are any medication that the individual has to take at certain intervals. You can schedule an "+
											"individual to take certain treatments certain times a day for a set time period. \n\nWhen in doubt, simply tap "+
											"the title of any event screen screen(appointment form, activity form, treatment form) to get detailed help about it. ", 
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutEvents;