


function appointment(input, navGroup)
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/strings.js');
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/calendar/notifications.js');
	
	var appointment = {
		id: input.id?input.id:null,
		cloud_id: input.cloud_id?input.cloud_id:null,
		entry_id: input.entry_id?input.entry_id:null,
		diagnosis: input.diagnosis?input.diagnosis:null,
		final_diagnosis: input.final_diagnosis?input.final_diagnosis:null,
		status: input.status?input.status:'Scheduled',
		date: input.date?input.date:timeFormatted(new Date()).date,
		time: input.time?input.time:timeFormatted(new Date()).time,
		duration: input.duration?input.duration:{
								hours: 0,
								minutes: 0,
								},
		repeat: input.repeat?input.repeat:'once only',
		alert: input.alert?input.alert:'30 minutes before',
		calendar_event_id: input.calendar_event_id?input.calendar_event_id:null,
		categories: input.categories?input.categories:[],
		symptoms: input.symptoms?input.symptoms:[],
		additional_notes: input.additional_notes?input.additional_notes:"No additional notes",
		doctor: input.doctor?input.doctor:{
								name: null,
								location: null,
								street: null,
								city: null,
								state: null,
								zip: null,
								country: null,
								},		
	}
	
	if(Titanium.App.Properties.getString('child')) {
		var _individual = getChildLocal(Titanium.App.Properties.getString('child'))[0].first_name+
						' '+getChildLocal(Titanium.App.Properties.getString('child'))[0].last_name;
	}
	else if(appointment.entry_id) {
		var record_id = getEntryLocal(appointment.entry_id)[0].record_id;
		var child_id = getRecordLocal(record_id)[0].child_id;
		var _individual = getChildLocal(child_id)[0].first_name+
						' '+getChildLocal(child_id)[0].last_name;
	}
	else {
		var _individual=null;
	}
	
	var _entry={
		id: appointment.entry_id,
		date: appointment.entry_id?getEntryLocal(appointment.entry_id)[0].date:timeFormatted(new Date()).date,
		time: appointment.entry_id?getEntryLocal(appointment.entry_id)[0].time:timeFormatted(new Date()).time,
		main_entry: appointment.entry_id?getEntryLocal(appointment.entry_id)[0].main_entry:undefined,
	}; //This is for the meta data section, it shows the related entry if it hasnt been saved yet
	
	
	appointment.activities = getActivitiesForAppointmentLocal(appointment.id);
	appointment.treatments = getTreatmentsForAppointmentLocal(appointment.id);
	
	var symptoms_string='';
	for(var i=0;i < appointment.symptoms.length; i++) {
		symptoms_string += appointment.symptoms[i];
		if(i != appointment.symptoms.length -1) symptoms_string += ', ';
	}
	
	var window = Titanium.UI.createWindow({
  		backgroundColor:'white',
  		layout: 'vertical',
  		height: 'auto',
	});
	var modalPicker=null;
	window.addEventListener('blur', function() {
		//If there is a modalPicker open, close it
		if(Titanium.Platform.osname == 'iphone') 
			if(modalPicker) modalPicker.close();
	});
	
	var the_view = Ti.UI.createView({ width: '60%', });
	var the_name = Ti.UI.createLabel({ text: 'Appointment', font: { fontWeight: 'bold', fontSize: '22', }, color: 'white', });
	var the_instruction = Ti.UI.createLabel({ text: 'Tap to view help', font: { fontSize: 10}, bottom: 0, });
	the_view.add(the_name);
	the_view.add(the_instruction);
	the_view.addEventListener('click', function() {
		var helpSection = require('ui/common/help_section/aboutAppointments/indexAppointments');
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
	}
	
	function getNavGroup()
	{
		if(navGroupWindow) return (navGroupWindow.getChildren())[0];
		else return navGroup; 
	}
	
	var warning = Ti.UI.createView({
	width: '100%',
	zIndex: 3,
	height: 70,
	backgroundColor: 'red',
	borderColor: 'red'
	});
	
	warning.add(Ti.UI.createLabel({ text: 'NOTE: This is for personal records, it does not schedule an actual appointment', textAlign: 'center', color: 'white' }));
	window.add(warning);
	
	if(appointment.id) { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.DONE }); } 
	else { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.SAVE }); }
	window.rightNavButton = save_btn;
	
	if(appointment.id) { var cancel_btn = Titanium.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.TRASH }); }
	else { var cancel_btn = Titanium.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.CANCEL }); }
	window.leftNavButton = cancel_btn;
	
	cancel_btn.addEventListener('click', function() {
		if(appointment.id == null) {
			if(navGroupWindow) navGroupWindow.close();
			else navGroup.close(window);
			return;
		}
		var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to delete the record of this appointment?', 
								message: 'This cannot be undone', 
								buttonNames: ['Yes','No'], cancel: 1 });
								
	confirm.addEventListener('click', function(g) { 
   			//Clicked cancel, first check is for iphone, second for android
   			if (g.cancel === g.index || g.cancel === true) { return; }


  			 switch (g.index) {
     		 case 0:
     		 	
     		  	appointment.cloud_id = appointment.cloud_id?appointment.cloud_id:getAppointmentLocal(appointment.id)[0].cloud_id;
				deleteAppointmentLocal(appointment.id);			
				deleteObjectACS('appointments', appointment.cloud_id);
				if(appointment.calendar_event_id) { 
					var defCalendar = Ti.Calendar.defaultCalendar;
					var event = defCalendar.getEventById(appointment.calendar_event_id);
					event.remove(Titanium.Calendar.SPAN_FUTUREEVENTS);
				}
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
			if(appointment.id != null) {
				var all_saved=true;
				
					for(var i=0; i < table.data.length; i++) {
						//Check if the last row of the section is blue. In the case of the status section, this could also
						//be the second last row. 
						if(table.data[i].rows[table.data[i].rowCount-1].backgroundColor == 'blue' ||
							table.data[i].rows[table.data[i].rowCount-2].backgroundColor == 'blue') {
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
						if(navGroupWindow) navGroupWindow.close();
      					else navGroup.close(window); 
						return;
					} 
			}
			else { 
				if(!validateDateTime() || !validateSymptoms() || !validateDoctorDetails()) return;
				if(!beforeSaving()) return;
				saveStatusData();
				saveDetails();
				
				if(navGroupWindow) {
					navGroupWindow.result = appointment;
					navGroupWindow.close();
				}
      			else {
      				window.result = appointment;
      				navGroup.close(window); 
      			}
			}
	});
	
	var table = Titanium.UI.createTableView({
	showVerticalScrollIndicator: false,
	rowHeight: 45,
	//separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	});
	
		
var sectionStatus = Ti.UI.createTableViewSection({ headerTitle: 'Status (tap to change)', });
sectionStatus.add(Ti.UI.createTableViewRow());
var status_title = Titanium.UI.createLabel({ text: 'Status', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var status = Ti.UI.createLabel({ left: '40%', width: 150, height: 60, text: appointment.status, font: { fontWeight: 'bold', fontSize: 20, }, });
sectionStatus.rows[0].add(status_title);
sectionStatus.rows[0].add(status);

var rowAdditionalNotes = Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white', hasChild: true, })
var additional_notes = Ti.UI.createLabel({ left: 15, width: '90%', text: appointment.additional_notes, font: { fontSize: 15, }, });
rowAdditionalNotes.add(additional_notes);
if(appointment.status === 'Completed') {
	sectionStatus.add(rowAdditionalNotes);
}

if(appointment.id) {
	sectionStatus.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionStatus.rows[sectionStatus.rowCount-1].add(Ti.UI.createLabel({ text: 'No changes made', textAlign: 'center', font: { fontSize: 15, }, }));
}

var rowNextActions = Ti.UI.createTableViewRow({ height: 80, hasChild: true, });
var nextActions_title = Titanium.UI.createLabel({ text: 'Recommended activities / prescribed treatments', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
rowNextActions.add(nextActions_title);
var activities = getActivitiesForAppointmentLocal(appointment.id);
var treatments = getTreatmentsForAppointmentLocal(appointment.id);
if(appointment.status === 'Completed') { 
	sectionStatus.add(rowNextActions);
}


var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Appointment Details(*=required)' });
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
sectionDetails.add(Ti.UI.createTableViewRow());
sectionDetails.add(Ti.UI.createTableViewRow());
sectionDetails.add(Ti.UI.createTableViewRow({ height: 135 }));
var dateTime = Titanium.UI.createLabel({ text: appointment.date+' '+appointment.time, left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var duration_title = Titanium.UI.createLabel({ text: '*Duration', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
if(appointment.duration.hours == 0 && appointment.duration.minutes == 0) var string = 'No duration given';
else {
	var string = (appointment.duration.hours > 0)?appointment.duration.hours+' hours ':'';
	string += (appointment.duration.minutes > 1)?appointment.duration.minutes+' minutes':'';
}
var duration = Titanium.UI.createLabel({ text: string, width: '50%', left: '50%', });
var repeat_title = Titanium.UI.createLabel({ text: '*Repeat', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var repeat = Titanium.UI.createLabel({ text: appointment.repeat, width: '50%', left: '50%', bubbleParent: false, });
var alert_title = Titanium.UI.createLabel({ text: '*Alert', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var alert_text = Titanium.UI.createLabel({ text: appointment.alert, width: '50%', left: '50%', bubbleParent: false, });
if(appointment.symptoms.length == 0) var symptoms_message = "No symptom listed";
else if(appointment.symptoms.length == 1) var symptoms_message = appointment.symptoms.length+" symptom listed";
else var symptoms_message = appointment.symptoms.length+" symptoms listed";
var symptoms_title = Titanium.UI.createLabel({ text: symptoms_message, left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, });

var name_title = Titanium.UI.createLabel({ text: '*Doctor', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var name = Ti.UI.createTextField({ hintText: 'eg: James Smith', value: appointment.doctor.name, left: '40%', width: '60%' });
var location_title = Titanium.UI.createLabel({ text: 'Location', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var location = Ti.UI.createTextField({ hintText: 'Clinic/Hospital name', value: appointment.doctor.location, left: '40%', width: '60%' });
var address_title = Titanium.UI.createLabel({ text: 'Address', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var street = Ti.UI.createTextField({ hintText: 'Street', value: appointment.doctor.street, borderColor: '#CCC', leftButtonPadding: 5, height: 45, width: '60%', left: '40%', top: 0 });
var city = Ti.UI.createTextField({ hintText: 'City', value: appointment.doctor.city, borderColor: '#CCC', leftButtonPadding: 5, left: '40%', height: 45, width: '40%',  top: 45 });
var state = Ti.UI.createTextField({ hintText: 'State', value: appointment.doctor.state, borderColor: '#CCC', leftButtonPadding: 5, left: '80%', height: 45, width: '20%', top: 45 });
var zip = Ti.UI.createTextField({ hintText: 'ZIP', value: appointment.doctor.zip, borderColor: '#CCC', leftButtonPadding: 5, left: '40%', height: 45, width: '20%', top: 90 });
var country = Ti.UI.createTextField({ hintText: 'Country', value: appointment.doctor.country, borderColor: '#CCC', leftButtonPadding: 5, left: '60%', height: 45, width: '40%', top: 90 });
sectionDetails.rows[0].add(dateTime);
sectionDetails.rows[1].add(duration_title);
sectionDetails.rows[1].add(duration);
sectionDetails.rows[2].add(repeat_title);
sectionDetails.rows[2].add(repeat);
sectionDetails.rows[3].add(alert_title);
sectionDetails.rows[3].add(alert_text);
sectionDetails.rows[4].add(symptoms_title);
sectionDetails.rows[5].add(name_title);
sectionDetails.rows[5].add(name);
sectionDetails.rows[6].add(location_title);
sectionDetails.rows[6].add(location);
sectionDetails.rows[7].add(address_title);
sectionDetails.rows[7].add(street);
sectionDetails.rows[7].add(city);
sectionDetails.rows[7].add(state);
sectionDetails.rows[7].add(zip);
sectionDetails.rows[7].add(country);
if(appointment.id) {
	sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'No changes made', textAlign: 'center', font: { fontSize: 15, }, }));
}

var sectionMetaData = Ti.UI.createTableViewSection();
sectionMetaData.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 100, hasChild: true }));
var individual_str = _individual?"Individual: "+_individual:'Click here to choose the individual this entry relates to. Select a name from the existing list '+
																	'or enter a new name\n WARNING: This cannot be changed once the appointment has been created';
var individual = Ti.UI.createLabel({ left: 15, width: '90%', text: individual_str, font: { fontSize: 14, }, });
if(individual_str.charAt(0) != 'C') {
	individual.font = { fontWeight: 'bold', fontSize: '20' };
	sectionMetaData.rows[0].setBackgroundColor('#D4CFCF');
}
sectionMetaData.rows[0].add(individual);
var entry_dateTime_str = _entry.id?'On '+_entry.date+' at '+_entry.time:'';
var entry_dateTime = Ti.UI.createLabel({ left: 15, top: 5, width: '90%', text: entry_dateTime_str, font: { fontSize: 14, }, });

var entry_str = _entry.main_entry?_entry.main_entry:"What event led to this appointment? You can choose from an existing entry or write a new entry.\n"+
															"WARNING: You cannot change this once the appointment has been created";
var entry = Ti.UI.createLabel({ left: 15, width: '90%', text: entry_str, font: { fontSize: 14, }, });

if(individual_str.charAt(0) != 'C') { 
	sectionMetaData.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 100, hasChild: true }));
	sectionMetaData.rows[1].add(entry_dateTime);
	sectionMetaData.rows[1].add(entry);
}
if(_entry.main_entry) {
	sectionMetaData.rows[1].setBackgroundColor('#D4CFCF');
}

//Rules for what to display as the status
if(appointment.status === 'Completed' || appointment.status === 'Cancelled') {
	blurSection(sectionDetails);
}

//If the date is in the past, its been missed
if(appointment.id && (new Date(appointment.date+' '+appointment.time) < new Date()) && appointment.status === 'Scheduled') {
	status.text = 'Missed';
	sectionStatus.rows[0].backgroundColor = 'red';
	blurSection(sectionDetails);
}

//If its complete, show the additional sections for prescription, additional notes etc
//If its incomplete, just show status section
//If its being filled out for the first time, ie: appointment.id does not exist, do not show status
if(appointment.id) {
	if(Titanium.App.Properties.getString('child')) {
		table.data = [sectionStatus, sectionDetails];
	}
	else {
		table.data = [sectionMetaData, sectionStatus, sectionDetails];
	}
}
else {
	if(Titanium.App.Properties.getString('child')) {
		table.data = [sectionDetails];
	}
	else {
		table.data = [sectionMetaData, sectionDetails];
	}
}

window.add(table);


//returns true if a new appointment was successfully created
//returns false otherwise
function beforeSaving() 
{
	if(table.scrollable == false) return false;
	
	if(!Titanium.Network.online) {
		alert('Error:\n You are not connected to the internet. Cannot create new appointment');
		return false;
	}
	
	if(!appointment.id) { 
		appointment.doctor.name = name.value;
		appointment.doctor.location = location.value.replace("'","");
		appointment.doctor.street = street.value;
		appointment.doctor.city = city.value;
		appointment.doctor.state = state.value;
		appointment.doctor.zip = zip.value;
		appointment.doctor.country = country.value;
		appointment.status = status.text;
		//appointment.diagnosis = diagnosis.value;
	}
				
	if(!appointment.entry_id) {
		if(Titanium.App.Properties.getString('child')) {
			//This will never be the case
		}
		//Created from the home screen. No child pre-selected
		else {
			if(individual.text.charAt(0) != 'I') {
				alert('You have not mentioned which individual this appointment is for');
				table.scrollToIndex(0);
				return;
			}
			if(!_entry.main_entry) {
				alert('You have not mentioned an entry that this appointment is related to');
				table.scrollToIndex(0);
				return;
			}
			var indiv_name = individual.text.split(': ')[1];
		    var indiv_first_name = indiv_name.split(' ')[0];
		    var indiv_last_name = indiv_name.split(' ')[1];
		    
			var _child = getChildByNameLocal(indiv_first_name, indiv_last_name);
			if(_child.length == 0) { //This individual doesnt exist, need to create new record book
		     		var row_id = insertChildLocal(Titanium.App.Properties.getString('user'), indiv_first_name,indiv_last_name,null,null,null);
					insertRelationshipLocal(row_id, Titanium.App.Properties.getString('user'), 'Relation Unknown: Tap to change');
					Ti.App.fireEvent('individualEdited');  //update main menu
			}			
			if(!appointment.entry_id) {
				if(!_entry.id) {
					if(_child.length > 0) var record_id = insertRecordLocal(_child[0].id);
					else if(row_id) var record_id = insertRecordLocal(row_id);
					appointment.entry_id = _entry.id = insertEntryLocal(record_id, _entry.main_entry, _entry.date, _entry.time);
				}
				else {
					appointment.entry_id = _entry.id;
				}
			}	
		}
		
	}
	
	if(!appointment.id) {
		appointment.id = insertAppointmentLocal(appointment.entry_id, appointment.date, appointment.time);
		createAppointmentACS(appointment, _entry);
	}
	updateRecordTimesForEntryLocal(appointment.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
	updateAppointmentLocal(appointment.id, 'updated_at', timeFormatted(new Date()).date+' '+timeFormatted(new Date()).time);
	
	appointment.entry_id = _entry.id;
	var get_record_id = getEntryLocal(appointment.entry_id)[0].record_id;
	 
	var cloud_version = getRecordMainDetailsLocal(get_record_id);
	
		if(cloud_version[0].cloud_id && Titanium.Network.online) { 
			Cloud.Objects.update({
				    classname: 'records',
				    id: cloud_version[0].cloud_id,
				    fields: cloud_version[0],
				}, function (e) {
				    if (e.success) {
						 		
				    } else {
				        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				    }
			});
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

//grey out an entire section to show it cant be modified
function blurSection(section)
{
	for(var i=0; i < section.rowCount; i++) {
		section.rows[i].backgroundColor = '#999999';
		var children = section.rows[i].children;
		for(var j=0; j < children.length; j++) {
			if(children[j].value != undefined) {
				children[j].setEnabled(false);
			}
			children[j].backgroundColor = '#999999';
		}
	}
}

//un-grey an entire section to show it can be modified
function unBlurSection(section)
{
	for(var i=0; i < section.rowCount; i++) {
		section.rows[i].backgroundColor = 'white';
		var children = section.rows[i].children;
		for(var j=0; j < children.length; j++) {
			children[j].backgroundColor = 'white';
			if(children[j].value != undefined) { 
				children[j].setEnabled(true);
			}
			if(i == section.rowCount-1) {
				section.rows[i].backgroundColor = '#CCC';
				children[j].backgroundColor = 'transparent';
			}
		}
	}
}

function isBlurred(e)
{
	return (e.row.backgroundColor == '#999999')?true:false; 
}

//returns true if user has allowed a status change, otherwise return false
function changeStatusAndUnblur()
{
	var confirm = Titanium.UI.createAlertDialog({ title: 'You cannot edit this field', 
							message: 'You must declare this appointment as scheduled in order to edit this field.'+
										' Would you like to change the status to scheduled?', 
							buttonNames: ['Yes','No'], cancel: 1 });
										
					confirm.addEventListener('click', function(g) { 
				  			//Clicked cancel, first check is for iphone, second for android
				   		if (g.cancel === g.index || g.cancel === true) { return; }
							
							
				  		 switch (g.index) {
				     		 case 0:
				     		 	if(status.text === 'Completed') {
				     		 		table.deleteRow(rowAdditionalNotes);
				     		 		if(appointment.activities.length > 0 || appointment.treatments.length > 0) {
				     		 			table.deleteRow(rowNextActions);
				     		 		}				     		 		
				     		 	}
				      			status.text = 'Scheduled';
				      			saveStatus(sectionStatus.rowCount-1);
				      			unBlurSection(sectionDetails);
				      			return true;
							
				      		 case 1:       			
				      		 default: return false;
			  			}
					});
					confirm.show();
}

function saveStatus(row_index)
{
	updateAppointmentLocal(appointment.id, 'status', status.text);

}

function saveAdditionalNotes(row_index)
{	
	updateAppointmentLocal(appointment.id, 'additional_notes', additional_notes.text);
	
	if(!sectionStatus.rows[row_index+1] && status.text === 'Completed') {
		table.insertRowAfter(row_index, rowNextActions);
	}
}

function saveStatusData(row_index)
{
	if(!beforeSaving()) return;
	
	if(!row_index) row_index = sectionStatus.rowCount-1;
	saveStatus(row_index);
	saveAdditionalNotes(row_index);
	
}

sectionStatus.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		saveStatusData(e.index);
		
		if(sectionStatus.rows[sectionStatus.rowCount-2].backgroundColor == 'blue') {
			sectionStatus.rows[sectionStatus.rowCount-2].children[0].text = 'Changes Saved';
			sectionStatus.rows[sectionStatus.rowCount-2].backgroundColor = '#CCC';
		}
		
		if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == 'blue') {
			sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved';
			sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = '#CCC';
		}
		
		var cloud_version = getAppointmentStatusDetailsLocal(appointment.id);
		if(cloud_version[0].cloud_id && Titanium.Network.online) { 
			Cloud.Objects.update({
				    classname: 'appointments',
				    id: cloud_version[0].cloud_id,
				    fields: cloud_version[0],
				}, function (e) {
				    if (e.success) {
						 		
				    } else {
				        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				    }
			});
		}
		
		return;
	}
});

status.addEventListener('click', function(e) {
	var data = [];
	data[0] = 'Scheduled';
	data[1] = 'Completed';
	data[2] = 'Cancelled';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,status.text); 

	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: sectionStatus.rows[0], });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			//The diagnosis section must only show if the appointment has been completed
			if(modalPicker.result === 'Completed' && status.text != 'Completed') {
				table.insertRowAfter(e.index, rowAdditionalNotes);
				var activities = getActivitiesForAppointmentLocal(appointment.id);
				var treatments = getTreatmentsForAppointmentLocal(appointment.id);
				if(appointment.activities.length > 0 || appointment.treatments.length > 0) {
					table.insertRowAfter(e.index+2, rowNextActions);
				}
			}
			if(modalPicker.result != 'Completed') {
				table.deleteRow(rowNextActions);
				table.deleteRow(rowAdditionalNotes);
			}
			if(modalPicker.result == 'Completed' || modalPicker.result == 'Cancelled') {
				blurSection(sectionDetails);
			}
			if(modalPicker.result == 'Scheduled') {
				unBlurSection(sectionDetails);
			} 
			status.text = modalPicker.result;
			sectionStatus.rows[0].backgroundColor = 'white';
			if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') { 
				sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
			}
			if(sectionStatus.rows[sectionStatus.rowCount-2].backgroundColor == '#CCC') { 
				sectionStatus.rows[sectionStatus.rowCount-2].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-2].children[0].text = 'Save Changes';
			}
		}
	};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

rowAdditionalNotes.addEventListener('click', function() {
	var additional_notes_page = require('ui/common/helpers/textarea');
	if(additional_notes.text === "No additional notes") {
		var additional_notes_text = '';
	}
	else {
		var additional_notes_text = additional_notes.text;
	}
	additional_notes_page = new additional_notes_page('Additional Notes', "Make any additional notes regarding the outcome of this appointment, such as any diagnosis that was given", 
									additional_notes_text);
									
	(getNavGroup()).open(additional_notes_page);
													
	additional_notes_page.addEventListener('close', function() {
		if(additional_notes.text !== additional_notes_page.result) { 
			if(!additional_notes_page.result) {
				additional_notes.text = "No additional notes";
			}
			else {
				additional_notes.text = additional_notes_page.result;
			}
			if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') {
				sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
			}
		}
	});	
});

rowNextActions.addEventListener('click', function() {
	if(sectionStatus.rows[sectionStatus.rowCount-2].backgroundColor == 'blue') {
		saveStatus(2);
		saveAdditionalNotes(2);
	}
	var actions_page = require('ui/common/views/actions');
		var actions = {
			appointment_id: appointment.id,
			entry_id: appointment.entry_id,
		}
		actions_page = new actions_page(actions, navGroup);
	
	(getNavGroup()).open(actions_page); //open the prescription window in the navgroup
	
	actions_page.addEventListener('close', function() { 
		appointment.activities = getActivitiesForAppointmentLocal(appointment.id);
		appointment.treatments = getTreatmentsForAppointmentLocal(appointment.id);
	});
});

function validateDateTime()
{
	if((new Date(dateTime.text) < new Date()) && status.text == 'Scheduled') { 
		alert('You may have entered a date that has already passed. Kindly recheck'); 
		return false;
	}
	if(appointment.duration.hours == 0 && appointment.duration.minutes < 5) {
		alert('You have not specified a duration. Kindly recheck');
		return false;
	}
	
	var all_appointments = getAllAppointmentsLocal();
	var current_start_time = new Date(dateTime.text);
	var current_end_time = new Date(dateTime.text);
	current_end_time.setHours(current_end_time.getHours() + appointment.duration.hours);
	current_end_time.setMinutes(current_end_time.getMinutes() + appointment.duration.minutes);
	
	for(x in all_appointments) {
		var start_time = new Date(all_appointments[x].date+' '+all_appointments[x].time);
		var end_time = new Date(all_appointments[x].date+' '+all_appointments[x].time);
		end_time.setHours(end_time.getHours() + all_appointments[x].duration.hours);
		end_time.setMinutes(end_time.getMinutes() + all_appointments[x].duration.minutes);
		
		if(appointment.id == all_appointments[x].id) continue;
		
		var start=true;
		var end=true;
		Ti.API.info('\n'+current_start_time.getTime()+'\n'+start_time.getTime()+'\n'+end_time.getTime());
		if(current_start_time > start_time && current_start_time < end_time) start=false;
		if(current_end_time > start_time && current_end_time < end_time) end=false;
		
		if(!start || !end) {  
			var record_id = getEntryLocal(all_appointments[x].entry_id)[0].record_id;
			var individual_id = getRecordLocal(record_id)[0].child_id;
			var individual = getChildLocal(individual_id)[0];
			alert("Your appointment clashes. "+individual.first_name+" "+individual.last_name+
					"has an appointment with Dr. "+all_appointments[x].doctor.name+" on "+
					all_appointments[x].date+" at "+all_appointments[x].time);
			return false;
		}
		
	}
	return true;
}

function saveDateTime()
{		
	updateAppointmentLocal(appointment.id, 'date', appointment.date);
	updateAppointmentLocal(appointment.id, 'time', appointment.time);
	updateAppointmentLocal(appointment.id, 'duration_hours', appointment.duration.hours);
	updateAppointmentLocal(appointment.id, 'duration_minutes', appointment.duration.minutes);
	updateAppointmentLocal(appointment.id, 'repeat', repeat.text);
	updateAppointmentLocal(appointment.id, 'alert', alert_text.text);
}
	
dateTime.addEventListener('click', function(e) {	
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}

modalPicker = require('ui/common/helpers/modalPicker');
modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,null,dateTime.text); 

if(Titanium.Platform.osname == 'iphone') modalPicker.open();
if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: dateTime });


var picker_closed = function() {
	if(modalPicker.result) { 
		var newDate = timeFormatted(modalPicker.result);
		appointment.date = newDate.date;
		appointment.time = newDate.time;
		dateTime.text = newDate.date+' '+newDate.time;
		activateSaveButton();
	}
};
	
	if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
	if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

duration.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}
	modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER,null,hoursMinutesToMilliseconds(appointment.duration.hours, appointment.duration.minutes)); 

	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: duration, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			var milliseconds = modalPicker.result
			appointment.duration.minutes = millisecondsToHoursMinutesSeconds(milliseconds).minutes;					
			appointment.duration.hours = millisecondsToHoursMinutesSeconds(milliseconds).hours;
			var string = (appointment.duration.hours > 0)?appointment.duration.hours+' hours ':'';
			string += (appointment.duration.minutes > 1)?appointment.duration.minutes+' minutes':'';
			if(string.length == 0) { string = 'No duration specified'; }
			duration.text = string;
			activateSaveButton();
		}
		};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

