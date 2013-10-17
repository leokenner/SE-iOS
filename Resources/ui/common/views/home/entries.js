

function home_entry(input, navGroup)
{
	var row = Ti.UI.createTableViewRow({ height: 400, object: input, type: 'entry', });
	
	var down_arrow = Ti.UI.createImageView({
		image: 'down_arrow.png',
		top: 10,
		right: 10,
		width: 20,
		height: 20,
		bubbleParent: false,
	});
	
	var dateTime = Ti.UI.createLabel({ text: "On "+input.date+" at "+input.time,
										left: 5,
										height: 40,
										top: 0, 
										font: { fontSize: 15 },
								});
								
	var top_line = Ti.UI.createView({ width: 235, height: 1, top: 40, left: 0, borderColor: 'black', borderWidth: 1 });
	
	var main_entry = Ti.UI.createLabel({
		text: input.main_entry?input.main_entry:'No entry to display',
		font: { fontSize: 15, },
		textAlign: 1,
		width: '90%',
		height: 260,
	});
	
	var updatedDateTime = jsonDateStringTimeFormatted(jsonDateToRegularDateString(input.updated_at));
	var updated = Ti.UI.createLabel({
		text: 'Last updated:\n'+updatedDateTime.date+' '+updatedDateTime.time,
		left: 5,
		bottom: 0,
		height: 60,
		font: { fontSize: 15 },
	});
	
	row.filter = main_entry.text;
	row.add(down_arrow);
	row.add(dateTime);
	row.add(top_line);
	row.add(main_entry);
	row.add(updated);
	
	row.addEventListener('click', function(e) {
		var entry_form = require('ui/common/forms/entry_form');
		entry_form = new entry_form(e.row.object, navGroup);
		row.next = entry_form;   //For home screen purposes
		navGroup.open(entry_form);
	});
	
var actionDialog = Titanium.UI.createOptionDialog({
    options: ['View Full Record', 'Cancel'],
    cancel:4
});

actionDialog.addEventListener('click', function(e) {
	if(e.index == 0) {
		var record = require('ui/common/views/record');
		record = new record({ id: input.record_id }, navGroup);
		e.next = record;
		row.fireEvent('arrowClicked', e);
		navGroup.open(record);
	}
});

down_arrow.addEventListener('click', function() {
	actionDialog.show({ view: down_arrow });
});
	
	return row;
}
module.exports = home_entry;
