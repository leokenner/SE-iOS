var Cloud = require('ti.cloud');

function getRecordsACS(query /*, new_child_id */)
{
	Cloud.Objects.query({ classname: 'records', where: query }, 
		function (e) {
    		if (e.success) {
    			for(var i=e.records.length-1;i > -1 ;i--) {
				    var record = e.records[i];
					
					if((getRecordByCloudIdLocal(record.id)).length > 0) {
						updateObjectACS('records', record.id, record);
						continue;
					}

					if(!record.child_id || /^\d+$/.test(record.child_id)) { 
				    	deleteObjectACS('records', record.id);
				    	 continue; 
				    }
					
					var the_child = getChildByCloudIdLocal(record.child_id);
					
					if(!the_child) {
						deleteObjectACS('records', record.id);
						continue;
					}
					if(!the_child[0]) {
						deleteObjectACS('records', record.id);
						continue;
					}
					var new_child_id = the_child[0].id;
					
					var record_local_id = insertRecordLocal(new_child_id);
					updateRecordCloudIdLocal(record_local_id, record.id);
					updateRecordLocal(record_local_id, 'created_at', record.created_at);
					updateRecordLocal(record_local_id, 'updated_at', record.updated_at);
				}
				getEntriesACS({ user_id: query.user_id, });
			}
     		else alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	});
}


function updateRecordsACS()
{
	var user = getUserLocal(Titanium.App.Properties.getString('user'));
	user = user[0];
	
	var records = getAllRecordsLocal();
		
	for(var i=0;i < records.length; i++) {
		
		records[i].child_id = getChildLocal(records[i].child_id)[0].cloud_id;
		records[i].current = getEntryLocal(records[i].current)[0].cloud_id;
			 
		if(records[i].cloud_id && Titanium.Network.online) { 
			Cloud.Objects.update({
				    classname: 'records',
				    id: records[i].cloud_id,
				    fields: records[i],
				}, function (e) {
				    if (e.success) {
				 		
				    } else {
				        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' records');
				    }
			});
		}
		else {
		}
	}
	updateEntriesACS();
}


function createRecordsACS(record, entry)
{
	Cloud.Objects.create({
    		classname: 'records',
    		fields: record
		}, 
		function (e) {
    		if (e.success) {
        		updateRecordCloudIdLocal(record.id, e.records[0].id);
        		
        		entry.record_id = e.records[0].id;
        		
        		Cloud.Objects.create({
		    		classname: 'entries',
		    		fields: entry
				}, 
				function (e) {
		    		if (e.success) {
		        		updateRecordCloudIdLocal(entry.id, e.entries[0].id);
						
		    		} else {
		        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
		    		}
			});
        		
				
    		} else {
        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
    		}
	});
}