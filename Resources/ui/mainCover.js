

function mainCover() {
var Cloud = require('ti.cloud');

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
	});
	self.add(name);
	
	var about = Ti.UI.createLabel({
		text: 'About',
		textAlign: 1,
		font: { fontSize: 15, },
		color: 'black',
		top: 100,
	});
	self.add(about);
	
	var starsearth_description = function() {
		var modalWindow = Ti.UI.createWindow({
			modal: true,
			title: 'About StarsEarth',
			backgroundColor: 'white',
		});
		
		var done_btn = Ti.UI.createButton({
			systemButton: Titanium.UI.iPhone.SystemButton.DONE,
		});
		modalWindow.rightNavButton = done_btn;
		
		done_btn.addEventListener('click', function() {
			modalWindow.close();
		});
		
		var main_txt = Ti.UI.createLabel({
			top: 10,
			color: 'black',
			textAlign: 1,
			width: '95%',
			font: { fontSize: 15, },
			text: "StarsEarth is a mobile journal that allows you to track your child's development. "+
					"You can use StarsEarth to record issues that you see in your child's daily life, "+
					"from medical to social to academic. StarsEarth allows you to record any story, as "+
					"well as any event that takes place around that story, such as appointments with specialists, "+
					"or activities or treatments that have been planned to help solve the issue.\n\n"+
					"With StarsEarth, all the important information regarding your child's growth and development is "+
					"just a click away.",
		});
		modalWindow.add(main_txt);
		
		modalWindow.open();
	}
	
	name.addEventListener('click', starsearth_description);
	about.addEventListener('click', starsearth_description);
	
	var background_img = Ti.UI.createImageView({
		image: 'family.png',
		zIndex: 1,
		bottom: 0,
		left: 0,
		width: '100%',
	});
	self.add(background_img);    
	
	var fblogin_new = Titanium.UI.createView({
	height: 40,
	width: '70%',
	top: '55%',
	backgroundColor: 'blue',
	borderColor: 'black',
	borderRadius: 5,
	zIndex: 2,
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
	
	Ti.App.addEventListener('FBloginsuccessful', function() {
		activityIndicator.show();
	});
	
	var login_btn = Titanium.UI.createButtonBar({
	labels:['Login'],
	height: 30,
	width: '25%',
	top: '70%',
	left: '20%',
	backgroundColor: 'blue',
	style: Titanium.UI.iPhone.SystemButtonStyle.BAR
	});	
	//self.add(login_btn);
	
	login_btn.addEventListener('click', function() {
		loginUserACS('abc@abc.com','abc123'); 	
	});
	
	
	var fb_button = Ti.Facebook.createLoginButton({
    bottom : '10%',
    zIndex: 2,
    style : Ti.Facebook.BUTTON_STYLE_WIDE,
	});

	//self.add(fb_button);  
	
	return self;
};

module.exports = mainCover;