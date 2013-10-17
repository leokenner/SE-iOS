
function textArea(title, message, value)
{
	if(Titanium.Platform.osname == 'iphone') { 
		var self = Titanium.UI.createWindow({
		  backgroundColor:'white',
		  title: title,
		  layout: 'vertical',
		  height: 'auto'
		});
	}
	if(Titanium.Platform.osname == 'ipad') {
		var self = Ti.UI.iPad.createPopover({
			backgroundColor: 'white',
			width: 320,
			height: 480,
			layout: 'vertical',
		});
	}
	self.result=null;
	
	self.addEventListener('close', function() {  
		self.result = input_area.value;
	});
	self.addEventListener('hide', function() {
		self.result = input_area.value;
	});
	
	/* 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroupWindow.result = null;
	*/
	
	var cancel_btn = Titanium.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.CANCEL
	});
	
	cancel_btn.addEventListener('click', function() {
		if(Titanium.Platform.osname == 'iphone') self.close();
		if(Titanium.Platform.osname == 'ipad') self.hide();
	});
	//self.leftNavButton = cancel_btn;
	
	var save_btn = Titanium.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.SAVE
	});
	//self.rightNavButton = save_btn;
	
	var the_message = Ti.UI.createView({
	width: '100%',
	zIndex: 3,
	height: 70,
	backgroundColor: 'blue',
	borderColor: 'blue'
	});
	
	the_message.add(Ti.UI.createLabel({ text: message, textAlign: 'center', color: 'white' }));
													
	if(the_message) self.add(the_message);
	
	var input_area = Ti.UI.createTextArea({
		width: '100%',
		height: '60%',
		backgroundColor: 'white',
		borderColor: 'black',
		font: { fontSize: 17, },
		hintText: 'Enter here.....',
	});
	if(value) input_area.setValue(value);
	self.add(input_area);
	
	var clear_area = Ti.UI.createView({
		height: 50,
		width: '90%',
		top: 10,
	});
	if(value) clear_area.setBackgroundColor('red');
	else clear_area.setBackgroundColor('#CCC');
	
	var clear_text = Ti.UI.createLabel({
		color: 'white',
	});
	if(value) clear_text.setText('Clear Text');
	else clear_text.setText('No Text');
	
	clear_area.add(clear_text);
	self.add(clear_area);
	
	input_area.addEventListener('change', function() {
		if(input_area.value.length > 0) {
			clear_area.setBackgroundColor('red');
			clear_text.setText('Clear Text');
		}
	});
	
	clear_area.addEventListener('click', function() {
		input_area.value = '';
		clear_area.setBackgroundColor('#CCC');
		clear_text.setText('No Text');
	});
	
	return self;
	
}
module.exports = textArea;
