
function ApplicationTabGroup(window) {
	//load component dependencies
	//var window = require('ui/common/'+input);
		
	//create component instance
	var self = Ti.UI.createTabGroup();
		
	//construct UI
	//window = new window();
	
	var tab1 = Ti.UI.createTab({
		window: window
	});
	window.containingTab = tab1;
	window.containingTabGroup = self;
	self.addTab(tab1);
	
	window.addEventListener('close', function() {
		self.close();
	});
	
	return self;
}


module.exports = ApplicationTabGroup;