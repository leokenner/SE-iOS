var Cloud = require('ti.cloud');


/*
 * Create a new object in ACS
 * inputs: the object name and the object itself
 * outputs: the object upon success, null upon failure
 */
function createObjectACS(objectName, object)
{
	Cloud.Objects.create({
    		classname: objectName,
    		fields: object
		}, 
		function (e) {
    		if (e.success) {
        		if(objectName == 'children') {
        			updateChildCloudIdLocal(object.id, e.children[0].id);
        		}
        		else if(objectName == 'records') {
        			updateRecordCloudIdLocal(object.id, e.records[0].id);
        		}
        		else if(objectName == 'entries') {
        			updateEntryCloudIdLocal(object.id, e.entries[0].id);
        		}
        		else if(objectName == 'appointments') {
        			updateAppointmentCloudIdLocal(object.id, e.appointments[0].id);
        		}
        		else if(objectName == 'activities') {
        			updateActivityCloudIdLocal(object.id, e.activities[0].id);
        		}
        		else if(objectName == 'treatments') {
        			updateTreatmentCloudIdLocal(object.id, e.treatments[0].id);
        		}
    		} else {
        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
    		}
	});
}


/*
 * update an object in the Titanium ACS
 * input: id of the object, the object in questions, the fields that need to be updated
 * output: the updated object if successful, null if unsuccessful
 */
function updateObjectACS(objectName, id, fields)
{
	Cloud.Objects.update({
    		classname: object,
    		id: id,
    		fields: fields
		}, 
		function (e) {
    		if (e.success) {
        		return e.object[0];
    		} else {
        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
        		return null;
    		}
	});
}

/*
 * queries for objects from the titanium cloud
 * inputs: user: the user in question
 * 		   object: the object class in question
 * output: the object array if successful, or an empty array if unsuccessful
 */
function queryObjectACS(user, object, return_array)
{
	Cloud.Objects.query({
			classname: object,
			user: user
		}, 
		function (e) {
			alert('entered the callback');
	    	if (e.success) {
	    		return e.object;
	    	} else {
	    		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	     		return [];
	    	}
	});  
}

/*
 * deletes an object from the appcelerator cloud
 * inputs: user: the cloud id of the user
 * 			object: the class in question
 * 	outputs: boolean: success or failure
 */
function deleteObjectACS(objectName, id)
{
	Cloud.Objects.remove({
    		classname: objectName,
    		id: id
		}, 
		function (e) {
    		if (e.success) {

    		} else {
        		alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
        		return false;
    		}
	});
}