repeat.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	
	var data = [];
	data[0] = 'once only';
	data[1] = 'every day';
	data[2] = 'every week';
	data[3] = 'every month';
	data[4] = 'every year';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,repeat.text); 

	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: repeat, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			repeat.text = modalPicker.result;
			appointment.repeat = repeat.text;
			activateSaveButton();
		}
	};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

alert_text.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	
	var data = [];
	data[0] = '15 minutes before';
	data[1] = '30 minutes before';
	data[2] = '1 hour before';
	data[3] = '2 hours before';
	data[4] = '1 day before';
	data[5] = 'no alert';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,alert_text.text); 
	
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: alert_text, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			alert_text.text = modalPicker.result;
			appointment.alert = modalPicker.result;
			activateSaveButton();
		}
	};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

function validateSymptoms()
{
	if(appointment.symptoms.length < 1) {
		alert('You must list at least one symptom');
		return false;
	}
	return true;
}

function saveSymptoms()
{
	if(!validateSymptoms()) return;
	if(!beforeSaving()) return;	
		
	deleteSymptomsForAppointmentLocal(appointment.id);
	for(var i=0; i < appointment.symptoms.length; i++) {
		appointment.symptoms[i] = removeWhiteSpace(appointment.symptoms[i]);
		insertSymptomForAppointmentLocal(appointment.id, appointment.symptoms[i]);
	}
}

