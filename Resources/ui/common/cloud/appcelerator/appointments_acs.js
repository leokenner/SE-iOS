var Cloud = require('ti.cloud');

function getAppointmentsACS(query /*, entry_local_id */)
{
	Cloud.Objects.query({ classname: 'appointments', where: query }, 
		function (e) {
    		if (e.success) {
    			for(var i=e.appointments.length-1;i > -1 ;i--) { 
				    var appointment = e.appointments[i];
				    
				    if((getAppointmentByCloudIdLocal(appointment.id)).length > 0) {
				    	updateObjectACS('appointments', appointment.id, appointment);
				    	continue;
				    }
				    
				    if(appointment.entry_id == null || appointment.entry_id == undefined || /^\d+$/.test(appointment.entry_id)) { 
				    	deleteObjectACS('appointments', appointment.id);
				    	 continue; 
				    } 
				    var entry_local_id = getEntryByCloudIdLocal(appointment.entry_id)[0].id;
				    if(entry_local_id==null || entry_local_id==undefined) {
				    	deleteObjectACS('appointments', appointment.id);
				    	continue;
				    }
				    
				    var doctor = e.appointments[i].doctor;
				    var categories = e.appointments[i].categories?e.appointments[i].categories:[];
				    var symptoms = e.appointments[i].symptoms?e.appointments[i].symptoms:[];
					var appointment_local_id = insertAppointmentLocal(entry_local_id, appointment.date, appointment.time);
					updateAppointmentLocal(appointment_local_id, 'date', appointment.date);
					updateAppointmentLocal(appointment_local_id, 'time', appointment.time);
					updateAppointmentLocal(appointment_local_id, 'diagnosis', appointment.diagnosis);
					updateAppointmentLocal(appointment_local_id, 'final_diagnosis', appointment.final_diagnosis);
					if(appointment.duration == undefined) {
						appointment.duration = { 
							hours: '0',
							minutes: '0',
						}
					}
					updateAppointmentLocal(appointment_local_id, 'duration_hours', appointment.duration.hours);
					updateAppointmentLocal(appointment_local_id, 'duration_minutes', appointment.duration.minutes);
					updateAppointmentLocal(appointment_local_id, 'additional_notes', appointment.additional_notes);
					updateAppointmentLocal(appointment_local_id, 'status', appointment.status);
					updateAppointmentCloudIdLocal(appointment_local_id, appointment.id);
					insertDoctorForAppointmentLocal(appointment_local_id, doctor.name, doctor.location, doctor.street, doctor.city, doctor.state, doctor.zip, doctor.country);
					for(var j=0; j < symptoms.length; j++) {
						insertSymptomForAppointmentLocal(appointment_local_id, symptoms[j]);
					}
				}
				getActivitiesACS({ user_id: query.user_id, });
			}
     		else alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	});
}


function updateAppointmentsACS()
{
	var user = getUserLocal(Titanium.App.Properties.getString('user'));
	user = user[0];
	
	var appointments = getAllAppointmentsLocal();
		
	for(var i=0;i < appointments.length; i++) {
		var doctors = getDoctorByAppointmentLocal(appointments[i].id);
		var doctor = doctors[0];
		appointments[i].doctor = doctor;
		
		var symptoms = getSymptomsOfAppointmentLocal(appointments[i].id);
		for(var j=0; j < symptoms.length; j++) {
			symptoms[j].user_id = user.cloud_id;
		}
		appointments[i].symptoms = symptoms;
		
		appointments[i].entry_id = getEntryLocal(appointments[i].entry_id)[0].cloud_id;
		 
		if(appointments[i].cloud_id) { 
			Cloud.Objects.update({
				    classname: 'appointments',
				    id: appointments[i].cloud_id,
				    fields: appointments[i],
				}, function (e) {
				    if (e.success) {
				 		
				    } else {
				        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				    }
			});
		}
		else {
		}
	}
	updateActivitiesACS();
}