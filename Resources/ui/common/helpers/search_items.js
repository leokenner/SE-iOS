
function search_items(navGroup, input, title)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/strings.js');
	
	//get the index at which to insert the new time
	//0 and above means insert below, -1 means insert above the first row, -2 means the time exists and no row should be added, 
	//-3 means there are no rows in the array and this should be appended
	function getIndex(string, array, start, end, str_ptr)
	{
		var array = table.data[0].rows;
		
		if(array.length == 0) return -3;
		
		while(1) 
		{ 
			if(start == undefined) start = 0;
			if(end == undefined) end = (array.length)-1;
			if(str_ptr == undefined) str_ptr = 0;
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
		var row = Ti.UI.createTableViewRow({ backgroundColor: 'white', selectedBackgroundColor: 'white', content: item, });
		var content = Ti.UI.createLabel({ text: item, left: 15, font: { fontWeight: 'bold', fontSize: 18, }, width: '50%', });
		row.add(content);
		table.appendRow(row);
	}
	
	
	function insertItems(items) 
	{
		if(!items) items = input;
		for(var i=0;i < items.length; i++) insertItem(items[i]);
	}
	
	
	var self = Titanium.UI.createWindow({
	  backgroundColor:'white',
	  title: title,
	  layout: 'vertical',
	  height: 'auto'
	});
	self.result=null;
	
	/* 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroupWindow.result = null;
	*/
	
	var cancel_btn = Titanium.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.CANCEL
	});
	
	cancel_btn.addEventListener('click', function() {
		self.close();
	});
	//self.leftNavButton = cancel_btn;
	
	var save_btn = Titanium.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.SAVE
	});
	//self.rightNavButton = save_btn;
	
	var message = Ti.UI.createView({
	width: '100%',
	zIndex: 3,
	height: 70,
	backgroundColor: 'blue',
	borderColor: 'blue'
	});
	
	message.add(Ti.UI.createLabel({ text: "Please choose the name of the individual. "+
												"If the individual does not have a record book with StarsEarth, "+
												"one will be created when you save this entry/event. ", textAlign: 'center', color: 'white' }));
													
	//self.add(message);
	
	var searchbar = Ti.UI.createSearchBar();
	
	var input_view = Ti.UI.createView({
		width: '100%',
		height: 60,
		backgroundColor: 'white',
		borderColor: 'black',
	});
	
	var input_field = Ti.UI.createTextField({
		hintText: 'Enter here....',
		width: '80%',
		left: 15,
		height: '100%',
	});
	var input_submit = Ti.UI.createView({
		width: '20%',
		height: '100%',
		right: 0,
		backgroundColor: 'blue',
		borderColor: 'blue',
	});
	var input_submit_text = Ti.UI.createLabel({
		text: 'Enter',
		color: 'white',
		font: { fontWeight: 'bold', },
	});
	input_submit.add(input_submit_text);
	input_view.add(input_field);
	input_view.add(input_submit);
	self.add(input_view); 
	
	var table = Titanium.UI.createTableView({
		width: '100%',
		showVerticalScrollIndicator: false,
		rowHeight: 60,
	});
	
	insertItems();
	self.add(table);
	
	
	
	table.addEventListener('click', function(e) {
		self.result = e.row.children[0].text;
		navGroup.close(self);
	});
	
	input_field.addEventListener('return', function(e) {
		if(e.value.length > 0) { 
			if(!containsOnlyLetters(e.value)) {
				alert('New item must only contain letters');
				return;
			}
			self.result = e.value;
			navGroup.close(self);
		}
	});
	
	input_submit.addEventListener('click', function() {
		if(input_field.value.length > 0) { 
			if(!containsOnlyLetters(input_field.value)) {
				alert('New item must only contain letters');
				return;
			}
			self.result = input_field.value;
			navGroup.close(self);
		}
	});
	
	return self;
	
}
module.exports = search_items;
