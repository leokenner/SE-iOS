/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

// This is a single context application with multiple windows in a stack
(function() {

var Cloud = require('ti.cloud');	
		
	Ti.include('ui/common/login_logout.js');
	Ti.include('ui/common/database/users_db.js');
	Ti.include('ui/common/database/database.js');
	//Ti.include('ui/common/localnotifications/localnotifications.js');
	Ti.include('ui/common/localnotifications/activities.js');
	Ti.include('ui/common/cloud/appcelerator/users_acs.js');
	Ti.include('ui/common/cloud/appcelerator/social/facebook.js');
	Ti.include('ui/common/cloud/appcelerator/socialIntegrations.js');
	Ti.include('ui/common/cloud/appcelerator/objects.js');
	Ti.include('ui/common/cloud/appcelerator/children_acs.js');
	Ti.include('ui/common/cloud/appcelerator/records_acs.js');
	Ti.include('ui/common/cloud/appcelerator/entries_acs.js');
	Ti.include('ui/common/cloud/appcelerator/appointments_acs.js');
	Ti.include('ui/common/cloud/appcelerator/activities_acs.js');
	Ti.include('ui/common/cloud/appcelerator/treatments_acs.js');
	
	//render appropriate components based on the platform and form factor
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	var mainWindow;
	var mainTabGroup=null;
	var mainCover = require('ui/mainCover');
	var leftWindow=null;
	var tabGroup = require('ui/handheld/ApplicationTabGroup');
	if (isTablet) {
		mainWindow = require('ui/handheld/RecordsWindow');
	}
	else {	
		// Android uses platform-specific properties to create windows.
		// All other platforms follow a similar UI pattern.
		if (osname === 'android') {
			mainWindow = require('ui/handheld/android/RecordsWindow');
		}
		else {
			mainWindow = require('ui/handheld/RecordsWindow');   //require('ui/common/RecordsWindow');
		}
	}
	var count=0;
	
	updateTable();
	
	mainCover = new mainCover();
	mainCover.open();
	
	Ti.App.addEventListener('userLoggedIn', function() {
		loadDatabase();
	});
	
	Ti.App.addEventListener('databaseLoaded', function() {
		count++;
		if(count > 1) return;
		leftWindow = require('ui/common/menus/leftMenu');
		leftWindow = new leftWindow();
		leftWindow.open();
		mainTabGroup = new mainWindow();
		mainTabGroup.open();
	}); 
	
	Ti.App.addEventListener('logoutClicked', function() {
		count=0;
		if(leftWindow) leftWindow.close();
		if(mainTabGroup) mainTabGroup.close();
	});  

})();