symptoms_title.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	
	var symptoms_page = require('ui/common/helpers/items');
	symptoms_page = new symptoms_page(appointment.symptoms, 'Symptoms');
	(getNavGroup()).open(symptoms_page);
	
	symptoms_page.addEventListener('close', function() {
		if(areArraysSame(appointment.symptoms, symptoms_page.result)) return; 
		
		appointment.symptoms = symptoms_page.result;
		if(appointment.symptoms.length == 0) symptoms_title.text = "No symptoms listed"; 
		else if(appointment.symptoms.length == 1) symptoms_title.text = appointment.symptoms.length+" symptom listed";
		else if(appointment.symptoms.length > 1) symptoms_title.text = appointment.symptoms.length+ " symptoms listed";
		activateSaveButton();
	});
});

var details_button = function() {
	activateSaveButton();
}


name.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

location.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

street.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

city.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

state.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

zip.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

country.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});


name.addEventListener('blur', details_button);
location.addEventListener('blur', details_button);
street.addEventListener('blur', details_button);
city.addEventListener('blur', details_button);
state.addEventListener('blur', details_button);
zip.addEventListener('blur', details_button);
country.addEventListener('blur', details_button);

function validateDoctorDetails()
{
	var onlyLetters = containsOnlyLetters(name.value);
	if(name.value.length > 1 && onlyLetters) { return true; }
		else { 
			if(name.value.length < 1) {
				alert("You have not entered a doctor's name. Kindly recheck")
			}
			else if(!onlyLetters) { 
				alert('Doctors name must be longer than one character and contain only letters');
			} 
			return false; 
		}
	return true;
}

