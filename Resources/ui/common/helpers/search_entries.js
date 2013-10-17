
function search_entries(navGroup, input, chosen_entry, title)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/strings.js');
	
	var entry={
		id: chosen_entry.id,
		date: chosen_entry.date,
		time: chosen_entry.time,
		main_entry: chosen_entry.main_entry,
	};
	
	//get the index at which to insert the new time
	//0 and above means insert below, -1 means insert above the first row, -2 means the time exists and no row should be added, 
	//-3 means there are no rows in the array and this should be appended
	function getIndex(string, array, start, end, str_ptr)
	{
		var array = table.data[0].rows;
		
		if(array.length == 0) return -3;
		
		while(1) 
		{ 
			if(!start) start = 0;
			if(!end) end = (array.length)-1;
			if(!str_ptr) str_ptr = 0;
			var mid = Math.floor((start+end)/2);
			
			if(string.charAt(str_ptr) < array[start].children[0].text.charAt(str_ptr)) return start-1;
			if(string.charAt(str_ptr) > array[end].children[0].text.charAt(str_ptr)) return end;
			if(string.charAt(str_ptr) > array[mid].children[0].text.charAt(str_ptr)) {
				if(start != mid) start = mid; //return getIndex(string, array, mid, end, str_ptr);
				else return start;
			}
			else if(string.charAt(str_ptr) < array[mid].children[0].text.charAt(str_ptr)) {
				if(start != mid) end = mid; //return getIndex(string, array, start, mid, str_ptr); 
				else return start-1;
			}
			else {
				if(string === array[mid].children[0].text) {
					return -2;
				}
				str_ptr++;
			}
		}
	}
	
	function insertItem(item)
	{
		var dateTime = Ti.UI.createLabel({ text: "On "+item.date+" at "+item.time,
										left: 5,
										height: 40,
										top: 0, 
										font: { fontSize: 15 },
								});
								
		var top_line = Ti.UI.createView({ width: 235, height: 1, top: 40, left: 0, borderColor: 'black', borderWidth: 1 });
		var content = Ti.UI.createLabel({
			text: item.main_entry?item.main_entry:'No entry to display',
			font: { fontSize: 15, },
			textAlign: 1,
			width: '90%',
			height: 160,
		});
		
		var row = Ti.UI.createTableViewRow({ backgroundColor: 'white', selectedBackgroundColor: 'white', content: item, height: 250, object: item });
		row.add(dateTime);
		row.add(top_line);
		row.add(content);
		table.appendRow(row);
	}
	
	
	function insertItems(items) 
	{
		if(!items) items = input;
		for(var i=0;i < items.length; i++) insertItem(items[i]);
		
		if(items.length == 0) input_area.focus();
	}
	 
	var self = Titanium.UI.createWindow({
	  backgroundColor:'white',
	  title: title,
	  layout: 'vertical',
	  height: 'auto'
	});
	self.result=null;
	var modalPicker=null;
	self.addEventListener('blur', function() {
		//If there is a modalPicker open, close it
		if(modalPicker) {
			if(Titanium.Platform.osname == 'iphone') modalPicker.close();
		}
	});
	
	/* 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroupWindow.result = null;
	*/
	
	var done_btn = Titanium.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.DONE
	});
	
	done_btn.addEventListener('click', function() {
		self.result = {
			main_entry: input_area.value,
			date: entry.date,
			time: entry.time,
		}
		navGroup.close(self);
	});
	self.leftNavButton = done_btn;
	
	var save_btn = Titanium.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.SAVE
	});
	//self.rightNavButton = save_btn;
	
	var message = Ti.UI.createView({
	width: '100%',
	zIndex: 3,
	top: 0,
	height: 80,
	backgroundColor: 'blue',
	borderColor: 'blue'
	});
	
	message.add(Ti.UI.createLabel({ text: "Please choose from the existing list of entries below. If you would like to create a new one instead, "+
											"please enter it here", width: '90%', textAlign: 'center', color: 'white' }));
													
	self.add(message);
	
	var searchbar = Ti.UI.createSearchBar();
	
	var row1 = Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', });
	var row2 = Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, backgroundColor: '#F8F8F8', });
	var row3 = Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 260, });
	var when_description = Titanium.UI.createLabel({ text: 'Please note the date and at which this event took place, if applicable', left: 15, font: { fontSize: 15, }, });
	var dateTime_title = Titanium.UI.createLabel({ text: '*When', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var dateTime = Ti.UI.createLabel({ text: (!chosen_entry.id)?chosen_entry.date+' '+chosen_entry.time:
												timeFormatted(new Date()).date+' '+timeFormatted(new Date()).time, left: '30%', width: '70%', bubbleParent: false, });
	var input_area = Ti.UI.createTextArea({
		width: '100%',
		height: 260,
		backgroundColor: '#F8F8F8',
		borderColor: 'black',
		font: { fontSize: 17, },
		hintText: 'Enter here.....',
		value: (!chosen_entry.id)?chosen_entry.main_entry:'',
	});
	row1.add(when_description);
	row2.add(dateTime_title);
	row2.add(dateTime);
	row3.add(input_area); 
	
	var table = Titanium.UI.createTableView({
		width: '100%',
		showVerticalScrollIndicator: false,
	});
	table.appendRow(row2);
	table.appendRow(row3);
	
	insertItems();
	self.add(table);
	
	
	
	table.addEventListener('click', function(e) {
		self.result = e.row.object;
		navGroup.close(self);
	});
	
	dateTime.addEventListener('click', function() {
		modalPicker = require('ui/common/helpers/modalPicker');
		modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,'entry',dateTime.text); 
	
		if(Titanium.Platform.osname == 'iphone') modalPicker.open();
		if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: dateTime });
	
	
		var picker_closed = function() {
			if(modalPicker.result) { 
				var newDate = timeFormatted(modalPicker.result);
				entry.date = newDate.date;
				entry.time = newDate.time;
				dateTime.text = newDate.date+' '+newDate.time;
			}
		};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
	});
	
	return self;
	
}
module.exports = search_entries;
