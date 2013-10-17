

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
var main_text = Ti.UI.createLabel({ text: "An appointment must have a date, time and a duration. Duration is how long you expect the "+
											"appointment to last. If you wish you receive a reminder about the appointment, you can choose "+
											"how long before the appointment you want to be alerted. StarsEarth will then set a reminder on your "+
											"device's calendar. If you modify any details about the appointment later, StarsEarth will modify the "+
											"reminder in the calendar accordingly. \n\nNote that in order to set a reminder in the calendar, you will "+
											"need to grant StarsEarth permission to access your calendar.",
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = dateTime;