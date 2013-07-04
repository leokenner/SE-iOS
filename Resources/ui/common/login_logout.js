var fb = require('facebook');

function loadDatabase()
{
	//Ti.include('ui/common/database/database.js');
	
	//var parent_id = insertUserLocal(null, 'Adarsh', 'Hasija');
	var users = getAllUsersLocal();
	var user = users[0];
	Titanium.App.Properties.setString('user', user.id);
	
	getChildrenACS({ user_id: user.cloud_id });
	
	var loadFromCloud = function() {
	/*	var children = getAllChildrenLocal();
		if(children.length == 0) {
			var row_id = insertChildLocal(user.id, 'New', 'Patient',null,null,null);
			insertRelationshipLocal(row_id, user.id, 'Relation Unknown: Tap to change');
			Titanium.App.Properties.setString('child', row_id);
			var child = getChildLocal(row_id);
			child[0].user_id = getUserLocal(user.id)[0].cloud_id;
			createObjectACS('children', child[0]);
		}
		else {
			Titanium.App.Properties.setString('child', children[0].id);
		} */
		Titanium.App.Properties.setString('child', null);
		Ti.App.fireEvent('databaseLoaded');  
	}
	
	Ti.App.addEventListener('loadFromCloudComplete', loadFromCloud);  
}


function logout()
{		
/*	updateChildrenACS();
	updateRecordsACS();
	updateEntriesACS();
	updateAppointmentsACS();
	updateActivitiesACS();
	updateTreatmentsACS(); */  

	//Ti.App.addEventListener('cloudUpdateComplete', function(){ 
		if(fb.loggedIn) {
			fb.logout();
		}
		logoutUserACS();
		Ti.App.fireEvent('logoutClicked');
	//});
	
}
