



function activity(input, navGroup)
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/strings.js');
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/calendar/notifications.js');
	

//var navGroupWindow = input.navGroupWindow;

var activity = {
		id: input.id?input.id:null,
		cloud_id: input.cloud_id?input.cloud_id:null,
		entry_id: input.entry_id?input.entry_id:null,
		appointment_id: input.appointment_id?input.appointment_id:null,		
		recommended_by: input.recommended_by?input.recommended_by:null,
		main_activity: input.main_activity?input.main_activity:'No activity',
		start_date: input.start_date?input.start_date:timeFormatted(new Date()).date,
		end_date: input.end_date?input.end_date:timeFormatted(new Date()).date,
		frequency: input.frequency?input.frequency:0,
		interval: input.interval?input.interval:'every day',
		alert: input.alert?input.alert:'Time of event',
		times: input.times?input.times:[],
		calendar_event_ids: input.calendar_event_ids?input.calendar_event_ids:[],
		localNotifications: input.local_notifications?input.local_notifications:0,
		location: input.location?input.location:null,
		goals: input.goals?input.goals:[],
		additional_notes: input.additional_notes?input.additional_notes:'No observations',
		status: input.status?input.status:'Scheduled',
		successful: input.successful?input.successful:'Yes/No?',
		facebook_id: input.facebook_id?input.facebook_id:null,
	}
	
	if(Titanium.App.Properties.getString('child')) {
		var _individual = getChildLocal(Titanium.App.Properties.getString('child'))[0].first_name+
						' '+getChildLocal(Titanium.App.Properties.getString('child'))[0].last_name;
	}
	else if(activity.entry_id) {
		var record_id = getEntryLocal(activity.entry_id)[0].record_id;
		var child_id = getRecordLocal(record_id)[0].child_id;
		var _individual = getChildLocal(child_id)[0].first_name+
						' '+getChildLocal(child_id)[0].last_name;
	}
	else {
		var _individual=null;
	}
	
	var _entry={
		id: activity.entry_id,
		date: activity.entry_id?getEntryLocal(activity.entry_id)[0].date:timeFormatted(new Date()).date,
		time: activity.entry_id?getEntryLocal(activity.entry_id)[0].time:timeFormatted(new Date()).time,
		main_entry: activity.entry_id?getEntryLocal(activity.entry_id)[0].main_entry:undefined,
	}; //This is for the meta data section, it shows the related entry if it hasnt been saved yet
	
	var share_background_color = activity.facebook_id?'#CCC':
								(!activity.successful)?'#CCC':(!Titanium.Network.online)?'#CCC':(!Titanium.Facebook.loggedIn)?'#CCC':'blue';

var window = Titanium.UI.createWindow({
  backgroundColor:'white',
  height: 'auto'
});
var modalPicker=null;
window.addEventListener('blur', function() {
	//If there is a modalPicker open, close it
	if(modalPicker) modalPicker.close();
});

var the_view = Ti.UI.createView({ width: '60%', });
	var the_name = Ti.UI.createLabel({ text: 'Activity', font: { fontWeight: 'bold', fontSize: '22', }, color: 'white', });
	var the_instruction = Ti.UI.createLabel({ text: 'Tap to view help', font: { fontSize: 10}, bottom: 0, });
	the_view.add(the_name);
	the_view.add(the_instruction);
	the_view.addEventListener('click', function() {
		var helpSection = require('ui/common/help_section/aboutActivities/indexActivities');
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
	if(navGroupWindow) return (navGroupWindow.getChildren())[0];
	else return navGroup; 
}

if(activity.id) { var cancel_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.TRASH }); }
else { var cancel_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.CANCEL }); }
window.leftNavButton = cancel_btn;

if(activity.id) { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.DONE }); }
else { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.SAVE }); }
window.rightNavButton = save_btn;

