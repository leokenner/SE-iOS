

function entrySection(input, navGroup)
{
	function getBackgroundColor(the_input)
	{
		if(the_input.status === 'Scheduled') {  
			return 'yellow';
		}
		else if(the_input.status === 'Cancelled') {
			return 'red';
		}
		return 'white';
	}
	
	var self = Ti.UI.createTableViewSection({ headerTitle: ' ', object: input, });
	var rowEntry = Ti.UI.createTableViewRow({ height: 250, hasChild: true, });
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
		height: 160,
	});
	
	var updatedDateTime = jsonDateStringTimeFormatted(jsonDateToRegularDateString(input.updated_at));
	var updated = Ti.UI.createLabel({
		text: 'Last updated:\n'+updatedDateTime.date+' '+updatedDateTime.time,
		left: 5,
		bottom: 0,
		height: 60,
		font: { fontSize: 15 },
	});
	rowEntry.add(dateTime);
	rowEntry.add(top_line);
	rowEntry.add(main_entry);
	rowEntry.add(updated);
	self.add(rowEntry);
	
	var rowActions = Ti.UI.createTableViewRow({ height: 80, hasChild: true, });
	var actions_title = Titanium.UI.createLabel({ text: 'Self-prescribed actions', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	rowActions.add(actions_title);
	self.add(rowActions);
	
	var rowAppointments = Ti.UI.createTableViewRow({ height: 80, hasChild: true, });
	var appointments_title = Titanium.UI.createLabel({ text: 'Appointments', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	rowAppointments.add(appointments_title);
	self.add(rowAppointments);
	
	rowEntry.addEventListener('click', function(e) {
		var entry_form = require('ui/common/forms/entry_form');
		entry_form = new entry_form(input, navGroup);
		navGroup.open(entry_form);
		
		entry_form.addEventListener('close', function() {
			self.fireEvent('entryEdited');
			var entry = getEntryLocal(input.id);
			if(entry.length == 1) { 
				dateTime.text = "On "+entry[0].date+" at "+entry[0].time;
				main_entry.text = entry[0].main_entry;
			}
		}); 
	});
	
	rowActions.addEventListener('click', function() {
		var actions_page = require('ui/common/views/actions');
		var actions = {
			entry_id: input.id,
		}
		actions_page = new actions_page(actions, navGroup);
		navGroup.open(actions_page); 
	});
	
	rowAppointments.addEventListener('click', function() {
		var appointments_page = require('ui/common/views/appointments');
		var appointments = {
			entry_id: input.id,
		}
		appointments_page = new appointments_page(appointments, navGroup);
		navGroup.open(appointments_page); 
	});
	
return self;	
	
}
module.exports = entrySection;
