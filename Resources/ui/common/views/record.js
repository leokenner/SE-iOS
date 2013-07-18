


function record(input, navGroup) {

	//get the index at which to insert the new time
	//0 and above means insert below, -1 means insert above the first row 
	//-3 means there are no rows in the array and this should be appended
	//designed to order records according to date/time with most recent first
	function getIndex(date_time)
	{
		var array = (table.data[0])?table.data:[];
		date = date_time;
		
		if(array.length == 0) return -3;
		
		var start = 0;
		var end = array.length-1;
		var mid = Math.floor(array.length/2);
		
		while(1)
		{
			if(date == array[mid].object.updated_at) return mid;
			if(start >= end) {
				if(date < array[end].object.updated_at) {
					return end;
				}
				else {
					return start-1;
				}
			}
			if(date >= array[start].object.updated_at) {
				if(date != array[start].object.updated_at) {
					return start-1;
				}
			}
			if(date < array[end].object.updated_at) return end;
			if(date < array[mid].object.updated_at) {
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
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'Record',
});
self.result=null;

if(!navGroup) { 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroup = (navGroupWindow.getChildren())[0];
		navGroupWindow.result = null;
}

function getNavGroup()
{
	if(navGroupWindow) return (navGroupWindow.getChildren())[0];
	else return navGroup; 
}

function newEntrySection(entry)
{
	var entry_section = require('ui/common/views/entrySection');
	entry_section = new entry_section(entry, navGroup);	
	//table.insertSectionBefore(0, entry_section, {animated: true, });
	var index = getIndex(entry.updated_at);
	if(index == -3) {
		table.appendSection(entry_section, {animated: true, });
	}
	else if(index == -1) {
		table.insertSectionBefore(0, entry_section, { animated: true, });
	}
	else {
		table.insertSectionAfter(index, entry_section, {animated: true, })
	}
}

function createNewEntry()
{
	var entry_form = require('ui/common/forms/entry_form');
		var entry = { 
			record_id: input.id,  
		};
		entry_form = new entry_form(entry, navGroup); 
		(getNavGroup()).open(entry_form);
			
			entry_form.addEventListener('close', function() {
				if(entry_form.result != null) {					
					newEntrySection(getEntryLocal(entry_form.result.id)[0]);
				}
				else {
					if(!input.id) {
						if(navGroupWindow) navGroupWindow.close();
						else navGroup.close(self);
					}
					else if(getEntryBy('record_id', input.id).length == 0) {
						if(navGroupWindow) navGroupWindow.close();
						else navGroup.close(self);
					}
				}
			});
}

var close_btn = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.DONE
});

close_btn.addEventListener('click', function() {
	if(navGroupWindow != undefined) navGroupWindow.close();
	else {
		self.fireEvent('closed');
		navGroup.close(self);
	}
});
self.leftNavButton = close_btn;

var add_btn = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ADD
});
//self.rightNavButton = add_btn;

var actionDialog = Titanium.UI.createOptionDialog({
    options: ['Follow-up Entry','Cancel'],
    cancel:1
});

actionDialog.addEventListener('click', function(e) {
	if(e.index == 0) {
		createNewEntry();
	}
});

add_btn.addEventListener('click', function() {
	actionDialog.show({ view: add_btn });
});

var table = Titanium.UI.createTableView({
	width: '100%',
	showVerticalScrollIndicator: false,
});

self.add(table);

var entries = getEntryBy('record_id', input.id);
if(entries.length == 0) createNewEntry();
for(var i=0; i < entries.length; i++) {
	newEntrySection(entries[i]);
	table.data[table.data.length-1].sectionIndex = table.data.length-1;
}

table.addEventListener('entryEdited', function(e) {
	for(i=0;i < this.data.length;i++ ) {
		var section = this.data[i];
		if(e.source.object.id == section.object.id) { 
			table.deleteSection(i);
			break;
		}
	}
	var entry = getEntryLocal(e.source.object.id);
	if(entry.length > 0) {
		newEntrySection(entry[0]);
		return;
	}
	var entries = getEntryBy('record_id', e.source.object.record_id);
	if(entries.length == 0) {
		if(navGroupWindow) navGroupWindow.close();
		else {
			self.fireEvent('closed');
			navGroup.close(self);
		}
	}
});

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = record;