cancel_btn.addEventListener('click', function() {
	if(activity.id == null) {
		if(navGroupWindow) navGroupWindow.close();
		else navGroup.close(window);
		return;
	}
	
	var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to delete this activity?', 
								message: 'This cannot be undone', 
								buttonNames: ['Yes','No'], cancel: 1 });
								
	confirm.addEventListener('click', function(g) { 
   			//Clicked cancel, first check is for iphone, second for android
   			if (g.cancel === g.index || g.cancel === true) { return; }


  			 switch (g.index) {
     		 case 0:   		 	
     		  	activity.cloud_id = activity.cloud_id?activity.cloud_id:getActivityLocal(activity.id)[0].cloud_id;
				deleteActivityLocal(activity.id);			
				deleteObjectACS('activities', activity.cloud_id);
				var defCalendar = Ti.Calendar.defaultCalendar;
				for(x in activity.calendar_event_ids) {
					if(!activity.calendar_event_ids[x]) continue; 
					var event = defCalendar.getEventById(activity.calendar_event_ids[x]);
					if(event) event.remove(Titanium.Calendar.SPAN_FUTUREEVENTS);
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
		
		if(activity.id != null) {
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
					if(navGroupWindow) navGroupWindow.close();
      				else navGroup.close(window); 
					return;
				} 
		}
		else {  
			if(!validateDetails() || !validateActivity() || !validateGoals()) return;
			if(!beforeSaving()) return;
			saveStatusData();
			saveGoals();
			saveMainActivity();
			saveLocation();
			saveDetails();
	
			if(navGroupWindow) {
				navGroupWindow.result = activity;
				navGroupWindow.close();
			}
      		else {
      			window.result = activity;
      			navGroup.close(window);
      		}
		}
	
});

var table = Ti.UI.createTableView({
		showVerticalScrollIndicator: false,
		rowHeight: 45,
	});
	
	var sectionStatus = Ti.UI.createTableViewSection({ headerTitle: 'Status (tap to change)', });
	sectionStatus.add(Ti.UI.createTableViewRow({ height: 60, }));	
	var status_title = Titanium.UI.createLabel({ text: 'Status', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var status = Ti.UI.createLabel({ left: '40%', width: 150, text: activity.status, font: { fontWeight: 'bold', fontSize: 20, }, });
	sectionStatus.rows[0].add(status_title);
	sectionStatus.rows[0].add(status);
	
	var rowAdditionalNotes = Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 90, hasChild: true, });
	var additional_notes = Ti.UI.createLabel({ left: 15, width: '90%', text: activity.additional_notes, font: { fontSize: 15, }, height: '100%', width: '100%', });
	rowAdditionalNotes.add(additional_notes);
	if(activity.status === 'Completed') {
		sectionStatus.add(rowAdditionalNotes);
	}
	
	if(activity.id) {
		sectionStatus.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', })); 
		sectionStatus.rows[sectionStatus.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));
	}
	
