

function entry_form(input, navGroup)
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/list.js');
	Ti.include('ui/common/database/database.js');
	
	var entry = {
		id: input.id?input.id:null,
		cloud_id: input.cloud_id?input.cloud_id:null,
		record_id: input.record_id?input.record_id:null,
		main_entry: input.main_entry?input.main_entry:'No entry entered',
		date: input.date?input.date:timeFormatted(new Date).date,
		time: input.time?input.time:timeFormatted(new Date).time,
	}
	
		
	var window = Ti.UI.createWindow({
		title: 'Entry',
		backgroundColor: 'white'
	});
	
	if(navGroup == undefined) { 
		var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
			navGroupWindow = new navGroupWindow(window);
			navGroupWindow.result = null;
	}
	
	function getNavGroup()
	{
		if(navGroupWindow != undefined) return (navGroupWindow.getChildren())[0];
		else return navGroup; 
	}
	
	if(entry.id) { var cancel_btn = Ti.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.TRASH }); }
	else { var cancel_btn = Ti.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.CANCEL }); }
	window.leftNavButton = cancel_btn;
	
	if(entry.id) { var save_btn = Ti.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.DONE }); }
	else { var save_btn = Ti.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.SAVE }); }
	window.rightNavButton = save_btn;
	
	cancel_btn.addEventListener('click', function() {
		if(entry.id == null) {
			if(navGroupWindow != undefined) navGroupWindow.close();
			else navGroup.close(window);
			return;
		}
	
		var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to delete this entry?', 
									message: 'All related records of appointments and other actions will also be deleted. This cannot be undone', 
									buttonNames: ['Yes','No'], cancel: 1 });
								
		confirm.addEventListener('click', function(g) { 
   				//Clicked cancel, first check is for iphone, second for android
   				if (g.cancel === g.index || g.cancel === true) { return; }


  			 	switch (g.index) {
     		 	case 0:
     		 		Ti.App.fireEvent('eventSaved'); //This is to delete all related local notifications
     		 	
     		  		entry.cloud_id = entry.cloud_id?entry.cloud_id:getEntryLocal(entry.id)[0].cloud_id;
					deleteEntryLocal(entry.id);			
					deleteObjectACS('entries', entry.cloud_id);
      				if(navGroupWindow != undefined) navGroupWindow.close();
      				else navGroup.close(window);
      				break;

      		 	case 1:       			
      		 	default: break;
  				}
		});
		confirm.show();
	});
	
	
	
	save_btn.addEventListener('click', function() {
	/*	if(table.scrollable == false) { return; }
		
		if(main_entry.value == null || main_entry.value == '') {
			alert('You do not seem to have entered anything for entry. Please re-check');
			return;
		}
		
		if(entry.record_id == null) {
			if(!Titanium.Network.online) {
				alert('Error:\n You are not connected to the internet. Cannot create new entry');
				return;
			}
			
			entry.record_id = insertRecordLocal(Titanium.App.Properties.getString('child'));
			entry.id = insertEntryLocal(entry.record_id,main_entry.value,entry.date,location.value);
			updateRecordLocal(entry.record_id,entry.id,'entry',timeFormatted(new Date()).date,timeFormatted(new Date()).time);
			
			createObjectACS('records', { id: entry.record_id, child_id: Titanium.App.Properties.getString('child'), current: entry.id,
										current_type: 'entry', latest_date: timeFormatted(new Date()).date, latest_time: timeFormatted(new Date()).time, });		
		
		
			createObjectACS('entries', { id: entry.id, record_id: entry.record_id, main_entry: main_entry.value, 
											date: entry.date, location: location.value, });
		}
		else if(entry.id == null) {
			entry.id = insertEntryLocal(entry.record_id,main_entry.value,entry.date,location.value);
			updateRecordLocal(entry.record_id,Titanium.App.Properties.getString('child'),entry.id,'entry',timeFormatted(new Date()).date,timeFormatted(new Date()).time);
		
			createObjectACS('entries', { id: entry.id, record_id: entry.record_id, main_entry: main_entry.value, 
											date: entry.date, location: location.value, });
		}
		else {
			updateEntryLocal(entry.id,main_entry.value,entry.date,location.value);
			updateRecordTimesForEntryLocal(entry.id, timeFormatted(new Date()).date, timeFormatted(new Date()).time);
		} */
		if(entry.id != null) {
			var all_saved=true;
			
				for(var i=0; i < table.data.length; i++) {
					if(table.data[i].rows[table.data[i].rowCount-1].backgroundColor == 'blue') {
						all_saved=false;
						var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to close the window?', 
								message: 'You have not saved your changes', 
								buttonNames: ['Yes','No'], cancel: 1 });
								
						confirm.addEventListener('click', function(g) { 
					   			//Clicked cancel, first check is for iphone, second for android
					   			if (g.cancel === g.index || g.cancel === true) { return; }
					
					
					  			 switch (g.index) {
					     		 case 0:
					      			if(navGroupWindow != undefined) navGroupWindow.close();
      								else navGroup.close(window);
					      			return;
					
					      		 case 1:       			
					      		 default: return;
					  			}
							});
							confirm.show();
							
					}
				}
				if(all_saved) {
					if(navGroupWindow != undefined) navGroupWindow.close();
      				else navGroup.close(window); 
					return;
				}
		}
		else {
			if(!validateDetails()) return;
			if(!beforeSaving()) return;
			saveDetails();
			 
			entry.main_entry = main_entry.value;
			navGroupWindow.result = entry;
			if(navGroupWindow != undefined) navGroupWindow.close();
			else navGroup.close(window);
		}
	});
	
	if(!input.record_id) {
		var the_message = Ti.UI.createView({
			width: '100%',
			zIndex: 3,
			height: 70,
			top: 0,
			backgroundColor: 'blue',
			borderColor: 'blue'
			});
			
			the_message.add(Ti.UI.createLabel({ text: "You must create an entry in order to start a new record", textAlign: 'center', color: 'white' }));
															
			if(the_message) window.add(the_message);
	}
	
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator: false,
		rowHeight: 45,
		scrollable: false,
		top: 0,
	});
	if(!input.record_id) table.setTop(70);
	
	var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: ' '});
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 90, hasChild: true, }));
	var dateTime_title = Titanium.UI.createLabel({ text: '*When', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var dateTime = Ti.UI.createLabel({ text: entry.date+' '+entry.time, left: '30%', width: '70%', bubbleParent: false, });
	var main_entry = Ti.UI.createLabel({ left: 15, width: '90%', text: entry.main_entry, font: { fontSize: 15, }, });
	sectionDetails.rows[0].add(dateTime_title);
	sectionDetails.rows[0].add(dateTime);
	sectionDetails.rows[1].add(main_entry);
	if(entry.id) {
		sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', })); 
		sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));
	}
	
	table.data = [sectionDetails];
	setTableHeight(table);
	
	window.add(table);
	
