

function forWho(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'Who is it for?',
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
var main_text = Ti.UI.createLabel({ text: "StarsEarth is an app designed for parents/guardians of individuals with special needs. "+
											"As a guardian, you need to keep track of alot of medical information, such as appointments "+
											"with medical professionals as well as treatments that need to be administered for the individual. "+
											"StarsEarth allows you to record this information and organizes it for you so you can come back to it "+
											"at your convinience. \n\nStarsEarth also allows you to schedule activities and set short term goals for "+
											"these individuals as well as record any observations that you make during the individual's day to day routine. "+
											"\n\nIf you need to care for an individual with special needs, then StarsEarth is the organizer that you need. ", 
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = forWho;