

function aboutEntries(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About entries',
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
var main_text = Ti.UI.createLabel({ text: "Entries are a way of quickly recording an observation that you make regarding an individual. "+
											"If you notice the individual doing something that you feel should be recorded for future "+
											"reference, you can use an entry. After entering this entry, you can then schedule events around it("+
											"appointments, activities and treatments). The purpose of entries is to be a starting point for you to "+
											"schedule events around.\n\nAn example would be if the individual got injured at the playground. The details "+
											"of the injury would be entry, after which you can schedule a doctor's visit or schedule a treatment. "+
											"\n\nWhenever you are on an entry view, simply tap the title to get detailed help about it.", 
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutEntries;