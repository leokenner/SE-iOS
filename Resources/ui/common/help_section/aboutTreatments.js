

function aboutTreatments(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About treatments',
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
var main_text = Ti.UI.createLabel({ text: "If you would like to keep a record of any treatment has an individual has to do, you can do so using "+
											"StarsEarth. Treatments must always apply to an individual. They must also be related to an entry. "+
											"For example, if an individual ate something that led to some medical issue, that story would become the "+
											"entry, after which you would create a treatment to help the individual recover from the illness. For more "+
											"details about entries, please see the 'About entries' part of the help section. \n\nIn order to create a treatment "+
											"you need to provide details such as how long the treatment will take, the specific time intervals at which it needs "+
											"to be administered and the nature (solid/liquid), dosage of the medication. Once you create a new treatment, you can "+
											"view it on both the Home screen and in the record book of the individual for whom it was created. You can edit its details "+
											"as well as delete it. \n\nYou can set treatments after an appointment, if they have been prescribed by a doctor. You can also set them "+
											"after an entry, if you are administering it without consulting a doctor. Once the treatment is complete, StarsEarth will notify you "+
											"so that you can enter your observations of how the treatment went. \n\nFor more information how treatments work, simply tap the title "+
											"on the treatments form.",
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutTreatments;