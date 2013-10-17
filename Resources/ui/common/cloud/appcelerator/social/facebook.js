

var fb = require('facebook');
	fb.appid = '553912771295725';
	fb.permissions = ['email'];
	fb.forceDialogAuth = true;  //This must be set to false to use iOS 6 and above login
	
fb.addEventListener('login', function(f) {
    if(f.success) {
    	fb.reauthorize(['publish_actions'], 'me', function(e){
	        if (e.success) {
	            Ti.App.fireEvent('FBloginsuccessful');
	 			var user = externalAccountLoginACS(f.data);
	        } else {
	            if (e.error) {
	                alert(e.error);
	            } else {
	                alert("Unknown result");
	            }
	        }
	    });  
    }		
    else {
    	Ti.App.fireEvent('FBloginClosed')
    }
});


function facebookGraphRequestACS(path, params, httpMethod)
{ 
	fb.requestWithGraphPath(path, params, httpMethod, function(e) {
		   			if(e.success) {
		   			 	var data= JSON.parse(e.result);
		    			//updateUserACS(data);
		   			 }
		   			 else if(e.error) {
		   			 	Ti.API.info(e.error);
		   			 } 	
	});
}

function facebookDialog(type, data)
{
	fb.dialog(type, data, function(e) {
	    if(e.success && e.result) {
	        alert("Success! New Post ID: " + e.result);
	    } else {
	        if(e.error) {
	            alert(e.error);
	        } else {
	            alert("User canceled dialog.");
	        }
	    }
	});
}
