

function signup_page() {
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
		
		var signup_lbl = Ti.UI.createLabel({
			text: 'Signup',
			color: 'white',
		});
		
		var view = Ti.UI.createScrollView({ top: 20, width: 280, layout: 'vertical' });
		var first_name = Ti.UI.createTextField({ hintText: 'First Name', paddingLeft: 5, borderColor: '#CCC', width: '100%', height: 45 });
		var last_name = Ti.UI.createTextField({ hintText: 'Last Name', paddingLeft: 5, borderColor: '#CCC', width: '100%', height: 45 });
		var signup_email = Ti.UI.createTextField({ hintText: 'Email', paddingLeft: 5, borderColor: '#CCC', width: '100%', height: 45, keyboardType: Titanium.UI.KEYBOARD_EMAIL, autocorrect: false });
		var signup_password = Ti.UI.createTextField({ hintText: 'Password', paddingLeft: 5, borderColor: '#CCC', width: '100%', height: 45, passwordMask: true, });
		var password_confirm = Ti.UI.createTextField({ hintText: 'Type password again', paddingLeft: 5, borderColor: '#CCC', width: '100%', height: 45, passwordMask: true, });
		view.add(first_name);
		view.add(last_name);
		view.add(signup_email);
		view.add(signup_password);
		view.add(password_confirm);
		
		var button = Ti.UI.createView({
			width: 250,
			backgroundColor: 'blue',
			borderColor: 'black',
			borderRadius: 5,
			height: 50,
			top: 20 + 225 + 20,
		});
		button.add(signup_lbl);
		
		button.addEventListener('click', function() {
			var fname,lname=false;
			var onlyLetters = /^[a-zA-Z]*$/.test(first_name.value);
			if(first_name.value != null && first_name.value.length > 1 && onlyLetters) { fname = true; }
			else { alert('First name must be longer than one character and contain only letters'); }
			onlyLetters = /^[a-zA-Z]*$/.test(last_name.value);
			if(last_name.value != null && last_name.value.length > 1 && onlyLetters) { lname = true; }	
			else { alert('Last name must be longer than one character and contain only letters'); }
			if(!fname || !lname) return;

			if(-1 === signup_email.indexOf('@')) {
				alert('The email you entered is of the wrong format. Kindly recheck');
				return;
			}
			if(signup_password.value !== password_confirm.value) {
				alert('The password and password confirmation do not match. Please enter again');
				return;
			}
				createAndLoginUserACS(last_name.value,first_name.value,signup_email.value,signup_password.value,password_confirm.value);
				
				if(Titanium.Platform.osname == 'iphone') self.close();
		if(Titanium.Platform.osname == 'ipad') self.hide();
		});
		
		self.add(view);
		self.add(button);
		
		if(Titanium.Platform.osname == 'iphone') self.open();
		if(Titanium.Platform.osname == 'ipad') self.show({ view: view });
		
		return self;
}
