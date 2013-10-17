

function indexActivities(navGroup) {
	

var self = Titanium.UI.createWindow({
	title: 'Activities Help',
 	backgroundColor:'white',
});
self.result=null;

if(!navGroup) { 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroup = (navGroupWindow.getChildren())[0];
		navGroupWindow.result = null;
	if(Titanium.Platform.osname == 'ipad') {
		navGroupWindow = Ti.UI.iPad.createPopover({
	    	width: 320,
	    	height: 480,
		});
		navGroupWindow.add(navGroup);
	}
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
	if(navGroupWindow) {
		var animation = Ti.UI.createAnimation({
				top: Titanium.Platform.displayCaps.platformHeight*0.9,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
				duration: 500
			});
			navGroupWindow.animate(animation);
			animation.addEventListener('complete', function() {
				navGroupWindow.close();
			});
	}
	else navGroup.close(self);
});
self.rightNavButton = close_btn;

var table = Titanium.UI.createTableView({
	top: 0,
	rowHeight: 60,
	showVerticalScrollIndicator: false,
});

var sectionApp = Ti.UI.createTableViewSection({ headerTitle: ' ' });
sectionApp.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionApp.rows[0].add(Ti.UI.createLabel({ text: 'About activities', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));

var sectionFeatures = Ti.UI.createTableViewSection({ headerTitle: 'About the features', });
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.rows[0].add(Ti.UI.createLabel({ text: 'About choosing an individual', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[1].add(Ti.UI.createLabel({ text: 'About choosing an entry', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[2].add(Ti.UI.createLabel({ text: 'About goals and main activity', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[3].add(Ti.UI.createLabel({ text: 'About dates and times', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));

var sectionContactUs = Ti.UI.createTableViewSection({ headerTitle: 'Others' });
sectionContactUs.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionContactUs.rows[0].add(Ti.UI.createLabel({ text: 'Other questions? Contact us', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
table.data = [sectionApp, sectionFeatures, sectionContactUs];

self.add(table);

table.addEventListener('click', function(e) {
	switch(e.row.children[0].text) {
		case 'About activities':
			var question = require('ui/common/help_section/aboutActivities');
			break;
		
		case 'About choosing an individual':
			var question = require('ui/common/help_section/choosingIndividual');
			break;
			
		case 'About choosing an entry':
			var question = require('ui/common/help_section/choosingEntry');
			break;
			
		case 'About goals and main activity':
			var question = require('ui/common/help_section/aboutActivities/aboutGoals');
			break;
			
		case 'About dates and times':
			var question = require('ui/common/help_section/aboutActivities/dateTime');
			break;
			
		case 'Other questions? Contact us':
			var question = require('ui/common/help_section/contactUs');
			break;	
										
		default: break;
	}
	
	if(question) { 
		question = new question(navGroup);
		(getNavGroup()).open(question);
	}
});

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = indexActivities;