
function RecordsWindow() {
	
	var self = Ti.UI.createWindow({
		navBarHidden: true,
		backgroundColor: '#CCC',
	});
	
	var view = Ti.UI.createView({
		zIndex: 2,
		top: 0,
		left: 0,
		width: '100%',
		height: 70,
		backgroundColor: 'black',
		borderColor: 'white',
		borderWidth: 1,
	});
	self.add(view);
	
	var title = Ti.UI.createLabel({
		text: 'Records',
		color: 'white',
		font: { fontSize: 30, },
	});
	view.add(title);
	
	var leftNavButton = Ti.UI.createView({
		top: 0,
		left: 0,
		width: 70,
		height: 70,
		backgroundColor: 'black',
		borderColor: 'white',
		borderWidth: 1,
	});
	
	var leftButtonText = Ti.UI.createLabel({
		text: 'Menu',
		font: { fontSize: 15, },
		color: 'white',
	});
	leftNavButton.add(leftButtonText);
	view.add(leftNavButton);
	
	var rightNavButton = Ti.UI.createView({
		top: 0,
		right: 0,
		width: 70,
		height: 70,
		backgroundColor: 'black',
		borderColor: 'white',
		borderWidth: 1,
	});
	
	var rightButtonText = Ti.UI.createLabel({
		text: 'Help',
		font: { fontSize: 15, },
		color: 'white',
	});
	rightNavButton.add(rightButtonText);
	view.add(rightNavButton);
	
	leftNavButton.addEventListener('click',function(e){
		if(leftButtonText.text == 'Menu'){
			Ti.App.fireEvent('showMenu');
			leftButtonText.text= 'Back';
			self.animate(Ti.UI.createAnimation({
					left: 260,	
					right: -260,
					duration: 500
			}));
		} else {
			leftButtonText.text= 'Menu';
			self.animate(Ti.UI.createAnimation({
					left: 0,
					right: 0,
					duration: 500
			}));
		}
	});
	
	var mainView = Ti.UI.createView({ top: 70, });
	var recordsView = require('ui/common/views/completeRecordsTableView');
	recordsView = new recordsView();
	mainView.add(recordsView);
	self.add(mainView);
	
	return self;
}

module.exports = RecordsWindow;
