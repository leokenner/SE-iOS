
function RecordsWindow() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createWindow({
		backgroundColor: '#CCC',
		zIndex: 2
	});
	
	var leftNav_btn = Ti.UI.createButton({
		title: 'Menu'
	});
	self.leftNavButton = leftNav_btn;
	
	var rightNav_btn = Ti.UI.createButton({
		title: 'Ended'
	});
	if(Titanium.App.Properties.getInt('endedCount')) {
		if(Titanium.App.Properties.getInt('endedCount') > 0) {
			rightNav_btn.title = "("+ Titanium.App.Properties.getInt('endedCount') + ") Ended";
		}
	}
	self.rightNavButton = rightNav_btn; 
	
	leftNav_btn.addEventListener('click',function(e){
		if(leftNav_btn.title == 'Menu'){
			Ti.App.fireEvent('showMenu');
			leftNav_btn.title= 'Back';
			//self.containingTabGroup.animate(Ti.UI.createAnimation({
				navGroupWindow.animate(Ti.UI.createAnimation({
					left: 260,	
					right: -260,
					duration: 500
			}));
		} else {
			leftNav_btn.title= 'Menu';
				navGroupWindow.animate(Ti.UI.createAnimation({
					left: 0,
					right: 0,
					duration: 500
			}));
		}
	});
	
	Ti.App.addEventListener('changeUser', function() {
		if(self.leftNavButton) { 
				leftNav_btn.title= 'Menu';
				navGroupWindow.animate(Ti.UI.createAnimation({
					left: 0,
					right: 0,
					duration: 500
				}));
			}
	});
	Ti.App.addEventListener('helpSection', function() {
		leftNav_btn.title= 'Menu';
				navGroupWindow.animate(Ti.UI.createAnimation({
					left: 0,
					right: 0,
					duration: 500
			}));
	});
	
	
	rightNav_btn.addEventListener('click',function(e){
		if(rightNav_btn.title != 'Back'){
			Ti.App.fireEvent('showLog');
			rightNav_btn.title= 'Back';
			//self.containingTabGroup.animate(Ti.UI.createAnimation({
				navGroupWindow.animate(Ti.UI.createAnimation({
					left: navGroupWindow.left -260,	
					right: navGroupWindow.right + 260,
					duration: 500
			}));
		} else {
			rightNav_btn.title= 'Ended';
			if(Titanium.App.Properties.getInt('endedCount')) {
				if(Titanium.App.Properties.getInt('endedCount') > 0) {
					rightNav_btn.title = "("+ Titanium.App.Properties.getInt('endedCount') + ") Ended";
					rightNav_btn.backgroundColor = 'red';
				}
			}			
				navGroupWindow.animate(Ti.UI.createAnimation({
					left: self.leftNavButton?0:260,
					right: 0,
					duration: 500
			}));
		}
	});
	
	Ti.App.addEventListener('endedCount', function(e) {
		if(e.count > 0) {
			rightNav_btn.title = "("+e.count+") Ended";
			rightNav_btn.backgroundColor = 'red';
		}
		else if(e.count == 0) {
			rightNav_btn.title = "Ended";
			rightNav_btn.backgroundColor = 'Transparent';
		} 
	});
	
		
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		if(Titanium.UI.orientation ==  Titanium.UI.PORTRAIT || Titanium.UI.orientation == Titanium.UI.UPSIDE_PORTRAIT) {
			navGroupWindow.left = 0;
			navGroupWindow.right = 0;
		}
		else if(Titanium.UI.orientation == Titanium.UI.LANDSCAPE_LEFT || Titanium.UI.orientation == Titanium.UI.LANDSCAPE_RIGHT) {
			navGroupWindow.left = 260;
			navGroupWindow.right = 0;
		}
		navGroup = (navGroupWindow.getChildren())[0];
		
	Ti.Gesture.addEventListener('orientationchange', function(e) {
		if(Titanium.Platform.osname == 'iphone') return;
		if(e.orientation == Ti.UI.PORTRAIT || e.orientation == Ti.UI.UPSIDE_PORTRAIT) {
			navGroupWindow.left = 0;
			navGroupWindow.right = 0;
			self.leftNavButton = leftNav_btn;
			if(leftNav_btn.title == 'Back') leftNav_btn.title = 'Menu';
			if(rightNav_btn.title == 'Back') rightNav_btn.title = 'Ended';
		}
		else if(e.orientation == Ti.UI.LANDSCAPE_LEFT || e.orientation == Ti.UI.LANDSCAPE_RIGHT) {
			navGroupWindow.left = 260;
			navGroupWindow.right = 0;
			self.leftNavButton = null;
			if(rightNav_btn.title == 'Back') rightNav_btn.title = 'Ended';
		}
	});
	
	//This is the notification bar at the bottom of the page
	var notificationsBar = require('ui/common/mainNotifications/notifications');
		notificationsBar = new notificationsBar();
	self.add(notificationsBar);			
	/////	
		
	//This the blank page that shows that the user profile has been deleted	
	var the_background = Ti.UI.createView({ backgroundColor: 'white', zIndex: 2,});
	var the_text = Ti.UI.createLabel({ textAlign: 1, width: 200, text: "This individual's record book has been deleted" });	
	the_background.add(the_text);
	the_background.hide();
	self.add(the_background);
	////////
	
	var individual = getChildLocal(Titanium.App.Properties.getString('child'));
	
	var the_view = Ti.UI.createView({ width: '60%', object: individual[0], });
	var the_name = Ti.UI.createLabel({ text: 'Home', font: { fontWeight: 'bold', fontSize: '22', }, color: 'white', });
	var the_instruction = Ti.UI.createLabel({ text: '', font: { fontSize: 10}, bottom: 0, });
	the_view.add(the_name);
	the_view.add(the_instruction);
	the_view.addEventListener('click', function() {
		if(!this.object) return;
		var individual = getChildLocal(this.object.id);
		if(individual.length == 0) return; 
		var profile = require('ui/common/forms/profile_form');
			profile = new profile(individual[0]);
			if(Titanium.Platform.osname == 'ipad') profile.show({ view: the_view });
			else { 
				profile.setTop(Titanium.Platform.displayCaps.platformHeight*0.9);
				profile.animate(Ti.UI.createAnimation({
					top: 0,
					curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
					duration: 500
				}));
				profile.open();
			}
			
			profile.addEventListener('close', function() {
				var the_individual = getChildLocal(the_view.object.id);
				if(the_individual.length == 0) {
					the_name.text = 'StarsEarth';
					the_instruction.text = '';
					the_background.show();
					return;	
				}
				the_view.children[0].text = the_individual[0].first_name+' '+the_individual[0].last_name; 
			});		
	});
	
	self.setTitleControl(the_view);
	
	var helpSection = require('ui/common/help_section/helpSection');
	helpSection = new helpSection(navGroup);
	helpSection.hide();
	self.add(helpSection);	
	
	var recordbook = require('ui/common/views/recordbook');
	recordbook = new recordbook(individual[0], navGroup);
	recordbook.hide();
	self.add(recordbook); 
	
	var home = require('ui/common/views/home');
	home = new home(individual[0], navGroup);
	self.add(home);
	
	Ti.App.addEventListener('changeUser', function() {
		the_background.hide();
		var child_id = Titanium.App.Properties.getString('child');
		if(child_id == null) {
			the_view.object = null;
			the_name.text = 'Home';
			the_instruction.text = '';
			recordbook.hide();
			helpSection.hide();
			home.show();
		}
		else { 
			var the_individual = getChildLocal(child_id);
			the_view.object = the_individual[0];
			the_name.text = the_individual[0].first_name+' '+the_individual[0].last_name;
			the_instruction.text = 'Tap to view profile';
			home.hide();
			helpSection.hide();
			recordbook.show();
		}
	});
	
	Ti.App.addEventListener('helpSection', function() {
		the_background.hide();
		the_view.object = null;
		the_name.text = 'StarsEarth';
		the_instruction.text = '';
		recordbook.hide();
		home.hide();
		helpSection.show();
	});
		
	/*
	var recordsView = require('ui/common/views/completeRecordsTableView');
	recordsView = new recordsView();
	self.add(recordsView);
	
	var tabGroup = require('ui/handheld/ApplicationTabGroup');
	var mainTabGroup = new tabGroup(self);
	*/
	
	
	return navGroupWindow;
}

module.exports = RecordsWindow;
