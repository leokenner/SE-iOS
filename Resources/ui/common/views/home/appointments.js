

function home_appointment(input)
{
	var record_id = getEntryLocal(input.entry_id)[0].record_id;
	var individual = getChildLocal(getRecordLocal(record_id)[0].child_id)[0];
	var main_entry_str = individual.first_name+' '+individual.last_name+' has an appointment with Dr. '+
						input.doctor.name+" for ";
	if(input.duration.hours == 1) main_entry_str += input.duration.hours +" hour ";
	else if(input.duration.hours > 1) main_entry_str += input.duration.hours + " hours ";
	if(input.duration.minutes > 1) main_entry_str += input.duration.minutes +" minutes ";
	
	main_entry_str += "regarding ";
	
	if(individual.sex === 'Male') main_entry_str += "his issues with ";
	else if(individual.sex === 'Female') main_entry_str += "her issues with ";
	else main_entry_str += "their issues with ";
	
	for(var i=0; i < input.symptoms.length; i++) {
		main_entry_str += input.symptoms[i];
		if(i < input.symptoms.length-2) main_entry_str += ", ";
		else if(i == input.symptoms.length-2) main_entry_str += " and ";
		else main_entry_str += "\n\n";
	}
	
	if(input.doctor.location) main_entry_str += "Location: "+input.doctor.location+"\n";
	if(input.doctor.street) main_entry_str += input.doctor.street + "\n";
	if(input.doctor.city) main_entry_str += input.doctor.city + "\n";
	if(input.doctor.state) main_entry_str += input.doctor.state + "\n";
	if(input.doctor.zip) main_entry_str += input.doctor.zip + "\n";
	if(input.doctor.coutnry) main_entry_str += input.doctor.country + "\n";					
	
	var row = Ti.UI.createTableViewRow({ height: 400, object: input, type: 'appointment' });
	
	var down_arrow = Ti.UI.createImageView({
		image: 'down_arrow.png',
		top: 10,
		right: 10,
		width: 20,
		height: 20,
	});
	
	var dateTime = Ti.UI.createLabel({ text: "On "+input.date+" at "+input.time,
										left: 5,
										height: 40,
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
		if(e.source.image) return;
		var appointment_form = require('ui/common/forms/appointment_form');
		appointment_form = new appointment_form(e.row.object, navGroup);
		row.next = appointment_form;
		navGroup.open(appointment_form);
	});
	
var actionDialog = Titanium.UI.createOptionDialog({
    options: ['View Full Record', 'Cancel'],
    cancel:1
});

actionDialog.addEventListener('click', function(e) {
	if(e.index == 0) {
		var record = require('ui/common/views/record');
		var record_id = getEntryLocal(input.entry_id)[0].record_id;
		record = new record({ id: record_id }, navGroup);
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
module.exports = home_appointment;
