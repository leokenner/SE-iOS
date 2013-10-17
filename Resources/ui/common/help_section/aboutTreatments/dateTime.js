

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
var main_text = Ti.UI.createLabel({ text: "StarsEarth allows you to schedule a treatment at certain intervals over a "+
											"period of time. For example, if an individual has to take a medication twice "+
											"every day for a week, you can specify an end date a week after the start date, "+
											"a frequency of 2, and interval as daily. Note that you can also set intervals of weekly, "+
											"monthly and yearly. \n\nNext you can set the alert times. The list of alert times are all times "+
											"in a single day. So if you want the medication to be taken twice in a day, set 2 times and StarsEarth "+
											"will set reminders in your calendar for you.",
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = dateTime;