/*	var sectionPatient = Ti.UI.createTableViewSection({ headerTitle: 'Patient (required)', });
	sectionPatient.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	sectionPatient.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	sectionPatient.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	sectionPatient.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	sectionPatient.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	var patient_title = Titanium.UI.createLabel({ text: '*Individual', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var child = getChildLocal(Titanium.App.Properties.getString('child'));
	child = child[0];
	var patient = Titanium.UI.createTextField({ hintText: 'Patient full name', bubbleParent: false, value: child.first_name+' '+child.last_name, width: '55%', left: '45%' });
	var recommended_by_description = Titanium.UI.createLabel({ text: 'If this activity was recommended by a doctor, enter their name here. Else leave blank', left: 15, font: { fontSize: 15, }, });
	var recommended_by_title = Titanium.UI.createLabel({ text: 'Doctor', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var recommended_by = Titanium.UI.createTextField({ hintText: "Doctor's name here", value: activity.recommended_by, width: '55%', left: '45%', bubbleParent: false, });
	var diagnosis_description = Titanium.UI.createLabel({ text: 'If this activity is related to a know diagnosis, please mention it here', left: 15, font: { fontSize: 15, }, });
	var diagnosis_title = Titanium.UI.createLabel({ text: 'Diagnosis', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var diagnosis = Titanium.UI.createTextField({ hintText: "Enter diagnosis here", value: activity.diagnosis, width: '55%', left: '45%', bubbleParent: false, });
	sectionPatient.rows[0].add(patient_title);
	sectionPatient.rows[0].add(patient);
	sectionPatient.rows[1].add(recommended_by_description);
	sectionPatient.rows[2].add(recommended_by_title);
	sectionPatient.rows[2].add(recommended_by);
	sectionPatient.rows[3].add(diagnosis_description);
	sectionPatient.rows[4].add(diagnosis_title);
	sectionPatient.rows[4].add(diagnosis);  */
	
	var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Activity Details(* = required)' });
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 90, hasChild: true, }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
	
	if(activity.goals.length == 0) var goals_message = "No goals listed";
	else if(activity.goals.length == 1) var goals_message = activity.goals.length+" goals listed";
	else var goals_message = activity.goals.length+" goals listed";
	
	var goals_title = Titanium.UI.createLabel({ text: goals_message, left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, });
	var main_activity = Ti.UI.createLabel({ left: 15, width: '90%', text: activity.main_activity, font: { fontSize: 15, }, height: '100%', width: '100%', });
	var location_description = Titanium.UI.createLabel({ text: "If this activity needs to happen at a particular location, please mention it here", left: 15, font: { fontSize: 15, }, });
	var location_title = Titanium.UI.createLabel({ text: 'Location', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var location = Titanium.UI.createTextField({ hintText: 'eg: home', value: activity.location, width: '55%', left: '45%' });
	var startDate_title = Titanium.UI.createLabel({ text: '*Start date', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var start_date = Titanium.UI.createLabel({ text: activity.start_date, width: '55%', left: '45%', });
	var endDate_title = Titanium.UI.createLabel({ text: '*End date', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var end_date = Titanium.UI.createLabel({ text: activity.end_date, width: '55%', left: '45%', });
	var frequency_title = Titanium.UI.createLabel({ text: '*How Many Times?', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var frequency = Titanium.UI.createLabel({ text: activity.frequency, left: '60%', width: '40%', }); //keyboard type 4 = number pad
	var interval_title = Titanium.UI.createLabel({ text: '*Interval', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var interval = Ti.UI.createLabel({ text: activity.interval, left: '60%', width: '40%', bubbleParent: false, });
	var alert_description = Titanium.UI.createLabel({ text: "You can choose how long before every scheduled activity you would "+
														"like to be alerted. For example: if you have to ensure the activity is completed "+
														"twice a day, and you choose to be alerted 15 minutes before, we will "+
														"notify you 15 minutes before the two times that you choose below.", left: 15, font: { fontSize: 15, }, });
	var alert_title = Titanium.UI.createLabel({ text: '*Alert at', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var alert_text = Ti.UI.createLabel({ text: activity.alert, left: '60%', width: '40%', bubbleParent: false, });
	var alertsPage_title = Titanium.UI.createLabel({ text: '('+activity.times.length+') Times for alerts', left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, });
	if(frequency.text == 0) alertsPage_title.color = '#CCC';
	else alertsPage_title.color = 'black';
	sectionDetails.rows[0].add(goals_title);
	sectionDetails.rows[1].add(main_activity);
	sectionDetails.rows[2].add(location_description);
	sectionDetails.rows[3].add(location_title);
	sectionDetails.rows[3].add(location);
	sectionDetails.rows[4].add(startDate_title);
	sectionDetails.rows[4].add(start_date);
	sectionDetails.rows[5].add(endDate_title);
	sectionDetails.rows[5].add(end_date);
	sectionDetails.rows[6].add(frequency_title);
	sectionDetails.rows[6].add(frequency);
	sectionDetails.rows[7].add(interval_title);
	sectionDetails.rows[7].add(interval);
	sectionDetails.rows[8].add(alert_description);
	sectionDetails.rows[9].add(alert_title);
	sectionDetails.rows[9].add(alert_text);
	sectionDetails.rows[10].add(alertsPage_title);
	if(activity.id) { 
		sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
		sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));
	}
	

	var sectionShare = Ti.UI.createTableViewSection();
	sectionShare.add(Ti.UI.createTableViewRow({ backgroundColor: share_background_color, }));
	sectionShare.rows[0].add(Ti.UI.createLabel({ text: 'Share Activity on Facebook', color: 'white', font: { fontWeight: 'bold', }, }));
	
	sectionShare.addEventListener('click', function() {
		if(!Titanium.Network.online) {
			alert('Sorry, an internet connection is required to share on Facebook');
			return;
		}
		if(!Titanium.Facebook.loggedIn) {
			alert('Sorry, it seems like you are not logged into Facebook');
			return;
		}
		if(activity.facebook_id) {
			alert('This activity has already been shared on facebook');
			return;
		}
		var child = getChildLocal(Titanium.App.Properties.getString('child'));
		child = child[0];
		
		var share_goals = goals_field.value.split(',');
		
		if(activity.appointment_id) {
			var doctor_name = getDoctorByAppointmentLocal(activity.appointment_id)[0].name;
			var description = child.first_name+" successfully completed an activity and achieved the " + share_goals.length + 
							  " goals as set by Dr. "+doctor_name;
		}
		else {
			var description = child.first_name+" successfully completed an activity and achieved the " + share_goals.length + 
							  " goals as set by me";
		}
		
		var data = {
   			link : "http://www.starsearth.com",
		    name : "Activity successfully completed",
		    message : "By: "+child.first_name+" "+child.last_name,
		    caption : "By: "+child.first_name+" "+child.last_name,
		    picture : "http://pcfrivesdedordogne.pcf.fr/sites/default/files/imagecache/image/arton1.png",
		    description : description,
		}
		
		Titanium.Facebook.dialog("feed", data, function(e) {
		    if(e.success && e.result) {
		    	sectionShare.rows[0].backgroundColor = '#CCC';
		    	activity.facebook_id = e.result.split('=')[1];
		    	updateActivityFacebookId(activity.id, '"'+activity.facebook_id+'"');
		        //alert("Success! New Post ID: " + e.result); starts with post_id=
		    } else {
		        if(e.error) {
		            alert(e.error);
		        } else {
		            alert("Dialog closed");
		        }
		    }
		});
	});
	
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
	if(activity.status === 'Completed' || activity.status === 'Cancelled') {
		blurSection(sectionDetails);
	}
	
	if(activity.id) {
		if(!isValidDate(activity.end_date) && status.text === 'Scheduled') {
			status.text = "End date passed";
			sectionStatus.rows[0].backgroundColor = "red";
			blurSection(sectionDetails);
		}
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
	
	if(!activity.id) {
		activity.start_date = start_date.text;
		activity.end_date = end_date.text;
		activity.main_activity = main_activity.text;
		activity.frequency = frequency.text;
		activity.interval = interval.text;
		activity.alert = alert_text.text;
		activity.location = location.value;
		activity.additional_notes = additional_notes.text;
	}
	
	if(activity.entry_id == null) {
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
					Ti.App.fireEvent('individualEdited'); //Update the main menu
			}			
			if(!activity.entry_id) {
				if(!_entry.id) {
					if(_child.length > 0) var record_id = insertRecordLocal(_child[0].id);
					else if(row_id) var record_id = insertRecordLocal(row_id);
					activity.entry_id = _entry.id = insertEntryLocal(record_id, _entry.main_entry, _entry.date, _entry.time);
				}
				else {
					activity.entry_id = _entry.id;
				}
			}	
		}
	}
	
	if(!activity.id) {
		activity.id = insertActivityLocal(activity.entry_id, activity.appointment_id, main_activity.text, 
												start_date.text, end_date.text, frequency.text, interval.text, alert_text.text);
		createActivityACS(activity, _entry);										
	}
	updateRecordTimesForEntryLocal(activity.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);	
	updateActivityLocal(activity.id, 'updated_at', timeFormatted(new Date()).date+' '+timeFormatted(new Date()).time);	
	
	activity.entry_id = _entry.id;
	var get_record_id = getEntryLocal(activity.entry_id)[0].record_id; 
	
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

function addRemoveTimes(how_many) 
{
	if(how_many > 0) {
		for(var i=0; i < how_many; i++) {
			var theTime = roundMinutes(new Date());
			theTime = timeFormatted(theTime);
			activity.times.push(theTime.time);
		}
	}
	else {
		for(var i=0; i < how_many*(-1); i++) {
			activity.times.pop();
		}
	}
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
							message: 'You must declare this activity as scheduled in order to edit this field.'+
										' Would you like to change the status to scheduled?', 
							buttonNames: ['Yes','No'], cancel: 1 });
										
					confirm.addEventListener('click', function(g) { 
				  			//Clicked cancel, first check is for iphone, second for android
				   		if (g.cancel === g.index || g.cancel === true) { return; }
							
							
				  		 switch (g.index) {
				     		 case 0:
				     		 	if(status.text === 'Completed') {
				     		 		table.deleteRow(rowAdditionalNotes);
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


function validateGoals()
{
	if(activity.goals.length < 1) {
		alert('You must list at least one goal');
		return false;
	}
	
	return true;
}

function validateActivity()
{
	if(main_activity.text === "No activity") {
		alert('You have not entered a description of the activity. Please recheck');
		return false;
	}
	
	return true;
}


function validateDetails()
{
	if(!isValidDate(start_date.text)) { 
		alert('Your start date seems to be invalid. Please pick a date in the present or future.');
		return false; 
	}
	if(!isValidDate(end_date.text)) { 
		alert('Your end date seems to be invalid. Please pick a date in the present or future');
		return false;
	}
	
	if(!isStartBeforeEnd(start_date.text,end_date.text)) { 
		alert('Your end date seems to be before your start date. Please correct'); 
		return false;
	}
	
	if(frequency.text == 0) {
		alert('How many times will the medication be given? Must be greater than 0.');
		return false;
	}
	
	if(frequency.text != activity.times.length) {
		alert("You have mentioned that you will be conducting this activity "+frequency.text+
				" times a day but you have mentioned "+activity.times.length+" times to be notified. Kindly recheck.");
		return false;
	}
	
	return true;
}

function saveStatus(row_index)
{
	updateActivityLocal(activity.id, 'status', status.text);
	activity.status = status.text;
	
	return true;
}

//row_index unused for now
function saveAdditionalNotes(row_index)
{	
	updateActivityLocal(activity.id, 'additional_notes', additional_notes.text);
	activity.additional_notes = additional_notes.text;
	
	return true;
}

function saveStatusData(row_index)
{
	if(!beforeSaving()) return;
	saveStatus(row_index);
	saveAdditionalNotes(row_index);
	
	if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == 'blue') {
		sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = '#CCC';
		sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved!';
	}

}

function saveGoals()
{		
	deleteGoalsForActivityLocal(activity.id);
		
	for(var i=0; i < activity.goals.length; i++) {
		activity.goals[i] = removeWhiteSpace(activity.goals[i]);
		insertGoalForActivityLocal(activity.id, activity.goals[i]);
	}
	
	return true;
}

function saveMainActivity()
{
	updateActivityLocal(activity.id, 'main_activity', main_activity.text);
	activity.main_activity = main_activity.text;
	return true;
}

function saveLocation()
{
	updateActivityLocal(activity.id, 'location', location.value);
	activity.location = location.value;
	return true;
}

function saveDetails()
{	
	activity.start_date = start_date.text;
	activity.end_date = end_date.text;	
	activity.frequency = frequency.text;
	activity.interval = interval.text;
	activity.alert = alert_text.text;
	
	updateActivityLocal(activity.id, 'start_date', start_date.text);
	updateActivityLocal(activity.id, 'end_date', end_date.text);
	updateActivityLocal(activity.id, 'frequency', frequency.text);
	updateActivityLocal(activity.id, 'interval', interval.text);
	updateActivityLocal(activity.id, 'alert', alert_text.text);
	
	//scheduleActivityLocalNotifications(activity);	
	deleteTimesForActivityLocal(activity.id);
	for(var i=0; i < activity.times.length; i++) {
		insertTimeForActivityLocal(activity.id, activity.times[i]);
	}
	
	scheduleNotification('activity', activity);
}
	
	
//Functions that works with the modal picker to change the date
//input: date: the object that we need to work with(label object)
function changeDate(date)
{
modalPicker = require('ui/common/helpers/modalPicker');
modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE,null,date.text); 

if(Titanium.Platform.osname == 'iphone') modalPicker.open(); 
if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: date, });

 
var picker_closed = function() {
	if(modalPicker.result) { 
		var newDate = modalPicker.result.toDateString();
		date.text = newDate;
		activateSaveButton();
	}
};
	
if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);

}

sectionStatus.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		saveStatusData(e.index);
		var cloud_version = getActivityStatusDetailsLocal(activity.id);
		if(cloud_version[0].cloud_id && Titanium.Network.online) { 
			Cloud.Objects.update({
				    classname: 'activities',
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
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: status, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			//The diagnosis section must only show if the appointment has been completed
			if(modalPicker.result == 'Completed' && status.text != 'Completed') {
				table.insertRowAfter(e.index, rowAdditionalNotes);
			}
			if(modalPicker.result != 'Complete' && status.text == 'Completed') {
				table.deleteRow(rowAdditionalNotes);
			}
			if(modalPicker.result == 'Completed' || modalPicker.result == 'Cancelled') {
				blurSection(sectionDetails);
			}
			if(modalPicker.result == 'Scheduled') {
				unBlurSection(sectionDetails);
			}
			if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') {
				sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
			}
			sectionStatus.rows[0].backgroundColor = 'white'; 
			status.text = modalPicker.result;
		}
	};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

rowAdditionalNotes.addEventListener('click', function() {	
	var additional_notes_page = require('ui/common/helpers/textarea');
	if(additional_notes.text === "No observations") {
		var additional_notes_text = '';
	}
	else {
		var additional_notes_text = additional_notes.text;
	}
	additional_notes_page = new additional_notes_page('Observations', "Make any notes regarding the outcome of this activity", additional_notes_text);
	(getNavGroup()).open(additional_notes_page);
													
	additional_notes_page.addEventListener('close', function() {
		if(additional_notes_page.result === additional_notes.text) return;
		if(!additional_notes_page.result) {
			additional_notes.text = "No observations";
		}
		else {
			additional_notes.text = additional_notes_page.result;
		}
	});
	
	if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') {
		sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
		sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
	}
});


goals_title.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	var goals_page = require('ui/common/helpers/items');
	goals_page = new goals_page(activity.goals, 'Goals');
	(getNavGroup()).open(goals_page);
	
	goals_page.addEventListener('close', function() {
		if(areArraysSame(activity.goals, goals_page.result)) return; 
		activity.goals = goals_page.result;
		if(activity.goals.length == 0) goals_title.text = "No goals listed"; 
		else if(activity.goals.length == 1) goals_title.text = activity.goals.length+" goal listed";
		else if(activity.goals.length > 1) goals_title.text = activity.goals.length+ " goals listed";
		activateSaveButton();
	});
});

main_activity.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	var activity_page = require('ui/common/helpers/textarea');
	if(main_activity.text === "No activity") {
		var main_activity_text = '';
	}
	else {
		var main_activity_text = main_activity.text;
	}
	activity_page = new activity_page('Main Activity', "Describe the main activity", main_activity_text);
	(getNavGroup()).open(activity_page);
													
	activity_page.addEventListener('close', function() {
		if(activity_page.result === main_activity.text) return;
		if(!activity_page.result) {
			main_activity.text = "No activity";
		}
		else {
			main_activity.text = activity_page.result;
		}
		activateSaveButton();
	});
		
});

location.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) location.blur();
	}
});

