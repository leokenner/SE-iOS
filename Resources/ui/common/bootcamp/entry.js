

function entry(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var entry = {
		date : timeFormatted(new Date()).date,
		time : timeFormatted(new Date()).time,
	};
	var users = getUserLocal(Titanium.App.Properties.getString('user'));
	var user = users[0]; 
	var individuals = getChildByUserIdLocal(Titanium.App.Properties.getString('user'));
	var individual = individuals[0];
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Entries', navGroupWindow);
	var navGroup = (navGroupWindow.getChildren())[0];
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "Anytime you notice something in an individual's life that you want to record, you can do "+
				"so using StarsEarth. StarsEarth allows you to record entries for any individual with a record book.\n\n"+
				"Below is an example entry for the individual whose record book you just created. Tap next to continue. ";
				
	scrollView.add(text);
	
	var cur_dateTime = timeFormatted(new Date());
	var view = Ti.UI.createView({ borderColor: '#CCC', top: 10, width: 280, height: 120, layout: 'vertical' });
	var dateTime = Ti.UI.createLabel({ left: 5, font: {fontSize: 16 }, text: cur_dateTime.date+' '+cur_dateTime.time, height: 45, width: '100%', bubbleParent: false, });
	var main_entry = Ti.UI.createTextArea({ font: { fontSize: 16, }, width: '100%', height: '100%', borderColor: '#CCC', editable: false,
										 value: individual.first_name+" suffered a fall and has badly injured their leg. Medical "+
										 		"treatment required",
										});
	view.add(dateTime);
	view.add(main_entry);									
	scrollView.add(view);
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Next' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);
	
	dateTime.addEventListener('click', function(e) {
	
		modalPicker = require('ui/common/helpers/modalPicker');
		modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,'entry',dateTime.text); 
	
		if(Titanium.Platform.osname == 'iphone') modalPicker.open();
		if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: dateTime });
	
	
		var picker_closed = function() {
			if(modalPicker.result) { 
				var newDate = timeFormatted(modalPicker.result);
				entry.date = newDate.date;
				entry.time = newDate.time;
				dateTime.text = newDate.date+' '+newDate.time;
			}
		};
	
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
	});			
	
	next_btn.addEventListener('click', function() {
		entry.record_id = insertRecordLocal(individual.id);
		entry.main_entry = main_entry.text;
		entry.id = insertEntryLocal(entry.record_id,main_entry.text,entry.date,entry.time);
		createEntryACS(entry);
		
		var next = require('ui/common/bootcamp/events');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	return self;
}

module.exports = entry;
