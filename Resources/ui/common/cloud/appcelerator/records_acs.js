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
					
					if(record.child_id==null || record.child_id==undefined || /^\d+$/.test(record.child_id)) { 
				    	deleteObjectACS('records', record.id);
				    	 continue; 
				    }
					
					var new_child_id = getChildByCloudId(record.child_id)[0].id;
					
					if(new_child_id==null || new_child_id==undefined) {
						deleteObjectACS('records', record.id);
						continue;
					}
					
					var record_local_id = insertRecordLocal(new_child_id);
					updateRecordCloudIdLocal(record_local_id, record.id);
					updateRecordLocal(record_local_id, 100, 'entry', record.latest_date, record.latest_time);
					//getEntriesACS({ user_id: query.user_id, record_id: record.id, }, record_local_id, record.latest_date, record.latest_time)
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
			 
		if(records[i].cloud_id) { 
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
}


function createRecordsACS()
{
	var records = getAllRecordsLocal();
	
	for(var i=0; i < records.length; i++) {
		if(!records[i].cloud_id) {
			createObjectACS('records', records[i]);
		}
	}
}