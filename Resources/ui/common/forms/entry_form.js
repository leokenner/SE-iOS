

function entry_form(input, navGroup)
{
	var Cloud = require('ti.cloud'); 
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
		created_at: input.created_at?input.created_at:generateJsonDateString(),
		updated_at: input.updated_at?input.updated_at:generateJsonDateString(),
	}
	
	if(Titanium.App.Properties.getString('child')) {
		var _individual = getChildLocal(Titanium.App.Properties.getString('child'))[0].first_name+
						' '+getChildLocal(Titanium.App.Properties.getString('child'))[0].last_name;
	}
	else if(entry.record_id) {
		var child_id = getRecordLocal(entry.record_id)[0].child_id;
		var _individual = getChildLocal(child_id)[0].first_name+
						' '+getChildLocal(child_id)[0].last_name;
	}
	else {
		var _individual=null;
	}
																
	
		
	var window = Ti.UI.createWindow({
		backgroundColor: 'white'
	});
	var modalPicker=null;
	window.addEventListener('blur', function() {
		//If there is a modalPicker open, close it
		if(modalPicker) modalPicker.close();
	});
	
	var the_view = Ti.UI.createView({ width: '60%', });
	var the_name = Ti.UI.createLabel({ text: 'Entry', font: { fontWeight: 'bold', fontSize: '22', }, color: 'white', });
	var the_instruction = Ti.UI.createLabel({ text: 'Tap to view help', font: { fontSize: 10}, bottom: 0, });
	the_view.add(the_name);
	the_view.add(the_instruction);
	the_view.addEventListener('click', function() {
		var helpSection = require('ui/common/help_section/aboutEntries/indexEntries');
			helpSection = new helpSection();
			if(Titanium.Platform.osname == 'ipad') helpSection.show({ view: the_view });
			else { 
				helpSection.setTop(Titanium.Platform.displayCaps.platformHeight*0.9);
				helpSection.animate(Ti.UI.createAnimation({
					top: 0,
					curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
					duration: 500
				}));  
				helpSection.open();
			}	
				
	});
	window.setTitleControl(the_view);
	
	if(!navGroup) { 
		var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
			navGroupWindow = new navGroupWindow(window);
			navGroup = (navGroupWindow.getChildren())[0];
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
     		 		if(!Titanium.Network.online) {
     		 			alert('You do not have an internet connection');
     		 			return;
     		 		}
     		 	
     		  		entry.cloud_id = entry.cloud_id?entry.cloud_id:getEntryLocal(entry.id)[0].cloud_id;
					deleteEntryLocal(entry.id);			
					deleteObjectACS('entries', entry.cloud_id);
					//Check if this is the last entry of the record. If so, the record must also be deleted
					var record_cloud_id = getRecordLocal(entry.record_id)[0].cloud_id;
					var entries = getEntryBy('record_id', record_cloud_id);
					if(entries.length == 0) {
							deleteRecordLocal(entry.record_id);
							deleteObjectACS('records', record_cloud_id);
					}
					else {
							Cloud.Objects.update({
								    classname: 'records',
								    id: record_cloud_id,
								    fields: {},
								}, function (e) {
								    if (e.success) {
										updateRecordLocal(entry.record_id, 'updated_at', e.records[0].updated_at); 		
								    } else {
								        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
								    }
							});
						
					}
					Ti.App.fireEvent('eventSaved'); //This is to delete all related local notifications
					
      				if(navGroupWindow) navGroupWindow.close();
      				else navGroup.close(window);
      				break;

      		 	case 1:       			
      		 	default: break;
  				}
		});
		confirm.show();
	});
	
	
	
	save_btn.addEventListener('click', function() {
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
					      			if(navGroupWindow) navGroupWindow.close();
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
			 
			entry.main_entry = main_entry.text;
			if(navGroupWindow != undefined) {
				navGroupWindow.result = entry;
				navGroupWindow.close();
			}
			else { 
				window.result = entry;
				navGroup.close(window);
			}
		}
	});
	
	if(!input.record_id && Titanium.App.Properties.getString('child')) {
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
	if(!input.record_id && Titanium.App.Properties.getString('child')) table.setTop(70);
	
	var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: ' '});
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 90, hasChild: true, }));
	var when_description = Titanium.UI.createLabel({ text: 'Please note the date and at which this event took place, if applicable', left: 15, font: { fontSize: 15, }, });
	var dateTime_title = Titanium.UI.createLabel({ text: '*When', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var dateTime = Ti.UI.createLabel({ text: entry.date+' '+entry.time, left: '30%', width: '70%', bubbleParent: false, });
	var main_entry = Ti.UI.createLabel({ left: 15, width: '90%', text: entry.main_entry, font: { fontSize: 15, }, width: '100%', height: '100%', });
	sectionDetails.rows[0].add(when_description);
	sectionDetails.rows[1].add(dateTime_title);
	sectionDetails.rows[1].add(dateTime);
	sectionDetails.rows[2].add(main_entry);
	if(entry.id) {
		sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', })); 
		sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));
	}
	
	var sectionMetaData = Ti.UI.createTableViewSection();
	sectionMetaData.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 60, hasChild: true }));
	var individual_str = _individual?"Individual: "+_individual:'Click here to choose the individual this entry relates to. Select a name from the existing list '+
																	'or enter a new name.\n WARNING: This cannot be changed once entry is created.';
	var individual = Ti.UI.createLabel({ left: 15, width: '90%', height: '100%', text: individual_str, font: { fontSize: 15, }, });
	if(individual_str.charAt(0) != 'C') {
		individual.font = { fontWeight: 'bold', fontSize: '20' };
		sectionMetaData.rows[0].setBackgroundColor('#D4CFCF');
	}
	sectionMetaData.rows[0].add(individual);
	
	if(Titanium.App.Properties.getString('child')) {
		table.data = [sectionDetails];
	}
	else {
		table.data = [sectionMetaData, sectionDetails];
	}
	
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
	if(!Titanium.Network.online) {
		alert('Error:\n You are not connected to the internet. Cannot create new appointment');
		return false;
	}
	
	if(!entry.record_id) {
		if(Titanium.App.Properties.getString('child')) {
			entry.record_id = insertRecordLocal(Titanium.App.Properties.getString('child'));
		}
		//Created from the home screen. No child pre-selected
		else {
			var indiv_name = individual.text.split(': ')[1];
		    var indiv_first_name = indiv_name.split(' ')[0];
		    var indiv_last_name = indiv_name.split(' ')[1];
		    
			var _child = getChildByNameLocal(indiv_first_name, indiv_last_name);
			if(_child.length == 0) { //This individual doesnt exist, need to create new record book
		     		var row_id = insertChildLocal(Titanium.App.Properties.getString('user'), indiv_first_name,indiv_last_name,null,null,null);
					insertRelationshipLocal(row_id, Titanium.App.Properties.getString('user'), 'Relation Unknown: Tap to change');
					alert(indiv_name+" did not have a record book with StarsEarth. One has been created from them. You can find it in the main menu");
					Ti.App.fireEvent('individualEdited'); //update the main menu
			}
			if(_child.length > 0) entry.record_id = insertRecordLocal(_child[0].id);
			else if(row_id) entry.record_id = insertRecordLocal(row_id);
		}
	}
	
	entry.main_entry = main_entry.text;
	if(!entry.id) {
		entry.id = insertEntryLocal(entry.record_id,main_entry.text,entry.date,entry.time);
		createEntryACS(entry);   
	}
	else { 
		var cloud_version = getRecordLocal(entry.record_id);	
		if(cloud_version[0].cloud_id) { 
			Cloud.Objects.update({
				    classname: 'records',
				    id: cloud_version[0].cloud_id,
				    fields: {},
				}, function (e) {
			    if (e.success) {
					updateRecordLocal(entry.record_id,'updated_at',e.records[0].updated_at);	 		
			    } else {
			        Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+'\nrecords');
			    }
			});
		}
	}
	
	
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
	if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == 'blue') { 
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = '#CCC';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Changes Saved!';
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
	modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,'entry',dateTime.text); 

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
	if(Titanium.Platform.osname == 'iphone') (getNavGroup()).open(entry_page);
	if(Titanium.Platform.osname == 'ipad') entry_page.show({ view: main_entry });
													
	var page_closed = function() {
		if(entry_page.result === main_entry.text) return;
		if(!entry_page.result) {
			main_entry.text = "No entry entered";
		}
		else {
			main_entry.text = entry_page.result;
		}
		activateSaveButton();
	};
	
	if(Titanium.Platform.osname == 'iphone') entry_page.addEventListener('close', page_closed);
	if(Titanium.Platform.osname == 'ipad') entry_page.addEventListener('hide', page_closed);
});

