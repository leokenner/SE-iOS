var Cloud = require('ti.cloud');

function getTreatmentsACS(query)
{
	Cloud.Objects.query({ classname: 'treatments', where: query }, 
		function (e) {
    		if (e.success) {
    			for(var i=e.treatments.length-1;i > -1 ;i--) { 
				    var treatment = e.treatments[i];
				    
				    if((getTreatmentByCloudIdLocal(treatment.id)).length > 0) {
				    	updateObjectACS('treatments', treatment.id, treatment);
				    	continue;
				    }
				    
				    if(/^\d+$/.test(treatment.entry_id)) { 
				    	deleteObjectACS('treatments', treatment.id);
				    	 continue; 
				    }
				    
				    var categories = e.treatments[i].categories?e.treatments[i].categories:[];
				    var times = e.treatments[i].times?e.treatments[i].times:[];
				    var calendar_event_ids = e.treatments[i].calendar_event_ids?e.treatments[i].calendar_event_ids:[];
				    var symptoms = e.treatments[i].symptoms?e.treatments[i].symptoms:[];
				    var side_effects = e.treatments[i].side_effects?e.treatments[i].side_effects:[];
				    var appointment_id=null;
				    var entry_id=null;
				    
				    if(treatment.appointment_id) {
				    	var appointment = getAppointmentByCloudIdLocal(treatment.appointment_id);
				    	if(appointment.length == 0) {
				    		deleteObjectACS('treatments', treatment.id);
				    		continue;
				    	}
				    	var appointment_local_id = appointment[0].id;
				    }
				    else {
				    	var appointment_local_id = null;
				    }
				    
				    var entry = getEntryByCloudIdLocal(treatment.entry_id);
					if(entry.length == 0) {
				    	deleteObjectACS('treatments', treatment.id);
				    	continue;
				    }
				    
						var entry_local_id = entry[0].id;
						var treatment_local_id = insertTreatmentLocal(entry_local_id, appointment_local_id, treatment.start_date, 
																	treatment.end_date, treatment.medication, treatment.type, 
																	treatment.dosage, treatment.frequency, treatment.interval, 
																	treatment.alert, treatment.created_at, treatment.updated_at);
					
					updateTreatmentLocal(treatment_local_id, 'status', treatment.status);
					//updateTreatmentLocal(treatment_local_id, 'prescribed_by', treatment.prescribed_by);
					updateTreatmentLocal(treatment_local_id, 'diagnosis', treatment.diagnosis);
					updateTreatmentLocal(treatment_local_id, 'additional_notes', treatment.additional_notes);
					//updateTreatmentLocal(treatment_local_id, 'successful', treatment.successful);
					//updateTreatmentLocal(treatment_local_id, 'facebook_id', treatment.facebook_id);
					updateTreatmentCloudIdLocal(treatment_local_id, treatment.id);
					for(var j=0; j < categories.length; j++) {
						insertCategoryForTreatmentLocal(treatment_local_id, categories[j]);
					}
					for(var j=0; j < times.length; j++) {
						insertTimeForTreatmentLocal(treatment_local_id, times[j]);
						if(calendar_event_ids[j]) updateTreatmentTimesLocal(treatment_local_id, times[j], 'calendar_event_id', calendar_event_ids[j]);
					}
					for(var j=0; j < symptoms.length; j++) {
						insertSymptomForTreatmentLocal(treatment_local_id, symptoms[j]);
					}
					for(var j=0; j < side_effects.length; j++) {
						insertSideEffectForTreatmentLocal(treatment_local_id, side_effects[j]);
					}
				}
				Ti.App.fireEvent('loadFromCloudComplete'); 
			}
     		else alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	});
}


function updateTreatmentsACS()
{	
	var user = getUserLocal(Titanium.App.Properties.getString('user'));
	user = user[0];
	
	var treatments = getAllTreatmentsLocal();
		
	for(var i=0;i < treatments.length; i++) {
		if(treatments[i].appointment_id) treatments[i].appointment_id = getAppointmentLocal(treatments[i].appointment_id)[0].cloud_id;
		treatments[i].entry_id = getEntryLocal(treatments[i].entry_id)[0].cloud_id;
		 
		if(treatments[i].cloud_id && Titanium.Network.online) { 
			Cloud.Objects.update({
				    classname: 'treatments',
				    id: treatments[i].cloud_id,
				    fields: treatments[i],
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
	
if(fb.loggedIn) {
	fb.logout();
	logoutUserACS();			
}
Ti.App.fireEvent('logoutClicked');	
	
}


function createTreatmentACS(treatment, entry)
{
	if(treatment.appointment_id) treatment.appointment_id = getAppointmentLocal(treatment.appointment_id)[0].cloud_id;
	
	var entry_cloud_id = getEntryLocal(treatment.entry_id)[0].cloud_id;
	if(entry_cloud_id) {
		treatment.child_id = getChildLocal(getRecordLocal(getEntryLocal(treatment.entry_id)[0].record_id)[0].child_id)[0].cloud_id;
		treatment.entry_id = entry_cloud_id; 
		
		
		Cloud.Objects.create({
		    		classname: 'treatments',
		    		fields: treatment
				}, 
				function (e) {
		    		if (e.success) {
		        		updateTreatmentCloudIdLocal(treatment.id, e.treatments[0].id);
		        		updateTreatmentLocal(treatment.id, 'created_at', e.treatments[0].created_at);
		        		updateTreatmentLocal(treatment.id, 'updated_at', e.treatments[0].updated_at);
						
		    		} else {
		        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
		    		}
			});
	}
	else {
		var entry_record_id = getEntryLocal(treatment.entry_id)[0].id;
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
							        		
							        		treatment.child_id = record.child_id;
							        		treatment.entry_id = e.entries[0].id;
							        		//treatment.symptoms = getSymptomsOfTreatmentLocal(treatment.id);
							        		
							        		Cloud.Objects.create({
									    		classname: 'treatments',
									    		fields: treatment
											}, 
												function (e) {
										    		if (e.success) {
										        		updateTreatmentCloudIdLocal(treatment.id, e.treatments[0].id);
										        		updateTreatmentLocal(treatment.id, 'created_at', e.treatments[0].created_at);
										        		updateTreatmentLocal(treatment.id, 'updated_at', e.treatments[0].updated_at);
										        	
														
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
				        		
				        		treatment.child_id = record.child_id;
				        		treatment.entry_id = e.entries[0].id;
				        		//treatment.symptoms = getSymptomsOfTreatmentLocal(treatment.id);
				        		
				        		Cloud.Objects.create({
						    		classname: 'treatments',
						    		fields: treatment
								}, 
									function (e) {
							    		if (e.success) {
							        		updateTreatmentCloudIdLocal(treatment.id, e.treatments[0].id);
							        		updateTreatmentLocal(treatment.id, 'created_at', e.treatments[0].created_at);
							        		updateTreatmentLocal(treatment.id, 'updated_at', e.treatments[0].updated_at);
							        		
											
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