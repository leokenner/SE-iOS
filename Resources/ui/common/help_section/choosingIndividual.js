

function choosingIndividual(navGroup) {
	

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
var main_text = Ti.UI.createLabel({ text: "An entry/event is always related to an individual. Choose from the list of "+
											"individuals for whom you have record books on StarsEarth. If the individual "+
											"you are looking for is not on the list, enter a new name, and StarsEarth will "+
											"create a new record book for them when you save the entry/event. \n\nNote that you only have to "+
											"choose an individual when creating an entry/event from Home. When creating from a record "+
											"book, the individual whose record book you are viewing is the one the entry/event will be created for.", 
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = choosingIndividual;