function saveDoctorDetails()
{
	if(0 == updateDoctorForAppointmentLocal(appointment.id,name.value,location.value.replace("'",""),street.value,city.value,state.value,zip.value,country.value)) { 
		insertDoctorForAppointmentLocal(appointment.id,name.value,location.value.replace("'",""),street.value,city.value,state.value,zip.value,country.value); 
	}
}

function saveDetails() 
{	
	saveDateTime();
	saveSymptoms();
	saveDoctorDetails();
	
	appointment.doctor.name = name.value;
	appointment.doctor.location = location.value.replace("'","");
	appointment.doctor.street = street.value;
	appointment.doctor.city = city.value;
	appointment.doctor.state = state.value;
	appointment.doctor.zip = zip.value;
	appointment.doctor.country = country.value;
	appointment.status = status.text;
	
	scheduleNotification('appointment', appointment.id);
	deactivateSaveButton();
}

sectionDetails.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		if(!validateDoctorDetails() || !validateDateTime() || !validateSymptoms()) return;
		if(!beforeSaving()) return;		
		saveDetails();
		
		var cloud_version = getAppointmentMainDetailsLocal(appointment.id);
		if(cloud_version[0].cloud_id && Titanium.Network.online) { 
			Cloud.Objects.update({
				    classname: 'appointments',
				    id: cloud_version[0].cloud_id,
				    fields: cloud_version[0],
				}, function (e) {
				    if (e.success) {
						 		
				    } else {
				        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				    }
			});
		}
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
			
			if(sectionMetaData.rowCount > 1) return;
			var row = Ti.UI.createTableViewRow({ height: 100, hasChild: true });
			row.add(entry_dateTime);
			row.add(entry);
			table.insertRowAfter(0, row, { animated: true });
		}
	});
});

