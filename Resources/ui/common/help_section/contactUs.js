

function contactUs(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'Contact Us',
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
var main_text = Ti.UI.createLabel({ text: "Thank you for your interest in StarsEarth! Do you have further questions about the "+
											"app and/or suggestions for improvement? If so, we would love to hear from you. Simply tap "+
											"here to email us. \n\nYou can also contact us on facebook. Simply like our page, which you can "+
											"find at facebook.com/starsearth and write to us there.",
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = contactUs;