


function externalAccountLoginACS() 
{
	var fb = require('facebook');;
	 
	Cloud.SocialIntegrations.externalAccountLogin({
	    			type: 'facebook',
	   				 token: fb.accessToken
				}, function (g) {
	   				 if (g.success) {
	   				 	initDBLocal();
	   				 	Ti.API.info('local database initialized: socialIntegrations.js');
	   				 	
	   				 	deleteAllTreatments();
						deleteAllActivities();  
						deleteAllAppointments();  
						deleteAllEntries();
						deleteAllRecords();
						deleteAllRelationships();
						deleteAllChildren();
						deleteAllUsers();
	   				 						
	   			 		var user = g.users[0];
	   			 		
	   			 		user.first_name = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
	   			 		user.last_name = user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1);
	   			 		
	   			 		if(new Date(user.created_at) == new Date(user.updated_at)) {
	   			 			alert("Welcome to StarsEarth "+user.first_name+"! You mayb begin by filling in "+
	   			 			"the personal card for your child. Click Edit to modify the child's details. For additional "+
	   			 			"questions, please press the ? button on the top right");
	   			 		}
	   			 		
	   			 		Titanium.App.Properties.setObject('loggedInUser', user);
	   			 		var user_id = insertUserLocal('"'+user.id+'"', user.first_name, user.last_name);
	   			 		Ti.App.fireEvent('userLoggedIn');
	    			}
	    			else {
	    			}
	   });
}