


function appointmentView(input) {

Ti.include('ui/common/helpers/dateTime.js');
			
	
	var view = Ti.UI.createView({
		backgroundColor: '#0EA5E9',
		borderColor: 'black',
		height: 150,
		width: '100%'
	});
	
	
	var doctor = Ti.UI.createLabel({ 
		text: input.doctor.name?'Dr. '+input.doctor.name:'Doctor Unknown', 
		left: 5,
		font: { fontSize: 15 },
		color: 'black',
		width: '100%',
		height: 45,
		top: 0
	});
	
	var top_line = Ti.UI.createView({ width: 200, height: 1, top: 45, left: 0, borderColor: 'black' });
	
	var date = Ti.UI.createLabel({
		text: input.date,
		textAlign: 1,
		font: { fontSize: 30, fontWeight: 'bold' },
		top: 60,
		width: '100%'
	});
	
	var bottom_line = Ti.UI.createView({ width: 200, height: 1, bottom: 40, right: 0, borderColor: 'black' });
	
	var status = Ti.UI.createLabel({
		text: input.status, 
		//input.complete?input.activities.length+' activities and '+input.treatments.length+' treatments':
		//						(isValidDateTime(new Date(input.date+' '+input.time)))?'Scheduled':'Missed',
		textAlign: 2,
		right: 5,
		width: '80%',
		bottom: 0,
		height: 40,
		font: { fontSize: 15, },
		backgroundColor: 'none',
	});
 	
	view.add(doctor);
	view.add(top_line);
	view.add(date);
	view.add(bottom_line);
	view.add(status);
	
	
	view.addEventListener('click', function() {
		var appointmentWindow = require('ui/common/forms/appointment_form');
		appointmentWindow = new appointmentWindow(input);
		appointmentWindow.open({ animated: true, });
		
		appointmentWindow.addEventListener('close', function() {	
			input = getAppointmentLocal(input.id);
			if(input.length == 0) {
				view.close();
				return;
			}
			input = input[0];
			input.doctor = getDoctorByAppointmentLocal(input.id)[0];
			input.symptoms = getSymptomsOfAppointmentLocal(input.id);
			
			doctor.text = input.doctor.name?'Dr. '+input.doctor.name:'Doctor Unknown';
			date.text = input.date;
			status.text = input.status;	
			
			
		});
	});
	
/*	status.addEventListener('click', function() {
		if(status.text == 'Scheduled' || status.text == 'Missed') return;
		
		var prescription = require('ui/common/forms/prescription_form');
		var actions = {
			appointment_id: input.id,
			entry_id: input.entry_id,
			activities: input.activities,
			treatments: input.treatments,
		}
		prescription = new prescription(actions);
		prescription.open(); 
	
		prescription.addEventListener('close', function() {
			input.activities = prescription.result.activities;
			input.treatments = prescription.result.treatments;
			status.text = input.activities.length+' activities and '+input.treatments.length+' treatments';
			status.bubbleParent = input.complete?0:1;
		});
}); */

	
	return view;
	
}

module.exports = appointmentView;
