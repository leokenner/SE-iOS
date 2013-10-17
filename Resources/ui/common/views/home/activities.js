

function home_activity(input)
{
	var record_id = getEntryLocal(input.entry_id)[0].record_id;
	var individual = getChildLocal(getRecordLocal(record_id)[0].child_id)[0];
	var main_entry_str = individual.first_name+' '+individual.last_name+' needs to complete the '+
						'following goals:\n';
	
	for(var i=0; i < input.goals.length; i++) {
		main_entry_str += input.goals[i];
		if(i < input.goals.length-2) main_entry_str += ", ";
		else if(i == input.goals.length-2) main_entry_str += " and ";
		else main_entry_str += "\n\n";
	}
	
	main_entry_str += 'By doing the following activity:\n'+input.main_activity+'\n\n';
	
	if(input.location) main_entry_str += 'This activity needs to take place at '+input.location;					
	
	var row = Ti.UI.createTableViewRow({ height: 400, object: input, type: 'activity' });
	
	var down_arrow = Ti.UI.createImageView({
		image: 'down_arrow.png',
		top: 10,
		right: 10,
		width: 20,
		height: 20,
		bubbleParent: false,
	});
	
	var dateTime = Ti.UI.createLabel({ text: "From "+input.start_date+"\nTo "+input.end_date,
										left: 5,
										top: 0, 
										font: { fontSize: 15 },
								});
								
	var top_line = Ti.UI.createView({ width: 235, height: 1, top: 40, left: 0, borderColor: 'black', borderWidth: 1 });
	
	var main_entry = Ti.UI.createLabel({
		text: main_entry_str,
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
		var activity_form = require('ui/common/forms/activity_form');
		activity_form = new activity_form(e.row.object, navGroup);
		row.next = activity_form;
		navGroup.open(activity_form);
	});
	
var actionDialog = Titanium.UI.createOptionDialog();
if(input.appointment_id) {
	actionDialog.options = ['View Appointment', 'View Full Record', 'Cancel'];
	actionDialog.cancel = 2;
}
else {
	actionDialog.options = ['View Full Record', 'Cancel'];
	actionDialog.cancel = 1;
}

actionDialog.addEventListener('click', function(e) {
	if(e.index == 0) {
		//This decides which button we are clicking
		//appointment or record
		if(actionDialog.options.length == 3) {
			var appointment_form = require('ui/common/forms/appointment_form');
			var appointment = getAppointmentLocal(input.appointment_id)[0];
			appointment_form = new appointment_form(appointment, navGroup);
			e.next = appointment_form;
			row.fireEvent('arrowClicked', e);
			navGroup.open(appointment_form);
		}
		else {
			var record = require('ui/common/views/record');
			var record_id = getEntryLocal(input.entry_id)[0].record_id;
			record = new record({ id: record_id }, navGroup);
			e.next = record;
			row.fireEvent('arrowClicked', e);
			navGroup.open(record);
		}
	}
	
	if(e.index == 1) {
		if(actionDialog.options.length == 3) {
			var record = require('ui/common/views/record');
			var record_id = getEntryLocal(input.entry_id)[0].record_id;
			record = new record({ id: record_id }, navGroup);
			e.next = record;
			row.fireEvent('arrowClicked', e);
			navGroup.open(record);
		}
	}
	
});

down_arrow.addEventListener('click', function() {
	actionDialog.show({ view: down_arrow });
});
	
	return row;
}
module.exports = home_activity;
