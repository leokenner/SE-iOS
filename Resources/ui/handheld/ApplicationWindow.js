/*
 * input:
 * input = {
 * 	view: the view to be put into the window
 *  left_button: the left nav button
 *  right_button: the right nav button
 * }
 * 
 */
function ApplicationWindow(input) {
	//load component dependencies
	var view = require('ui/common/'+input.view);
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#CCC',
		title: view.split(' ')[0],
		layout: 'vertical'
	});
	self.hideTabBar();
	
	var leftNav_btn = Ti.UI.createButton({
		title: 'Menu'
	});
	self.leftNavButton = leftNav_btn;
	
/*	var rightNav_btn = Ti.UI.createButton({
		title: 'Log'
	});
	self.rightNavButton = rightNav_btn;  */
		
	//construct UI
	view = new view();
	self.add(view);
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