entry.addEventListener('click', function(e) {
	if(e.row.backgroundColor == '#D4CFCF') {
		alert('Sorry, this cannot be changed');
		return;
	}
	var select_entry_page = require('ui/common/helpers/search_entries');
	var indiv_name = individual.text.split(': ')[1];
	var indiv_first_name = indiv_name.split(' ')[0];
	var indiv_last_name = indiv_name.split(' ')[1];
	var new_individual = getChildByNameLocal(indiv_first_name, indiv_last_name)[0];
	var the_records = [];
	var the_entries = [];
	if(new_individual) the_records = getRecordsForChildLocal(new_individual.id);
	for(x in the_records) the_entries.push(getEntryBy('record_id', the_records[x].id)[0]);
	select_entry_page = new select_entry_page(navGroup, the_entries, _entry, 'Select/Create Entry');
	(getNavGroup()).open(select_entry_page);
	
	var entry_page_closed = function() { 
		if(select_entry_page.result.main_entry) {
			entry_dateTime.text = 'On '+select_entry_page.result.date+' at '+select_entry_page.result.time;
			entry.text = select_entry_page.result.main_entry;
			_entry = select_entry_page.result;
		}
	};
	
	select_entry_page.addEventListener('close', entry_page_closed);
});

if(navGroupWindow) return navGroupWindow;
else return window;


}

module.exports = appointment;
