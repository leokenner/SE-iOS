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
				    
				    if(!appointment.entry_id || /^\d+$/.test(appointment.entry_id)) { 
				    	deleteObjectACS('appointments', appointment.id);
				    	 continue; 
				    } 
				    var the_entry = getEntryByCloudIdLocal(appointment.entry_id);
				    if(the_entry.length == 0) {
				    	deleteObjectACS('appointments', appointment.id);
				    	continue;
				    }
				    var entry_local_id = the_entry[0].id;
				    
				    var doctor = e.appointments[i].doctor;
				    var categories = e.appointments[i].categories?e.appointments[i].categories:[];
				    var symptoms = e.appointments[i].symptoms?e.appointments[i].symptoms:[];
					var appointment_local_id = insertAppointmentLocal(entry_local_id, appointment.date, appointment.time, appointment.created_at, appointment.updated_at);
					updateAppointmentLocal(appointment_local_id, 'date', appointment.date);
					updateAppointmentLocal(appointment_local_id, 'time', appointment.time);
					if(appointment.calendar_event_id) updateAppointmentLocal(appointment_local_id, 'calendar_event_id', appointment.calendar_event_id);
					//updateAppointmentLocal(appointment_local_id, 'diagnosis', appointment.diagnosis);
					//updateAppointmentLocal(appointment_local_id, 'final_diagnosis', appointment.final_diagnosis);
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
		 
		if(appointments[i].cloud_id && Titanium.Network.online) { 
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


function createAppointmentACS(appointment, entry)
{
	
	var entry_cloud_id = getEntryLocal(appointment.entry_id)[0].cloud_id;
	if(entry_cloud_id) {
		appointment.child_id = getChildLocal(getRecordLocal(getEntryLocal(appointment.entry_id)[0].record_id)[0].child_id)[0].cloud_id;
		appointment.entry_id = entry_cloud_id;		 
		
		Cloud.Objects.create({
		    		classname: 'appointments',
		    		fields: appointment
				}, 
				function (e) {
		    		if (e.success) {
		        		updateAppointmentCloudIdLocal(appointment.id, e.appointments[0].id);
		        		updateAppointmentLocal(appointment.id, 'created_at', e.appointments[0].created_at);
		        		updateAppointmentLocal(appointment.id, 'updated_at', e.appointments[0].updated_at);
						
		    		} else {
		        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
		    		}
			});
	}
	else {
		var entry_record_id = getEntryLocal(appointment.entry_id)[0].id;
		var record_child_id = getRecordLocal(entry_record_id)[0].child_id;
		var child = getChildLocal(record_child_id)[0];
		
		if(!child.cloud_id) {
			child.user_id = getUserLocal(Titanium.App.Properties.getString('user'))[0].cloud_id;
			 
			Cloud.Objects.create({
				classname: 'children',
				fields: child
			}, function (e) {
				if(e.success) {
					updateChildCloudIdLocal(child.id, e.children[0].id);
					updateChildLocal(child.id, 'created_at', e.children[0].created_at);
					updateChildLocal(child.id, 'updated_at', e.children[0].updated_at);
					
					var record = {
						id : entry_record_id,
						child_id : e.children[0].id,
					}
					
					Cloud.Objects.create({
				    		classname: 'records',
				    		fields: record
						}, 
						function (e) {
				    		if (e.success) {
				        		updateRecordCloudIdLocal(record.id, e.records[0].id);
				        		updateRecordLocal(record.id, 'created_at', e.records[0].created_at);
				        		updateRecordLocal(record.id, 'updated_at', e.records[0].updated_at);
				        		
				        		entry.child_id = record.child_id;
				        		entry.record_id = e.records[0].id;
				        		
				        		Cloud.Objects.create({
						    		classname: 'entries',
						    		fields: entry
								}, 
									function (e) {
							    		if (e.success) {
							        		updateEntryCloudIdLocal(entry.id, e.entries[0].id);
							        		updateEntryLocal(entry.id, 'created_at', e.entries[0].created_at);
							        		updateEntryLocal(entry.id, 'updated_at', e.entries[0].updated_at);
							        		
							        		appointment.child_id = record.child_id;
							        		appointment.entry_id = e.entries[0].id;
							        		
							        		Cloud.Objects.create({
									    		classname: 'appointments',
									    		fields: appointment
											}, 
												function (e) {
										    		if (e.success) {
										        		updateAppointmentCloudIdLocal(appointment.id, e.appointments[0].id);
										        		updateAppointmentLocal(appointment.id, 'created_at', e.appointments[0].created_at);
										        		updateAppointmentLocal(appointment.id, 'updated_at', e.appointments[0].updated_at);
										        	
														
										    		} else {
										        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
										    		}
											});
											
							    		} else {
							        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
							    		}
								});
				        		
								
				    		} else {
				        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
				    		}
					});
				}
				else {
					Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
				}
			});
		}
		
		else { 
			var record = {
				id: entry_record_id,
				child_id : child.cloud_id,
			}
		 
			Cloud.Objects.create({
		    		classname: 'records',
		    		fields: record
				}, 
				function (e) {
		    		if (e.success) {
		        		updateRecordCloudIdLocal(record.id, e.records[0].id);
		        		updateRecordLocal(record.id, 'created_at', e.records[0].created_at);
		        		updateRecordLocal(record.id, 'updated_at', e.records[0].updated_at);
		        		
		        		entry.child_id = record.child_id;
		        		entry.record_id = e.records[0].id;
		        		
		        		Cloud.Objects.create({
				    		classname: 'entries',
				    		fields: entry
						}, 
						function (e) {
				    		if (e.success) {
				        		updateEntryCloudIdLocal(entry.id, e.entries[0].id);
				        		updateEntryLocal(entry.id, 'created_at', e.entries[0].created_at);
				        		updateEntryLocal(entry.id, 'updated_at', e.entries[0].updated_at);
				        		
				        		appointment.child_id = record.child_id;
				        		appointment.entry_id = e.entries[0].id;
				        		
				        		Cloud.Objects.create({
						    		classname: 'appointments',
						    		fields: appointment
								}, 
									function (e) {
							    		if (e.success) {
							        		updateAppointmentCloudIdLocal(entry.id, e.appointments[0].id);
							        		updateAppointmentLocal(appointment.id, 'created_at', e.appointments[0].created_at);
							        		updateAppointmentLocal(appointment.id, 'updated_at', e.appointments[0].updated_at);
							        		
											
							    		} else {
							        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
							    		}
								});
								
				    		} else {
				        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
				    		}
					});
		        		
						
		    		} else {
		        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
		    		}
			});
		}
	}
}