function setTableHeight(table)
{
	var height=0;
	
	for(var i=0; i < table.data.length; i++) {
		if(table.data[i].headerView) height += table.data[i].headerView.height;
		else height += 22;
		
		for(var j=0; j < table.data[i].rows.length; j++) {
			if(table.data[i].rows[j].height) height += table.data[i].rows[j].height;
			else height += 45;
		}
	}
	table.setHeight(height);
}	

function beforeSaving() 
{
	if(table.scrollable == false) return false;
	
	if(!Titanium.Network.online) {
		alert('Error:\n You are not connected to the internet. Cannot create new appointment');
		return false;
	}
	
	if(!entry.record_id) {
		entry.record_id = insertRecordLocal(Titanium.App.Properties.getString('child'));
		entry.id = insertEntryLocal(entry.record_id,main_entry.value,entry.date,entry.time);
		
		createObjectACS('records', { id: entry.record_id, child_id: Titanium.App.Properties.getString('child'), current: entry.id,
										current_type: 'entry', latest_date: timeFormatted(new Date()).date, latest_time: timeFormatted(new Date()).time, });	
	}
	
	if(!entry.id) {
		entry.id = insertEntryLocal(entry.record_id,main_entry.value,entry.date,entry.time);
		
		createObjectACS('entries', { id: entry.id, record_id: entry.record_id, main_entry: main_entry.value, 
											date: entry.date, });
	}
	updateRecordLocal(entry.record_id,entry.id,'entry',timeFormatted(new Date()).date,timeFormatted(new Date()).time);
	
	return true;
}

function activateSaveButton()
{
	if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == '#CCC') { 
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Save Changes';
	}
}

function deactivateSaveButton()
{
	if(sectionDetails.rows[sectionDateTime.rowCount-1].backgroundColor == '#CCC') { 
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Save Changes';
	}
}

function validateDetails()
{
	if(main_entry.text === "No entry entered") {
		alert('You have not entered an entry');
		return false;
	}
	
	if(new Date(dateTime.text) > new Date()) {
		alert('The date and time of the entry should be in the present or past');
		return false;
	}
	
	return true;
}

function saveDetails()
{
	updateEntryLocal(entry.id, 'date', entry.date);
	updateEntryLocal(entry.id, 'time', entry.time);
	updateEntryLocal(entry.id, 'main_entry', main_entry.text);
	
	return true;
}

	

dateTime.addEventListener('click', function(e) {
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,'entry',dateTime.text); 

	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;

	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: dateTime });


	var picker_closed = function() {
		if(modalPicker.result) { 
			var newDate = timeFormatted(modalPicker.result);
			entry.date = newDate.date;
			entry.time = newDate.time;
			dateTime.text = newDate.date+' '+newDate.time;
			activateSaveButton();
		}
		window.setTouchEnabled(true);
		if(window.leftNavButton != null) { 
			window.leftNavButton.setTouchEnabled(true);
		}
		window.rightNavButton.setTouchEnabled(true); 
		table.scrollable = true;
	};
	
	if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
	if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

main_entry.addEventListener('click', function(e) {	
	var entry_page = require('ui/common/helpers/textarea');
	if(main_entry.text === "No entry entered") {
		var main_entry_text = '';
	}
	else {
		var main_entry_text = main_entry.text;
	}
	entry_page = new entry_page('Main Entry', "Enter your entry here", main_entry_text);
	(getNavGroup()).open(entry_page);
													
	entry_page.addEventListener('close', function() {
		if(!entry_page.result) {
			main_entry.text = "No entry entered";
		}
		else {
			main_entry.text = entry_page.result;
		}
		activateSaveButton();
	});
});

sectionDetails.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		if(!validateDetails()) return;
		if(!beforeSaving()) return;
		saveDetails();
		
		deactivateSaveButton();
	}
});


if(navGroup == undefined) { navGroup = (navGroupWindow.getChildren())[0]; return navGroupWindow; }
else return window;	
	
}

module.exports = entry_form;
