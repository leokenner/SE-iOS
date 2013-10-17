

function mainCover() {
var Cloud = require('ti.cloud');

	Ti.include('ui/login.js');
	Ti.include('ui/signup.js');

	//create module instance
	var self = Ti.UI.createWindow({
		backgroundColor: 'white',
		navBarHidden: true,
		//orientationModes: [Ti.UI.PORTRAIT],
	});
	
	var style;
	if (Ti.Platform.name === 'iPhone OS'){
	  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	}
	else {
	  style = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
	}
	var activityIndicator = Ti.UI.createActivityIndicator({
	  color: '#CCC',
	  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	  message: 'Loading...',
	  style:style,
	  top: '40%', //'30 dp',
	  left:'30%',
	  height:Ti.UI.SIZE,
	  width:Ti.UI.SIZE,
	  zIndex: 3,
	});
	
	// The activity indicator must be added to a window or view for it to appear
	self.add(activityIndicator);
	
	Ti.App.addEventListener('databaseLoaded', function() {
		activityIndicator.hide();
	});
	
	var fb_login_buttons = function() {
		
	}
	
	Ti.App.addEventListener('FBloginClosed', fb_login_buttons);
	self.addEventListener('focus', fb_login_buttons);
	
	var name = Ti.UI.createLabel({
		text: 'StarsEarth',
		color: 'black',
		top: 50,
		font: { fontSize: 40, fontFamily: 'DroidSans', },
		textAlign: 1,
		zIndex: 1,
	});
	self.add(name);
	
	var about = Ti.UI.createLabel({
		text: 'About',
		textAlign: 1,
		font: { fontSize: 15, },
		color: 'black',
		top: 100,
		zIndex: 1,
	});
	self.add(about);
	
	var starsearth_description = function() {
		if(Titanium.Platform.osname == 'iphone') { 
			var self = Ti.UI.createWindow({
				modal: true,
				title: 'About StarsEarth',
				backgroundColor: 'white',
			});
		}
		else if(Titanium.Platform.osname == 'ipad') {
			var self = Ti.UI.iPad.createPopover({ backgroundColor: 'white', width: 320, height: 320 });
		}
		
		var done_btn = Ti.UI.createButton({
			systemButton: Titanium.UI.iPhone.SystemButton.DONE,
		});
		self.rightNavButton = done_btn;
		
		done_btn.addEventListener('click', function() {
			if(Titanium.Platform.osname == 'iphone') self.close();
			if(Titanium.Platform.osname == 'ipad') self.hide();
		});
		
		var main_txt = Ti.UI.createLabel({
			top: 10,
			color: 'black',
			textAlign: 1,
			width: '95%',
			font: { fontSize: 15, },
			text: "StarsEarth is an app designed to help parents/guardians take care of "+
					"individuals with special needs. StarsEarth allows you to record key moments "+
					"in an individual's life. It also allows you to keep tracks of events such as doctors "+
					"appointments and treatments. All these records are always available for your convinience in "+
					"the individual's record book.\n\nIf you are someone who is the guardian of a special needs child, "+
					"StarsEarth is the portal for you."
		});
		self.add(main_txt);
		
		if(Titanium.Platform.osname == 'iphone') self.open();
		if(Titanium.Platform.osname == 'ipad') self.show({ view: name });
	}
	
	name.addEventListener('click', starsearth_description);
	about.addEventListener('click', starsearth_description);
	
	var background_img = Ti.UI.createImageView({
		image: 'family.png',
		bottom: 0,
		left: 0,
		width: '100%',
	});
	self.add(background_img);
	
	/*
	 * 
	 * The Facebook button
	 * 
	 */    
	
	var fblogin_new = Titanium.UI.createView({
	/*	height: 40,
		width: '70%',
		top: '55%',
		backgroundColor: 'blue',
		borderColor: 'black',
		borderRadius: 5,
		zIndex: 2,  */
		height: 40,
		width: 40,
		right: 0,
		backgroundColor: 'green',
		borderColor: 'black',
	});
	
	var fblogin_new_label = Titanium.UI.createLabel({
		text: 'Login with Facebook',
		font: { fontSize: 15, },
		color: 'white',
	});
	
	fblogin_new.add(fblogin_new_label);

	fblogin_new.addEventListener('touchstart', function() {
		if(!Titanium.Network.online) {
			alert('You are not connected to the internet');
			return;
		}
		var url = 'https://login.facebook.com';
		var client = Titanium.Network.createHTTPClient();
		client.clearCookies(url);
		var fb = require('facebook');
		fb.authorize();
		fblogin_new.backgroundColor = 'black';
	});
	
	fblogin_new.addEventListener('touchend', function() {
		fblogin_new.backgroundColor = 'blue';
	});
	self.add(fblogin_new); 
	
	/*
	 * 
	 * The Facebook button ends here
	 * 
	 * 
	 */
	
	Ti.App.addEventListener('FBloginsuccessful', function() {
		activityIndicator.show();
	});
	
	var main_view = Ti.UI.createView({ top: '45%', layout: 'vertical', width: 280, zIndex: 2, });
	
	var login_btn = Titanium.UI.createView({
		height: 40,
		top: 10,
		backgroundColor: 'blue',
		borderColor: 'black',
		borderRadius: 5,
	});	
	var login_label = Titanium.UI.createLabel({
		text: 'Login to StarsEarth',
		font: { fontSize: 15, },
		color: 'white',
	});
	login_btn.add(login_label);
	main_view.add(login_btn);
	
	var signup_btn = Titanium.UI.createView({
		height: 40,
		top: 30,
		backgroundColor: 'blue',
		borderColor: 'black',
		borderRadius: 5,
	});	
	var signup_label = Titanium.UI.createLabel({
		text: 'New User? Signup for StarsEarth',
		font: { fontSize: 15, },
		color: 'white',
	});
	signup_btn.add(signup_label);
	main_view.add(signup_btn);
	
	self.add(main_view);
	
	//login_btn.addEventListener('click', function() {
	//	loginUserACS('abc@abc.com','abc123'); 	
	//});
	login_btn.addEventListener('click', function() {
		var window = login_page();
		if(Titanium.Platform.osname == 'iphone') window.open();
		if(Titanium.Platform.osname == 'ipad') window.show({ view: login_btn });
	});
	signup_btn.addEventListener('click', function() {
		var window = signup_page();
		if(Titanium.Platform.osname == 'iphone') window.open();
		if(Titanium.Platform.osname == 'ipad') window.show({ view: signup_btn });
	});
	
	return self;
};

module.exports = mainCover;