sectionDetails.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		if(!validateDetails()) return;
		if(!beforeSaving()) return;
		saveDetails();
		
		var cloud_version = getEntryMainDetailsLocal(entry.id);
		if(cloud_version[0].cloud_id) { 
			Cloud.Objects.update({
				    classname: 'entries',
				    id: cloud_version[0].cloud_id,
				    fields: cloud_version[0],
				}, function (e) {
				    if (e.success) {
						 updateEntryLocal(entry.id, 'updated_at', e.entries[0].updated_at);	
				    } else {
				        Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+'\n Entries');
				    }
			});
		}
		
		deactivateSaveButton();
	}
});

individual.addEventListener('click', function(e) {
	if(e.row.backgroundColor == '#D4CFCF') {
		alert('Sorry, this cannot be changed');
		return;
	}
	var select_individual_page = require('ui/common/helpers/search_items');
	var the_individuals = getChildByUserIdLocal(Titanium.App.Properties.getString('user'));
	for(x in the_individuals) the_individuals[x] = the_individuals[x].first_name+' '+the_individuals[x].last_name;
	select_individual_page = new select_individual_page(navGroup, the_individuals, 'Select Individual');
	(getNavGroup()).open(select_individual_page);
	
	select_individual_page.addEventListener('close', function() { 
		if(select_individual_page.result) {
			individual.text = 'Individual: '+select_individual_page.result;
			individual.font = { fontWeight: 'bold', fontSize: '20', };
		}
	});
});


if(navGroupWindow) return navGroupWindow; 
else return window;	
	
}

module.exports = entry_form;
