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
				    
				    var goals = e.activities[i].goals?e.activities[i].goals:[];
				    
				    activity.facebook_id = activity.facebook_id?'"'+activity.facebook_id+'"':null;
				    
				    if(activity.appointment_id != null && activity.appointment_id != undefined) {
				    	var appointment = getAppointmentByCloudIdLocal(activity.appointment_id);
				    	if(appointment.length==0 || appointment[0].id==null || appointment[0].id==undefined) {
				    		deleteObjectACS('activities', activity.id);
				    		continue;
				    	}
				    	activity.entry_id = null; 
						var activity_local_id = insertActivityLocal(activity.entry_id, '"'+appointment[0].id+'"', activity.main_activity, 
																activity.start_date, activity.end_date, activity.location, activity.frequency);
					}
					else {
						var entry = getEntryByCloudIdLocal(activity.entry_id);
						if(entry.length==0 || entry[0].id==null || entry[0].id==undefined) {
							deleteObjectACS('activities', activity.id);
							continue;
						}
						activity.appointment_id = null;
						var activity_local_id = insertActivityLocal('"'+entry[0].id+'"', activity.appointment_id, activity.main_activity, 
																activity.start_date, activity.end_date, activity.location, activity.frequency);
					}
					updateActivitySuccessStatus(activity_local_id, activity.successful);
					updateActivityEndNotes(activity_local_id, activity.end_notes);
					updateActivityFacebookId(activity_local_id, activity.facebook_id);
					updateActivityCloudIdLocal(activity_local_id, activity.id);
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
		var goals = getGoalsOfActivityLocal(activities[i].id);
		for(var j=0; j < goals.length; j++) {
			goals[j].user_id = user.cloud_id;
		}
		activities[i].goals = goals;
		
		if(activities[i].appointment_id) activities[i].appointment_id = getAppointmentLocal(activities[i].appointment_id)[0].cloud_id;
		else activities[i].entry_id = getEntryLocal(activities[i].entry_id)[0].cloud_id;
		 
		if(activities[i].cloud_id) { 
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
}