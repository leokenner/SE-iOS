

function choosingEntries(navGroup) {
	

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
var main_text = Ti.UI.createLabel({ text: "An event is always related to an entry. The entry is the story behind the event. "+
											"After you choose an individual that the event is being created for, you can then choose "+
											"the entry it is related to. You can choose from the list of existing entries for that individual "+
											"or you can write a new entry. If you write a new entry, it will be created when you save the event. "+
											"\n\nNote that you only have to "+
											"choose an entry when creating an entry/event from Home. When creating from a record "+
											"book, the entry that you were viewing is the one the event will be created for.",
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = choosingEntries;