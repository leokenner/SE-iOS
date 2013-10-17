


function mainNotifications()
{
	
	function updateNotifications() 
	{
		var count = Titanium.App.Properties.getInt('endedCount');
		if(count > 0) {
			if(count > 1) text.text = count + " events have ended\n ";
			if(count == 1) text.text = count + " event has ended\n ";
			text.text += "Tap here to view and enter observations";
			text.color = 'white';
			self.backgroundColor = 'red';
		}
		else {
			text.text = 'No events require your attention'
			text.color = 'black';
			self.backgroundColor = '#999999';
		}
	}
	
	var self = Ti.UI.createView({ width: '100%', bottom: 0, height: 60, zIndex: 2, });
	var text = Ti.UI.createLabel({ color: 'black', textAlign: 'center' });
	self.add(text);
	updateNotifications();
	
	return self;
}

module.exports = mainNotifications;
