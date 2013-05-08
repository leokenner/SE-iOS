
function RecordsWindow() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createWindow({
		title: 'Records',
		backgroundColor: '#CCC',
		zIndex: 2
	});
	self.hideTabBar();
	
	var leftNav_btn = Ti.UI.createButton({
		title: 'Menu'
	});
	self.leftNavButton = leftNav_btn;
	
	var rightNav_btn = Ti.UI.createButton({
		title: 'Help'
	});
	self.rightNavButton = rightNav_btn; 
	
	leftNav_btn.addEventListener('click',function(e){
		if(leftNav_btn.title == 'Menu'){
			Ti.App.fireEvent('showMenu');
			leftNav_btn.title= 'Back';
			self.containingTabGroup.animate(Ti.UI.createAnimation({
					left: 260,	
					right: -260,
					duration: 500
			}));
		} else {
			leftNav_btn.title= 'Menu';
			self.containingTabGroup.animate(Ti.UI.createAnimation({
					left: 0,
					right: 0,
					duration: 500
			}));
		}
	});
	
	Ti.App.addEventListener('changeUser', function() {
		leftNav_btn.title= 'Menu';
			self.containingTabGroup.animate(Ti.UI.createAnimation({
					left: 0,
					right: 0,
					duration: 500
			}));
	});
	
	
	rightNav_btn.addEventListener('click', function() {
		var questions = require('ui/common/help_section/help_questions');
		var questionsWindow = new questions();
		questionsWindow.open();
	});
	
	
	
	
	
	var recordsView = require('ui/common/views/completeRecordsTableView');
	recordsView = new recordsView();
	self.add(recordsView);
	
	var tabGroup = require('ui/handheld/ApplicationTabGroup');
	var mainTabGroup = new tabGroup(self);
	
	
	return mainTabGroup;
}

module.exports = RecordsWindow;
