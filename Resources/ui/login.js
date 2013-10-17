

function login_page() {
	if(Titanium.Platform.osname == 'iphone') { 
			var self = Ti.UI.createWindow({
				modal: true,
				title: 'Login',
				backgroundColor: 'white',
			});
		}
		else if(Titanium.Platform.osname == 'ipad') {
			var self = Ti.UI.iPad.createPopover({ backgroundColor: 'white', width: 320, height: 320 });
		}
		
		var cancel_btn = Ti.UI.createButton({
			systemButton: Titanium.UI.iPhone.SystemButton.CANCEL,
		});
		self.leftNavButton = cancel_btn;
		
		cancel_btn.addEventListener('click', function() {
			if(Titanium.Platform.osname == 'iphone') self.close();
			if(Titanium.Platform.osname == 'ipad') self.hide();
		});
		
		var login_lbl = Ti.UI.createLabel({
			text: 'Login',
			color: 'white',
		});
		
		var view = Ti.UI.createScrollView({ top: 20, width: 280, layout: 'vertical' });
		var login_email = Ti.UI.createTextField({ hintText: 'Email', paddingLeft: 5, borderColor: '#CCC', width: '100%', height: 45, keyboardType: Titanium.UI.KEYBOARD_EMAIL, autocorrect: false });
		var login_password = Ti.UI.createTextField({ hintText: 'Password', paddingLeft: 5, borderColor: '#CCC', width: '100%', height: 45, passwordMask: true, });
		view.add(login_email);
		view.add(login_password);
		
		var button = Ti.UI.createView({
			width: 250,
			backgroundColor: 'blue',
			borderColor: 'black',
			borderRadius: 5,
			height: 50,
			top: 10 + 90 + 20,
		});
		button.add(login_lbl);
		
		button.addEventListener('click', function() {
			if(login_email.value.length < 1) {
				alert('You have not entered a username');
				return;
			}
			if(login_password.value.length < 1) {
				alert('You have not entered a password');
				return;
			}
			if(-1 == login_email.value.indexOf('@')) {
				alert('The email you entered is not of the right format');
				return;
			}
			loginUserACS(login_email.value, login_password.value);
			
			if(Titanium.Platform.osname == 'iphone') self.close();
			if(Titanium.Platform.osname == 'ipad') self.hide();
		});
		
		self.add(view);
		self.add(button);
		
		return self;
}
