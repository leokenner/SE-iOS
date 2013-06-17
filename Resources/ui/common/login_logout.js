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
		var children = getAllChildrenLocal();
		if(children.length == 0) {
			var row_id = insertChildLocal(user.id, 'New', 'Patient',null,null,null);
			Titanium.App.Properties.setString('child', row_id);
			createObjectACS('children', { id: row_id, user_id: user.id, first_name: 'New', last_name: 'Child', });
		}
		else {
			Titanium.App.Properties.setString('child', children[0].id);
		}
		Ti.App.fireEvent('databaseLoaded');  
	}
	
	Ti.App.addEventListener('loadFromCloudComplete', loadFromCloud);  
}


function logout()
{		
	updateChildrenACS();
/*	updateRecordsACS();
	updateEntriesACS();
	updateAppointmentsACS();
	updateActivitiesACS();
	updateTreatmentsACS(); */  

	Ti.App.addEventListener('cloudUpdateComplete', function(){ 
		if(fb.loggedIn) {
			fb.logout();
		}
		logoutUserACS();
		Ti.App.fireEvent('logoutClicked');
	});
	
}
