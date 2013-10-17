

function events(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Entry Created', navGroupWindow);
	var navGroup = (navGroupWindow.getChildren())[0];
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "Congratulations, you have now successfully created a new record book for an individual and "+
				"created your first entry for them.\n\nEntries are the "+
				"starting point of stories in StarsEarth. You can schedule events around entries. StarsEarth has 3 types "+
				"of events: appointments, activities and treatments.\n\nThe entry we "+
				"just created was a related to an injury so we can now schedule an activity for it. Tap next to continue."
				
	scrollView.add(text);
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Next' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);		
	
	next_btn.addEventListener('click', function() {
		var next = require('ui/common/bootcamp/activities/activities');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	return self;
}

module.exports = events;
