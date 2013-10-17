

function helpSection(navGroup) {
	

var self = Titanium.UI.createView({
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

var table = Titanium.UI.createTableView({
	top: 0,
	rowHeight: 60,
	showVerticalScrollIndicator: false,
});

var sectionApp = Ti.UI.createTableViewSection({ headerTitle: 'About the app' });
sectionApp.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionApp.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionApp.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionApp.rows[0].add(Ti.UI.createLabel({ text: 'Who is it for?', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionApp.rows[1].add(Ti.UI.createLabel({ text: 'About the app', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionApp.rows[2].add(Ti.UI.createLabel({ text: 'Privacy Policy', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));

var sectionFeatures = Ti.UI.createTableViewSection({ headerTitle: 'About the features', });
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionFeatures.rows[0].add(Ti.UI.createLabel({ text: 'About record books', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[1].add(Ti.UI.createLabel({ text: 'About entries', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[2].add(Ti.UI.createLabel({ text: 'About events', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[3].add(Ti.UI.createLabel({ text: 'About statuses', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[4].add(Ti.UI.createLabel({ text: 'About additional notes', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[5].add(Ti.UI.createLabel({ text: 'About appointments', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[6].add(Ti.UI.createLabel({ text: 'About activities', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[7].add(Ti.UI.createLabel({ text: 'About treatments', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[8].add(Ti.UI.createLabel({ text: 'About actions', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionFeatures.rows[9].add(Ti.UI.createLabel({ text: 'About Home', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));

var sectionNotifications = Ti.UI.createTableViewSection({ headerTitle: 'About Notifications' });
sectionNotifications.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionNotifications.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionNotifications.rows[0].add(Ti.UI.createLabel({ text: 'About StarsEarth notifications', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
sectionNotifications.rows[1].add(Ti.UI.createLabel({ text: 'About calendar notifications', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));

var sectionContactUs = Ti.UI.createTableViewSection({ headerTitle: ' ' });
sectionContactUs.add(Ti.UI.createTableViewRow({ hasChild: true }));
sectionContactUs.rows[0].add(Ti.UI.createLabel({ text: 'Other questions? Contact us', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
table.data = [sectionApp, sectionFeatures, sectionNotifications, sectionContactUs];

self.add(table);

table.addEventListener('click', function(e) {
	switch(e.row.children[0].text) {
		case 'About the app':
			var question = require('ui/common/help_section/aboutStarsEarth');
			break;
		
		case 'Who is it for?':
			var question = require('ui/common/help_section/forWho');
			break;
			
		case 'Privacy Policy':
			var question = require('ui/common/help_section/privacyPolicy');
			break;
			
		case 'About record books':
			var question = require('ui/common/help_section/aboutRecordBooks');
			break;
			
		case 'About entries':
			var question = require('ui/common/help_section/aboutEntries');
			break;
			
		case 'About events':
			var question = require('ui/common/help_section/aboutEvents');
			break;
			
		case 'About statuses':	
			var question = require('ui/common/help_section/aboutStatuses');
			break;
			
		case 'About additional notes':
			var question = require('ui/common/help_section/aboutAdditionalNotes');
			break;	
			
		case 'About appointments':
			var question = require('ui/common/help_section/aboutAppointments');
			break;
			
		case 'About activities':
			var question = require('ui/common/help_section/aboutActivities');
			break;
			
		case 'About treatments':
			var question = require('ui/common/help_section/aboutTreatments');
			break;
			
		case 'About actions':
			var question = require('ui/common/help_section/aboutActions');
			break;	
			
		case 'About Home':
			var question = require('ui/common/help_section/aboutHome');
			break;
			
		case 'About StarsEarth notifications':
			var question = require('ui/common/help_section/aboutSENotifications');
			break;		
			
		case 'About calendar notifications':
			var question = require('ui/common/help_section/aboutCalendarNotifications');
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

module.exports = helpSection;