location.addEventListener('blur', function() {
	if(location.value.length > 0) {
		activateSaveButton();
	}
});

start_date.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) return;
	}	
	changeDate(start_date);
	activity.start_date = start_date.text;
});

end_date.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) return;
	}	
	changeDate(end_date);
	activity.end_date = end_date.text;
});	

frequency.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	var data = '123456789';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,frequency.text); 

	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: frequency, });

 
	var picker_closed = function() {
		if(modalPicker.result) { 
			if(modalPicker.result != frequency.text) {
				activateSaveButton();
				if(modalPicker.result == 0 || alert_text.text == 'Never') {
					alertsPage_title.color = '#CCC';
				}
				else {
					alertsPage_title.color = 'black';
					addRemoveTimes(modalPicker.result - frequency.text);
				}
				alertsPage_title.text = '('+modalPicker.result+') Times for alerts';
				
			}
			frequency.text = modalPicker.result;
			activateSaveButton();
		}
	};
		
	if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
	if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
		
});

interval.addEventListener('click', function(e) {
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
	modalPicker = new modalPicker(null,data,interval.text); 

	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: interval, });


	var picker_closed = function() {
		if(modalPicker.result) {
			if(modalPicker.result != interval.text) {
				activateSaveButton();
			} 
			interval.text = modalPicker.result;
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
	data[0] = 'Time of event';
	data[1] = '5 minutes before';
	data[2] = '10 minutes before';
	data[3] = '15 minutes before';
	data[4] = '30 minutes before';
	data[5] = '1 hour before';
	data[6] = 'Never';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,alert_text.text); 

	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: alert_text, });


	var picker_closed = function() {
		if(modalPicker.result) {
			if(modalPicker.result != alert_text.text) {
				activateSaveButton();	
			}
			if(modalPicker.result == 'Never' || frequency.text == 0) {
				alertsPage_title.color = '#CCC';
			}
			else {
				alertsPage_title.color = 'black';
				addRemoveTimes(frequency.text - activity.times.length);
			}
			alert_text.text = modalPicker.result;
			activateSaveButton();
		}
	};
		
	if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
	if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

