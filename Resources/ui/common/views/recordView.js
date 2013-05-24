
function recordView(input)
{
	Ti.include('ui/common/database/database.js');
	
	
	var table = Ti.UI.createTableView({
		borderColor: 'black',
		height: 45,
	});

	
	if(input)
	{
		if(input.entry) { 
			var row = Ti.UI.createTableViewRow();
			var entryView = require('ui/common/views/entryView');
			input.entry.activities = getActivitiesForEntryLocal(input.entry.id);
			for(var i=0;i<input.entry.activities.length;i++) {
				input.entry.activities[i].goals = getGoalsOfActivityLocal(input.entry.activities[i].id);
			}
			input.entry.treatments = getTreatmentsForEntryLocal(input.entry.id);
			for(var i=0;i<input.entry.treatments.length;i++) {
				input.entry.treatments[i].symptoms = getSymptomsOfTreatmentLocal(input.entry.treatments[i].id);
				input.entry.treatments[i].sideEffects = getSideEffectsOfTreatmentLocal(input.entry.treatments[i].id);
			}
			entryView = new entryView(input.entry);
			row.add(entryView);
			
			row.setHeight(entryView.height);
			table.appendRow(row);
			table.setHeight(row.height+table.height);
			
			var full_record = getAppointmentsForEntryLocal(input.entry.id);
			for(var i=0;i < full_record.length; i++) {
				var appointment = full_record[i];
				var doctor = getDoctorByAppointmentLocal(appointment.id);
				appointment.doctor = doctor[0];
				appointment.categories = getCategoriesOfAppointmentLocal(appointment.id);
				appointment.symptoms = getSymptomsOfAppointmentLocal(appointment.id);
				appointment.activities = getActivitiesForAppointmentLocal(appointment.id);
				appointment.treatments = getTreatmentsForAppointmentLocal(appointment.id);
				for(var j=0;j<appointment.activities.length;j++) {
					appointment.activities[j].goals = getGoalsOfActivityLocal(appointment.activities[j].id);
				}
				for(var j=0;j<appointment.treatments.length;j++) {
					appointment.treatments[j].symptoms = getSymptomsOfTreatmentLocal(appointment.treatments[j].id);
					appointment.treatments[j].sideEffects = getSideEffectsOfTreatmentLocal(appointment.treatments[j].id);
				}
				
				
				var appointmentView = require('ui/common/views/appointmentView');
				appointmentView = new appointmentView(appointment);
			
				var row = Ti.UI.createTableViewRow();
				row.add(appointmentView);
				table.appendRow(row);
				table.setHeight(table.height+appointmentView.height);
			}
				Ti.App.fireEvent('eventAdded');
		}
	}
	
	var footerView = Ti.UI.createView({ height: '45', width: '100%' });
	
	var newAppointment_btn = Ti.UI.createLabel({
		text: 'New Appointment',
		textAlign: 1,
		backgroundColor: 'white',
		font: { fontWeigth: 'bold' },
		color: 'black',
		width: '100%',
		height: 45,
		borderColor: 'black',
		left: 0
	});
	footerView.add(newAppointment_btn);
	
	newAppointment_btn.addEventListener('click', function() {
		var appointment_form = require('ui/common/forms/appointment_form');
		var appointment = { id: null, entry_id: input.entry.id, activities: null, treatments: null, };
		appointment_form = new appointment_form(appointment);
		appointment_form.open();
		
		appointment_form.addEventListener('close', function() {
			if(appointment_form.result != null) { 
				var appointment = require('ui/common/views/appointmentView');
				appointment = new appointment(appointment_form.result);
			
				var row = Ti.UI.createTableViewRow();
				row.add(appointment);
				table.appendRow(row);
				table.setHeight(table.height+150);
				table.fireEvent('eventAdded');
			}
		});
	}); 
	
	table.setFooterView(footerView);
	
	return table;
}

module.exports = recordView;
