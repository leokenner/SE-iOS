var Cloud = require('ti.cloud');

function getActivitiesACS(query)
{
	var user = getUserLocal(Titanium.App.Properties.getString('user'));
	
	Cloud.Objects.query({ classname: 'activities', where: query }, 
		function (e) {
    		if (e.success) { 
    			for(var i=e.activities.length-1;i > -1 ;i--) { 
				    var activity = e.activities[i];
				    
				    if((getActivityByCloudIdLocal(activity.id)).length > 0) {
				    	updateObjectACS('activities', activity.id, activity);
				    	continue;
				    }
				    
				    if(/^\d+$/.test(activity.entry_id)) { 
				    	deleteObjectACS('activities', activity.id);
				    	 continue; 
				    }
				    
				    var times = e.activities[i].times?e.activities[i].times:[];
				    var goals = e.activities[i].goals?e.activities[i].goals:[];
				    var calendar_event_ids = e.activities[i].calendar_event_ids?e.activities[i].calendar_event_ids:[];
				    
				    if(activity.appointment_id) {
				    	var appointment = getAppointmentByCloudIdLocal(activity.appointment_id);
				    	if(appointment.length==0) {
				    		deleteObjectACS('activities', activity.id);
				    		continue;
				    	}
				    	var appointment_local_id = appointment[0].id;
				    }
				    else {
				    	var appointment_local_id = null;
				    }
				    	
				    var entry = getEntryByCloudIdLocal(activity.entry_id);
					if(entry.length == 0) {
				    	deleteObjectACS('activities', activity.id);
				    	continue;
				    }
				    
						var entry_local_id = entry[0].id;
						var activity_local_id = insertActivityLocal(entry_local_id, appointment_local_id, activity.main_activity, 
																activity.start_date, activity.end_date, activity.frequency, 
																activity.interval, activity.alert, activity.created_at, activity.updated_at);
																
					updateActivityLocal(activity_local_id, 'status', activity.status);
					updateActivityLocal(activity_local_id, 'location', activity.location);
					//updateActivityLocal(activity_local_id, 'recommended_by', activity.recommended_by);
					//updateActivityLocal(activity_local_id, 'diagnosis', activity.diagnosis);
					updateActivityLocal(activity_local_id, 'additional_notes', activity.additional_notes);
					updateActivityCloudIdLocal(activity_local_id, activity.id);

					for(var j=0; j < times.length; j++) {
						insertTimeForActivityLocal(activity_local_id, times[j]);
						if(calendar_event_ids[j]) updateActivityTimesLocal(activity_local_id, times[j], 'calendar_event_id', calendar_event_ids[j]);
					}
					for(var j=0; j < goals.length; j++) {
						insertGoalForActivityLocal(activity_local_id, goals[j]);
					}
				}
				getTreatmentsACS({ user_id: query.user_id, }); 
			}
     		else alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	});
}


function updateActivitiesACS()
{
	var user = getUserLocal(Titanium.App.Properties.getString('user'));
	user = user[0];
	
	var activities = getAllActivitiesLocal();
		
	for(var i=0;i < activities.length; i++) {
		if(activities[i].appointment_id) activities[i].appointment_id = getAppointmentLocal(activities[i].appointment_id)[0].cloud_id;
		activities[i].entry_id = getEntryLocal(activities[i].entry_id)[0].cloud_id;
		 
		if(activities[i].cloud_id && Titanium.Network.online) { 
			Cloud.Objects.update({
				    classname: 'activities',
				    id: activities[i].cloud_id,
				    fields: activities[i],
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
	updateTreatmentsACS(); 
}


function createActivityACS(activity, entry)
{
	if(activity.appointment_id) activity.appointment_id = getAppointmentLocal(activity.appointment_id)[0].cloud_id;
	
	var entry_cloud_id = getEntryLocal(activity.entry_id)[0].cloud_id;
	if(entry_cloud_id) {
		activity.child_id = getChildLocal(getRecordLocal(getEntryLocal(activity.entry_id)[0].record_id)[0].child_id)[0].cloud_id;
		activity.entry_id = entry_cloud_id;		 
		
		Cloud.Objects.create({
		    		classname: 'activities',
		    		fields: activity
				}, 
				function (e) {
		    		if (e.success) {
		        		updateActivityCloudIdLocal(activity.id, e.activities[0].id);
		        		updateActivityLocal(activity.id, 'created_at', e.activities[0].created_at);
		        		updateActivityLocal(activity.id, 'updated_at', e.activities[0].updated_at);
						
		    		} else {
		        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
		    		}
			});
	}
	else {
		var entry_record_id = getEntryLocal(activity.entry_id)[0].id;
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
							        		
							        		activity.child_id = record.child_id;
							        		activity.entry_id = e.entries[0].id;
							        		//activity.goals = getGoalsOfActivityLocal(activity.id);
							        		
							        		Cloud.Objects.create({
									    		classname: 'activities',
									    		fields: activity
											}, 
												function (e) {
										    		if (e.success) {
										        		updateActivityCloudIdLocal(activity.id, e.activities[0].id);
										        		updateActivityLocal(activity.id, 'created_at', e.activities[0].created_at);
										        		updateActivityLocal(activity.id, 'updated_at', e.activities[0].updated_at);
										        	
														
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
				        		
				        		activity.child_id = record.child_id;
				        		activity.entry_id = e.entries[0].id;
				        		//activity.goals = getGoalsOfActivityLocal(activity.id);
				        		
				        		Cloud.Objects.create({
						    		classname: 'activities',
						    		fields: activity
								}, 
									function (e) {
							    		if (e.success) {
							        		updateActivityCloudIdLocal(activity.id, e.activities[0].id);
							        		updateActivityLocal(activity.id, 'created_at', e.activities[0].created_at);
							        		updateActivityLocal(activity.id, 'updated_at', e.activities[0].updated_at);
							        		
											
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