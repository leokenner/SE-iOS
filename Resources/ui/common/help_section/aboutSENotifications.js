

function aboutSENotifications(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About StarsEarth Notifications',
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
var main_text = Ti.UI.createLabel({ text: "Whenever an appointment's scheduled date/time has passed, or whenever an activity/treatment's "+
											"end date has passed, StarsEarth will notify you so that you can enter your observations and take "+
											"any next steps (recording further events). Whenever there are notifications for you, the 'Ended' button "+
											"will turn red and show you the number of events awaiting your attention. This button is on the top right hand "+
											"corner of the main screen.",
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutSENotifications;