
//this is an array of alerts for an appointment or treatment
//input: array of times
function alerts(input, time_before_alerts)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	//get the index at which to insert the new time
	//0 and above means insert below, -1 means insert above the first row, -2 means the time exists and no row should be added
	function getIndex(time)
	{
		var array = table.data[0].rows;
		
		var start = 0;
		var end = array.length-1;
		var mid = Math.floor(array.length/2);
		if(isLeftTimeGreater(time, array[end].time)) return end;
		
		while(1)
		{
			if(isLeftEqualToRight(time,array[mid].time)) return -2;
			if(start >= end) {
				if(isLeftTimeGreater(time, array[end].time)) {
					return end;
				}
				else {
					return start-1;
				}
			}
			if(isLeftTimeGreater(time, array[mid].time)) {
				if(start != mid) start = mid;
				else return start;
			}
			else {
				if(start != mid) end = mid;
				else return start-1; 
			}
			mid = Math.floor((start+end)/2);
			continue;
		}
		
	}
	
	//input: the_time as a date object
	function insertTimes(the_time) 
	{
		//if the_time is null, it means we are inserting from the input array
		if(!the_time) {
			for(var i=0; i < input.length; i++) {
				var row = Ti.UI.createTableViewRow({ backgroundColor: 'white', selectedBackgroundColor: 'white', time: input[i], });
				var time = Ti.UI.createLabel({ text: input[i], left: 15, font: { fontWeight: 'bold', fontSize: 18, }, width: '50%', });
				row.add(time);
				var trash_btn = Titanium.UI.createView({ backgroundColor: 'red', right: 15, width: 100, height: 30, });
				var trash_txt = Ti.UI.createLabel({ text: 'Remove', color: 'white', font: { fontWeight: 'bold', }, });
				trash_btn.add(trash_txt);
				row.add(trash_btn);
				table.appendRow(row);
			}
		}
		else { 
				var time = timeFormatted(the_time).time;
				var row = Ti.UI.createTableViewRow({ backgroundColor: 'white', selectedBackgroundColor: 'white', time: time, });				
				var time_row = Ti.UI.createLabel({ text: time, left: 15, font: { fontWeight: 'bold', fontSize: 18, }, width: '50%', });	
				row.add(time_row);
				var trash_btn = Titanium.UI.createView({ backgroundColor: 'red', right: 15, width: 100, height: 30, });
				var trash_txt = Ti.UI.createLabel({ text: 'Remove', color: 'white', font: { fontWeight: 'bold', }, });
				trash_btn.add(trash_txt);
				row.add(trash_btn);
				
				var index = getIndex(time);
				if(index == -2) return;
				else if(index == -1) {
					table.insertRowBefore(0, row, { animated: true, });		
				}
				else {
					table.insertRowAfter(index, row, { animated: true, });		
				}	
		}
	}
	
	
	var self = Titanium.UI.createWindow({
	  backgroundColor:'white',
	  title: 'Alerts',
	  layout: 'vertical',
	  height: 'auto'
	});
	self.result=null;
	
	self.addEventListener('close', function() {  
		var array = [];
		for(var i=0; i < table.data[0].rowCount; i++) {
			array[i] = table.data[0].rows[i].time;
		}
		self.result = array;
	});
	
	/* 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroupWindow.result = null;
	*/
	
	var close_btn = Titanium.UI.createButton({
		title: 'Back',
	});
	
	close_btn.addEventListener('click', function() {
		updateResult();
		self.close();
	});
	//self.leftNavButton = close_btn;
	
	var add_btn = Titanium.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.ADD
	});
	self.rightNavButton = add_btn;
	
	var how_long_before = Ti.UI.createView({
	width: '100%',
	zIndex: 3,
	height: 70,
	backgroundColor: 'blue',
	borderColor: 'blue'
	});
	
	if(time_before_alerts === 'Time of event')
		how_long_before.add(Ti.UI.createLabel({ text: "You will receive alerts reminding you to administer the medication at "+
													"the exact times listed here.", textAlign: 'center', color: 'white' }));
	else 
		how_long_before.add(Ti.UI.createLabel({ text: "You will receive alerts reminding you to administer the medication "+time_before_alerts+
													" the times listed here.", textAlign: 'center', color: 'white' }));
	self.add(how_long_before);
	
	var table = Titanium.UI.createTableView({
		width: '100%',
		showVerticalScrollIndicator: false,
		rowHeight: 60,
	});
	
	insertTimes(null);
	self.add(table);
	
	
	
	table.addEventListener('click', function(e) {
		if(e.source.backgroundColor == 'red' || e.source.text == 'Remove') {
			table.deleteRow(e.index, {animated: true, });
			return;
		}
		
		modalPicker = require('ui/common/helpers/modalPicker');
		var modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_TIME,null,e.row.time); 
	
		if(self.leftNavButton != null) { 
			self.leftNavButton.setTouchEnabled(false);
		}
		self.rightNavButton.setTouchEnabled(false); 
		self.setTouchEnabled(false);
		table.scrollable = false;
		if(Titanium.Platform.osname == 'iphone') modalPicker.open();
		if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: e.row.children[0], });
	
	
		var picker_closed = function() {
			if(modalPicker.result) {
				var time = timeFormatted(modalPicker.result).time;
				//Only move rows around if the new time is not the same as the current listed time
				if(time != e.row.children[0].text) {
						table.deleteRow(e.index);
						insertTimes(modalPicker.result);
				}
			}
			self.setTouchEnabled(true);
			if(self.leftNavButton != null) { 
				self.leftNavButton.setTouchEnabled(true);
			}
			self.rightNavButton.setTouchEnabled(true); 
			table.scrollable = true;
			};
			
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
	});
	
	add_btn.addEventListener('click', function() {
		if(table.data[0].rowCount == 9) {
			alert('Sorry, you cannot add more than 9 times');
			return;
		}
		modalPicker = require('ui/common/helpers/modalPicker');
		var modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_TIME,null,timeFormatted(new Date()).time); 
	
		if(self.leftNavButton != null) { 
			self.leftNavButton.setTouchEnabled(false);
		}
		self.rightNavButton.setTouchEnabled(false); 
		self.setTouchEnabled(false);
		table.scrollable = false;
		if(Titanium.Platform.osname == 'iphone') modalPicker.open();
		if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: add_btn, });
	
	
		var picker_closed = function() {
			if(modalPicker.result) {
				insertTimes(modalPicker.result);
			}
			self.setTouchEnabled(true);
			if(self.leftNavButton != null) { 
				self.leftNavButton.setTouchEnabled(true);
			}
			self.rightNavButton.setTouchEnabled(true); 
			table.scrollable = true;
			};
			
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
	});
	
	return self;
	
}
module.exports = alerts;
