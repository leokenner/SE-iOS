

function dates(navGroup, input, mindate)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/helpers/dateTime.js');
	
	var dates = [];
	
	//get the index at which to insert the new time
	//0 and above means insert below, -1 means insert above the first row, -2 means the time exists and no row should be added, 
	//-3 means there are no rows in the array and this should be appended
	function getIndex(date)
	{
		var array = table.data[0]?table.data[0].rows:[];
		
		if(array.length == 0) return -3;
		
		var start = 0;
		var end = array.length-1;
		var mid = Math.floor(array.length/2);
		var date_obj = new Date(date);
		
		while(1)
		{
			if(date_obj == new Date(array[mid].children[0].text)) return -2;
			if(start >= end) {
				if(date_obj > new Date(array[end].children[0].text)) {
					return end;
				}
				else {
					return start-1;
				}
			}
			if(date_obj < new Date(array[start].children[0].text)) {
				return start-1;
			}
			if(date_obj > new Date(array[end].children[0].text)) return end;
			if(date_obj > new Date(array[mid].children[0].text)) {
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
	
	function insertDate(date)
	{
		var row = Ti.UI.createTableViewRow({ height: 80, selectedBackgroundColor: 'white', });
		var date_lbl = Ti.UI.createLabel({ text: date, left: 15, font: { fontWeight: 'bold', fontSize: 18, }, width: '50%', height: 80, });
		row.add(date_lbl);
		var trash_btn = Titanium.UI.createView({ backgroundColor: 'red', right: 15, width: 100, height: 30, });
		var trash_txt = Ti.UI.createLabel({ text: 'Remove', color: 'white', font: { fontWeight: 'bold', }, });
		trash_btn.add(trash_txt);
		row.add(trash_btn);
			
		var index = getIndex(date);
		if(index == -2) return;
		else if(index == -3) {
			table.appendRow(row);
			dates.push(date);
		}
		else if(index == -1) {
			table.insertRowBefore(0, row, { animated: true, });
			dates.splice(0,0,date);		
		}
		else {
			table.insertRowAfter(index, row, { animated: true, });	
			if(index == dates.length - 1) dates.push(date);
			else dates.splice(index+1,0,date);	
		}
		//table.appendRow(row);
	}
	
	
	function insertDates(input)
	{
		for(i in input) insertDate(input[i]);
	} 
	
	var self = Titanium.UI.createWindow({
	  backgroundColor:'white',
	  height: 'auto'
	});
	self.result = null;
	
	self.addEventListener('close', function() {
		self.result = dates;
	});
	
	var add_btn = Ti.UI.createButton({
		title: '+',
	});
	self.rightNavButton = add_btn;
	
	add_btn.addEventListener('click', function() {
		var current_date = new Date(dates[dates.length-1]);
		var tomorrow_date = new Date(current_date.setDate(current_date.getDate()+1));
		insertDate(timeFormatted(tomorrow_date).date);
	});
	
/*	var repeat_view = Ti.UI.createView({ height: 130, top: 0, zIndex: 2, width: '100%', backgroundColor: 'white', layout: 'vertical', borderColor: '#999999' });
	var repeat_instruction = Ti.UI.createLabel({ text: 'How often should this activity be repeated?', textAlign: 'center', width: '80%', });
	var repeat_btn = Titanium.UI.createView({ backgroundColor: 'blue', width: 120, height: 30, top: 10, });
	var repeat_txt = Ti.UI.createLabel({ text: input.repeat, color: 'white', font: { fontWeight: 'bold', }, });
	var add_btn = Titanium.UI.createView({ backgroundColor: 'blue', width: 120, height: 30, top: 10, });
	var add_txt = Ti.UI.createLabel({ text: 'Add a date', color: 'white', font: { fontWeight: 'bold', }, });
	var startend_view = Ti.UI.createView({ })
	repeat_view.add(repeat_instruction);
	repeat_btn.add(repeat_txt);
	add_btn.add(add_txt);
	repeat_view.add(repeat_btn);
	repeat_view.add(add_btn);
	if(input.repeat !== 'I will add dates') add_btn.hide();
	
	add_btn.addEventListener('click', function() {
		var current_date = new Date(input.dates[input.dates.length-1]);
		var tomorrow_date = new Date(current_date.setDate(current_date.getDate()+1));
		insertDate(timeFormatted(tomorrow_date).date);
		input.dates.push(timeFormatted(tomorrow_date).date);
	}); */
	
	var table = Titanium.UI.createTableView({
		top: 0,
		width: '100%',
	});
	insertDates(input);
	
	//self.add(repeat_view);
	self.add(table);
	
	
	table.addEventListener('click', function(e) {
		if(e.source.backgroundColor == "red" || e.source.color == 'white') {
			table.deleteRow(e.row);
			dates.splice(e.index,1);
			return;
		}
		
		var mindate_obj = new Date(mindate);
		var date = e.row.children[0].text;
		var date_obj = new Date(date);
		var pickerWindow = require('ui/common/helpers/events/dateTimePicker');
		pickerWindow = new pickerWindow(navGroup, date, { type: Ti.UI.PICKER_TYPE_DATE, 
																			minDate: new Date(mindate_obj.getFullYear(),mindate_obj.getMonth(),mindate_obj.getDate(),mindate_obj.getHours(),mindate_obj.getMinutes(),null,null),
																			maxDate: new Date(date_obj.getFullYear()+2,12,31,date_obj.getHours(),date_obj.getMinutes(),null,null),
																			value: date_obj, 
																			});
		table.deleteRow(e.index);
		dates.splice(e.index,1);
		navGroup.open(pickerWindow);
			
		pickerWindow.addEventListener('close', function() {
			insertDate(pickerWindow.result);
			//input[e.index] = pickerWindow.result;
		});
	});
	
	return self;
}
module.exports = dates;
