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
				    
				    var symptoms = e.treatments[i].symptoms?e.treatments[i].symptoms:[];
				    var side_effects = e.treatments[i].side_effects?e.treatments[i].side_effects:[];
				    
				    treatment.facebook_id = treatment.facebook_id?'"'+treatment.facebook_id+'"':null;
				    
				    if(treatment.appointment_id != undefined && treatment.appointment_id != null) {
				    	var appointment = getAppointmentByCloudIdLocal(treatment.appointment_id);
				    	if(appointment.length == 0 || appointment[0].id==null || appointment[0].id==undefined) {
				    		deleteObjectACS('treatments', treatment.id);
				    		continue;
				    	}
				    	treatment.entry_id = null;  
						var treatment_local_id = insertTreatmentLocal(treatment.entry_id, '"'+appointment[0].id+'"', treatment.start_date, 
																	treatment.end_date, treatment.medication, treatment.dosage, treatment.frequency);
					}
					else {
						var entry = getEntryByCloudIdLocal(treatment.entry_id);
						if(entry.length == 0 || entry[0].id==null || entry[0].id==undefined) {
				    		deleteObjectACS('treatments', treatment.id);
				    		continue;
				    	}
						treatment.appointment_id = null;
						var treatment_local_id = insertTreatmentLocal('"'+entry[0].id+'"', treatment.appointment_id, treatment.start_date, 
																	treatment.end_date, treatment.medication, treatment.dosage, treatment.frequency);
					}
					updateTreatmentSuccessStatus(treatment_local_id, treatment.successful);
					updateTreatmentFacebookId(treatment_local_id, treatment.facebook_id);
					updateTreatmentCloudIdLocal(treatment_local_id, treatment.id);
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
		var symptoms = getSymptomsOfTreatmentLocal(treatments[i].id);
		for(var j=0; j < symptoms.length; j++) {
			symptoms[j].user_id = user.cloud_id;
		}
		treatments[i].symptoms = symptoms;
		 
		var side_effects = getSideEffectsOfTreatmentLocal(treatments[i].id);
		for(var j=0; j < side_effects.length; j++) {
			side_effects[j].user_id = user.cloud_id;
		}
		treatments[i].side_effects = side_effects;
		
		if(treatments[i].appointment_id) treatments[i].appointment_id = getAppointmentLocal(treatments[i].appointment_id)[0].cloud_id;
		else treatments[i].entry_id = getEntryLocal(treatments[i].entry_id)[0].cloud_id;
		 
		if(treatments[i].cloud_id) { 
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
}