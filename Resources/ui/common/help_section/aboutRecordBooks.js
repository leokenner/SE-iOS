

function aboutRecordBooks(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About record books',
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
var main_text = Ti.UI.createLabel({ text: "Every individual that you register with StarsEarth has a record book. "+
											"You can create a record book using the main menu, or one will be created if you "+
											"schedule an event or enter an entry for an individual who does not yet have a record "+
											"book with StarsEarth. Record books hold the individual's personal information in the profile "+
											"section. This can be accessed by simply tapping the individual's name in the title bar. "+
											"Record books also hold all the entries and events that you have recorded; organized and ready to be "+
											"viewed at your convinience. Simply tap an individual's name in the main menu in order to open "+
											"their record book", textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutRecordBooks;