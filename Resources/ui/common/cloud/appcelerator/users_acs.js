var Cloud = require('ti.cloud');


function createAndLoginUserACS(last_name, first_name, email, password, password_confirmation)
{ 
	Cloud.Users.create({
	    email: email,
	    first_name: first_name,
	    last_name: last_name,
	    password: password,
	    password_confirmation: password_confirmation
		}, function (e) {
		    if (e.success) {
		        var user = e.users[0];
		        loginUserACS(user.email, password);
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		        return null;
		    }
		});
		
}

/*
 * Called only when a user enteres their credentials. No social media links
 */
function loginUserACS(email, password)
{
	Cloud.Users.login({
    login: email,
    password: password
	}, function (e) {
    	if (e.success) {
    		initDBLocal();
    		Ti.API.info('local database initialized: appcelerator/users.js');
    		
    		deleteAllTreatments();
			deleteAllActivities();  
			deleteAllAppointments();  
			deleteAllEntries();
			deleteAllRecords();
			deleteAllRelationships();
			deleteAllChildren();
			deleteAllUsers();
    		
        	var user = e.users[0];
        	user.id = '"'+user.id+'"';
        	
        	var user_local_id = insertUserLocal(user.id, user.first_name, user.last_name);
        	//need to run an update to insert the email
        	updateUserLocal(user_local_id,user.first_name,user.last_name,user.email);
        	
        	Ti.App.fireEvent('userLoggedIn');
        	
        	
    	} else {
        	alert('Error: \n' + ((e.error && e.message) || JSON.stringify(e)));
    	}
	});

}

function logoutUserACS()
{	
	Cloud.Users.logout(function (e) {
    	if (e.success) {
        	var user = getUserLocal(Titanium.App.Properties.getString('user'));
				user = user[0];  
			//deleteUserLocal(user.cloud_id);
    	} else {
        	Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
    	}
	});
}

function updateUserACS(data) 
{ 
	Cloud.Users.update({
		  	email: data.email,
		  	username: data.username,
		}, function (e) {
		    if (e.success) {
		     	Ti.API.info('user successfully updated: /ui/common/cloud/appecelrator/users.js');
		  	} else {
		     	Ti.API.info('Error: \n' + ((e.error && e.message) || JSON.stringify(e)));
		    }
	});
	
}