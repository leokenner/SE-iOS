var Cloud = require('ti.cloud');

function getEntriesACS(query /*, record_local_id, latest_date, latest_time */)
{
	Cloud.Objects.query({ classname: 'entries', where: query }, 
		function (e) {
    		if (e.success) {
    			for(var i=e.entries.length-1;i > -1 ;i--) { 
				    var entry = e.entries[i];
				    
				    if((getEntryByCloudIdLocal(entry.id)).length > 0) {
				    	updateObjectACS('entries', entry.id, entry);
				    	continue;
				    }
				    
				    if(!entry.record_id || /^\d+$/.test(entry.record_id)) { 
				    	deleteObjectACS('entries', entry.id);
				    	 continue; 
				    }
				    
				    var record = getRecordByCloudIdLocal(entry.record_id);
				    record = record[0];
				    if(!record || !record.id) {
				    	deleteObjectACS('entries', entry.id);
				    	continue;
				    }			    
					var entry_local_id = insertEntryLocal(record.id, entry.main_entry, entry.date, entry.time, entry.created_at, entry.updated_at);
					updateEntryCloudIdLocal(entry_local_id, entry.id);

					
				}
				getAppointmentsACS({ user_id: query.user_id, });
			}
     		else alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	});
}


function updateEntriesACS()
{
	var user = getUserLocal(Titanium.App.Properties.getString('user'));
	user = user[0];
	
	var entries = getAllEntriesLocal();
		
	for(var i=0;i < entries.length; i++) {	
		
		//entries[i].local_id = entries[i].id;
		entries[i].record_id = getRecordLocal(entries[i].record_id)[0].cloud_id;
		 
		if(entries[i].cloud_id && Titanium.Network.online) {
			Cloud.Objects.update({
				    classname: 'entries',
				    id: entries[i].cloud_id,
				    fields: entries[i],
				}, function (e) {
				    if (e.success) {
				 		
				    } else {
				        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' entries');
				    }
			});
		}
		else {
		}
	}
	updateAppointmentsACS();
}


function createEntryACS(entry)
{
	var record_cloud_id = getRecordLocal(entry.record_id)[0].cloud_id;
	if(record_cloud_id) {
		entry.record_id = record_cloud_id; 
		
		Cloud.Objects.create({
		    		classname: 'entries',
		    		fields: entry
				}, 
				function (e) {
		    		if (e.success) {
		        		updateEntryCloudIdLocal(entry.id, e.entries[0].id);
		        		updateEntryLocal(entry.id, 'created_at', e.entries[0].created_at);
		        		updateEntryLocal(entry.id, 'updated_at', e.entries[0].updated_at);
						
		    		} else {
		        		Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' object creation');
		    		}
			});
	}
	else {
		var record_child_id = getRecordLocal(entry.record_id)[0].child_id;
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
						id : entry.record_id,
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