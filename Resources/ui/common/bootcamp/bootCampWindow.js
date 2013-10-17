

function bootCampWindow(title, navGroupWindow)
{
	var self = Ti.UI.createWindow({ backgroundColor: 'white', height: 'auto', title: title });
	
	if(!navGroupWindow) {
		var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
			navGroupWindow = new navGroupWindow(self);
	}	
	
	var logout_btn = Titanium.UI.createButton({
		title: 'Logout'
	});
	self.leftNavButton = logout_btn;
	
	var skip_btn = Titanium.UI.createButton({
		title: 'Skip'
	});
	self.rightNavButton = skip_btn;
	
	logout_btn.addEventListener('click', function() {
		logout();
		navGroupWindow.close();
	});
	
	skip_btn.addEventListener('click', function() {
		
	});
	
	if(title === 'Welcome') {
		var return_object = {
			navGroupWindow: navGroupWindow,
			window: self,
		};
	}
	
	return (title === 'Welcome')?return_object:self;  
}

module.exports = bootCampWindow;
