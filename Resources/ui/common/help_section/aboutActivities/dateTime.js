

function dateTime(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
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
var main_text = Ti.UI.createLabel({ text: "On StarsEarth, you can schedule activities to occur at certain times between two dates. "+
											"For example, if you want an individual to do an activity twice every day for the next week, "+
											"you would set the end date a week after the start date, set 2 for the frequency and every day for "+
											"the interval. The interval can also be weekly, monthly or yearly. The times you list for alerts are "+
											"the times in a day you will be reminded about the activity should you choose to receive alerts. \n\nIf "+
											"you choose this, you must choose how long before the specified times you want to be alerted. StarsEarth "+
											"will then set alerts in your calendar.",
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = dateTime;