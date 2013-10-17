

function aboutActivities(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About activities',
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
var main_text = Ti.UI.createLabel({ text: "If you would like to keep a record of any activity that you make an individual do, you can do "+
											"so using StarsEarth. Activities must always apply to an individual. They must also be related to "+
											"an entry. For example, if an individual did something incorrect in the playground, that story would "+
											"become the entry, after which you would create some activity to help the individual overcome this habit. "+
											"For more details about entries, please see the 'About entries' part of the help section. \n\nIn order to "+
											"create an activity, you need to describe the activity as well as the goals to be achieved. Then you need to "+
											"set the times at which the activity needs to accur. You can create an activity, you can view it from the "+
											"Home screen or the record book of the individual in was created for. There you can edit its details and "+
											"delete it if you would like to. \n\nYou can also set activities "+
											"after an appointment, if the activity has been recommended by a doctor. After an activity has been completed, "+
											"you will be notified so that you can enter your observations. \n\nFor more help on how activities work on "+
											"StarsEarth, simply tap the title on the activities form.", 
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutActivities;