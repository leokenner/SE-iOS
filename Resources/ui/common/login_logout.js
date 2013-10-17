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
		Titanium.App.Properties.setString('child', null);
		Ti.App.fireEvent('databaseLoaded');  
	}
	
	Ti.App.addEventListener('loadFromCloudComplete', loadFromCloud);  
}


function logout()
{		 
	if(fb.loggedIn) {
		fb.logout();
	}
	logoutUserACS();
	Ti.App.fireEvent('logoutClicked');
	
}
