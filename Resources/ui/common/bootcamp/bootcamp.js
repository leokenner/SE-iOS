

function bootcamp(navGroup, first_window)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	
	var users = getUserLocal(Titanium.App.Properties.getString('user'));
	var user = users[0]; 
	
	var self = require('ui/common/bootcamp/bootCampWindow');
	var result = new self('Welcome');
		self = result.window;
	var navGroupWindow = result.navGroupWindow
	var navGroup = (navGroupWindow.getChildren())[0];	
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });	
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "Hello "+ user.first_name + " and welcome to StarsEarth. StarsEarth is a utility "+
				"that allows you to take care of a person or people with special needs. "+
				"You can use StarsEarth to maintain a record of events in their lives such as "+
				"medical issues and other activities. These records will then always be avaliable for your "+
				"viewing convinience. \n\nPlease allow us a minute to walk you through "+
				"the main features of the app. You can skip this tutorial at any time by tapping Skip on "+
				"the top right.\n\n Tap next to continue"
				
	scrollView.add(text);
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Next' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);			
	
	next_btn.addEventListener('click', function() {
		var next = require('ui/common/bootcamp/individual');
			next = new next(navGroupWindow);	
		navGroup.open(next);
	});
	
	return navGroupWindow;
}

module.exports = bootcamp;
