var Cloud = require('ti.cloud');

function getChildrenACS(query)
{
	Cloud.Objects.query({ classname: 'children', where: query }, 
		function (e) {
    		if (e.success) {
    			for(var i=e.children.length-1;i > -1 ;i--) {
				    var child = e.children[i];
				    
				    if((getChildByCloudIdLocal(child.id)).length > 0) {
				    	updateObjectACS('children', child.id, child);
				    	continue;
				    }
				    
				    if(child.user_id==null || child.user_id==undefined || /^\d+$/.test(child.user_id)) { 
				    	deleteObjectACS('children', child.id);
				    	 continue; 
				    }
				    
				    var relationships = e.children[i].relationships?e.children[i].relationships:[];
				    child.sex = child.sex?'"'+child.sex+'"':null;
				    child.date_of_birth = child.date_of_birth?'"'+child.date_of_birth+'"':null;
					child.diagnosis = child.diagnosis?'"'+child.diagnosis+'"':null;
					var child_local_id = insertChildLocal(Titanium.App.Properties.getString('user'), child.first_name, child.last_name, child.sex ,child.date_of_birth , child.diagnosis);
					updateChildCloudIdLocal(child_local_id, child.id);
					for(var j=0; j < relationships.length; j++) {
						insertRelationshipLocal(child_local_id,Titanium.App.Properties.getString('user'),relationships[j].relation);
					}
					//getRecordsACS({ user_id: query.user_id, child_id: child.id }, child_local_id);
				}
				//Ti.App.fireEvent('loadChildrenFromCloudComplete');
				getRecordsACS({ user_id: query.user_id, });
				
			}
     		else alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	});
}

function updateChildrenACS()
{
	var user = getUserLocal(Titanium.App.Properties.getString('user'));
	user = user[0];
	
	var children = getAllChildrenLocal();
	
	
	for(var i=0;i < children.length; i++) {
		var relationships = getRelationsToChildLocal(children[i].id);
		for(var j=0; j < relationships.length; j++) {
			relationships[j].user_id = user.cloud_id;
		}
		children[i].user_id = user.cloud_id;
		children[i].relationships = relationships;
		 
		if(children[i].cloud_id) { 
			Cloud.Objects.update({
				    classname: 'children',
				    id: children[i].cloud_id,
				    fields: children[i],
				}, function (e) {
				    if (e.success) {
				    	
				    } else {
				        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+' children');
				    }
			});
		}
		else {
		}
	}
}


function createChildrenACS()
{
	var children = getAllChildrenLocal();
	
	for(var i=0; i < children.length; i++) {
		if(!children[i].cloud_id) {
			createObjectACS('children', children[i]);
		}
	}
}