alertsPage_title.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	if(this.color == '#CCC') {
		alert("You have to set 'How many times' to 1 or more and Alert must not be 'Never' in order for you to set times");
		return;
	}
	
	var alerts_page = require('ui/common/helpers/alerts');
	alerts_page = new alerts_page(activity.times, alert_text.text);
	(getNavGroup()).open(alerts_page);
	
	alerts_page.addEventListener('close', function() {
		if(areArraysSame(activity.times, alerts_page.result)) return; 
		activity.times = alerts_page.result;
		frequency.text = activity.times.length;
		alertsPage_title.text = '('+activity.times.length+') Times for alerts';
		if(activity.times.length == 0) {
			alertsPage_title.color = '#CCC';
		}
		activateSaveButton();
	});  
});

sectionDetails.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		if(!validateDetails() || !validateActivity() || !validateGoals()) return;
			if(!beforeSaving()) return;
			saveGoals();
			saveMainActivity();
			saveLocation();
			saveDetails();
			
			var cloud_version = getActivityMainDetailsLocal(activity.id);
			if(cloud_version[0].cloud_id && Titanium.Network.online) { 
				Cloud.Objects.update({
					    classname: 'activities',
					    id: cloud_version[0].cloud_id,
					    fields: cloud_version[0],
					}, function (e) {
					    if (e.success) {
					 		
					    } else {
					        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
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
	
	select_entry_page.addEventListener('close', function() { 
		if(select_entry_page.result.main_entry) {
			entry_dateTime.text = 'On '+select_entry_page.result.date+' at '+select_entry_page.result.time;
			entry.text = select_entry_page.result.main_entry;
			_entry = select_entry_page.result;
		}
	});
});

if(navGroupWindow) return navGroupWindow; 
else return window;

}

module.exports = activity;
