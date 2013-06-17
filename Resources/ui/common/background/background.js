
function validiOSPlatform() {
  //add iphone checks
  if (Titanium.Platform.osname == 'iphone')
  {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],0);
		
		//can only test this support on ios 4+
		if (major >= 4) {
			return true;
		}
  }
  
  //either we're not running ios or platform is old
  return false;
}

var registerBackgroundService = function() { 
	if (validiOSPlatform() == true) {
		//register a background service. 
	    //this JS will run when the app is backgrounded
		var service = Ti.App.iOS.registerBackgroundService({url:'ui/common/localnotifications/localnotifications.js'});
		
		Ti.API.info("registered background service = " + service);
	
		//fired when an app is resuming for suspension
		Ti.App.addEventListener('resume',function(e){
			Ti.API.info("App is resuming from the background");
		});
	    
		//fired when an app has resumed
		Ti.App.addEventListener('resumed',function(e){
			Ti.API.info("App has resumed from the background");
		});
	
		//fired when an app is paused
		Ti.App.addEventListener('pause',function(e){
			Ti.API.info("App was paused from the foreground");
		});
	}
}

//Ti.App.addEventListener('databaseLoaded', registerBackgroundService);
