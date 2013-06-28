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
				    
				    if(activity.appointment_id != null && activity.appointment_id != undefined) {
				    	var appointment = getAppointmentByCloudIdLocal(activity.appointment_id);
				    	if(appointment.length==0 || appointment[0].id==null || appointment[0].id==undefined) {
				    		deleteObjectACS('activities', activity.id);
				    		continue;
				    	}
				    }
				    	var entry = getEntryByCloudIdLocal(activity.entry_id);
						if(entry.length == 0 || entry[0].id==null || entry[0].id==undefined) {
				    		deleteObjectACS('activities', activity.id);
				    		continue;
				    	}
				    
				    	appointment_id = '"'+appointment[0].id+'"';	
						entry_id = '"'+entry[0].id+'"';
						var activity_local_id = insertActivityLocal(entry_id, appointment_id, activity.main_activity, 
																activity.start_date, activity.end_date, activity.frequency, 
																activity.interval, activity.alert, activity.created_at, activity.updated_at);
																
					updateActivityLocal(activity_local_id, 'status', activity.status);
					//updateActivityLocal(activity_local_id, 'recommended_by', activity.recommended_by);
					//updateActivityLocal(activity_local_id, 'diagnosis', activity.diagnosis);
					updateActivityLocal(activity_local_id, 'additional_notes', activity.additional_notes);
					updateActivityCloudIdLocal(activity_local_id, activity.id);

					for(var j=0; j < times.length; j++) {
						insertTimeForActivityLocal(activity_local_id, times[j]);
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