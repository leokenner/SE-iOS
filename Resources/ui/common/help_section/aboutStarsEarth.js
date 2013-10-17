

function aboutStarsEarth(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About StarsEarth',
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
var main_text = Ti.UI.createLabel({ text: 'StarsEarth has two main views: the home and the record books. Home is a list of all '+
											'the most recent actions that you have taken for all the individuals you have registered '+
											'with StarsEarth. \n\nTapping the menu button on the top left gives you access to the main menu. '+
											'From here you can create a new record book for an individual simply by entering their name in the form. '+
											'You can then access any record book by simply tapping on the name. \n\nFrom the main view, the top '+
											'right button notifies you of how many events have passed there end date/time and require your attention. '+
											'Tap this to access these notifications.',
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutStarsEarth;