

function aboutStatuses(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About statuses',
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
var main_text = Ti.UI.createLabel({ text: "All events have statuses. Statuses tell you the current state of the event. "+
											"There are three statuses: Scheduled, Completed and Cancelled. \n\nWhen you create a new event, "+
											"it is declared Scheduled. If you would then like to cancel the event, you must change its status to "+
											"cancelled. Once it is complete, you can change the status to completed and enter any observations "+
											"that you made regarding the event. \n\nIf an appointment's date/time has passed, and you have not changed "+
											"the status or added any observations, its status will automatically changed to Missed until you make the "+
											"necessary notes. If the case of activities and treatments, if the end date has passed, the status will be "+
											"changed to End Date Passed. \n\nWhen viewing record books, events are color coded with respect to their status. "+
											"\n\nColor codes are as follows: Yellow=Scheduled, Red=Missed/End date passed, White=Completed/Cancelled", 
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutStatuses;