



function activity(input)
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/strings.js');
	Ti.include('ui/common/database/database.js');

//var navGroupWindow = input.navGroupWindow;

var activity = {
		id: input.activity.id?input.activity.id:null,
		cloud_id: input.activity.cloud_id?input.activity.cloud_id:null,
		entry_id: input.activity.entry_id?input.activity.entry_id:null,
		appointment_id: input.activity.appointment_id?input.activity.appointment_id:null,		
		recommended_by: input.activity.recommended_by?input.activity.recommended_by:null,
		main_activity: input.activity.main_activity?input.activity.main_activity:'No activity',
		start_date: input.activity.start_date?input.activity.start_date:timeFormatted(new Date).date,
		end_date: input.activity.end_date?input.activity.end_date:timeFormatted(new Date).date,
		frequency: input.activity.frequency?input.activity.frequency:0,
		interval: input.activity.interval?input.activity.interval:'every day',
		alert: input.activity.alert?input.activity.alert:'Time of event',
		times: input.activity.times?input.activity.times:[],
		localNotifications: input.activity.local_notifications?input.activity.local_notifications:0,
		location: input.activity.location?input.activity.location:null,
		goals: input.activity.goals?input.activity.goals:[],
		end_notes: input.activity.end_notes?input.activity.end_notes:'No observations',
		status: input.activity.status?input.activity.status:'Scheduled',
		successful: input.activity.successful?input.activity.successful:'Yes/No?',
		facebook_id: input.activity.facebook_id?input.activity.facebook_id:null,
	}
	
	var share_background_color = activity.facebook_id?'#CCC':
								(!activity.successful)?'#CCC':(!Titanium.Network.online)?'#CCC':(!Titanium.Facebook.loggedIn)?'#CCC':'blue';

var window = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'Activity',
  height: 'auto'
});
window.result = null;

var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
	navGroupWindow = new navGroupWindow(window);
	navGroupWindow.result = null;

if(activity.id) { var cancel_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.TRASH }); }
else { var cancel_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.CANCEL }); }
window.leftNavButton = cancel_btn;

if(activity.id) { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.DONE }); }
else { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.SAVE }); }
window.rightNavButton = save_btn;

cancel_btn.addEventListener('click', function() {
	//navGroupWindow.getChildren()[0].close(window);
	if(activity.id == null) {
		navGroupWindow.close();
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
     		 	Ti.App.fireEvent('eventSaved'); //This is to delete all related local notifications
     		 	
     		  	activity.cloud_id = activity.cloud_id?activity.cloud_id:getActivityLocal(activity.id)[0].cloud_id;
				deleteActivityLocal(activity.id);			
				deleteObjectACS('activities', activity.cloud_id);
				navGroupWindow.result = -1;
      			navGroupWindow.close();
      			break;

      		 case 1:       			
      		 default: break;
  			}
		});
		confirm.show();
});

save_btn.addEventListener('click', function() {
/*	if(table.scrollable == false) { return; }

	var activity_test = false, frequency_test = false, date_test = false, goals_test=false;
	
	if(activity_field.value == null || activity_field.value == '') {
		alert('You do not seem to have entered anything for activity. Please re-check');
	}
	else { activity_test=true; }
	if(frequency.text != 'Tap to change') { frequency_test=true; }
	else { alert('Place enter the frequency of the activity'); }
	if(!isValidDate(start_date.text)) { alert('Your start date seems to be invalid. Please recheck'); }
	else if(!isValidDate(end_date.text)) { alert('Your end date seems to be invalid. Please recheck'); }
	else if(!isStartBeforeEnd(start_date.text,end_date.text)) 
	{ alert('Your end date seems to be before your start date. Please correct'); }
	else { date_test = true; }
	if(goals_field.value == null || goals_field.value == '') {
		alert('You must list at least one goal');
	}
	else { goals_test=true; }
	
	if(activity_test && frequency_test && date_test && goals_test)
	{
		if(activity.id == null) {
			if(!Titanium.Network.online) {
				alert('Error:\n You are not connected to the internet. Cannot create new activity');
				return;
			}
			
			if(activity.appointment_id != null) {
				var appointment_id = '"'+activity.appointment_id+'"';
				activity.id = insertActivityLocal(null,appointment_id, activity_field.value, start_date.text, end_date.text, location.value, frequency.text);
			}
			else { 
				var entry_id = '"'+activity.entry_id+'"';
				activity.id = insertActivityLocal(entry_id,null,activity_field.value, start_date.text, end_date.text, location.value, frequency.text);
			}
			
			createObjectACS('activities', { id: activity.id, activity_field: activity_field.value, start_date: start_date.text,
											end_date: end_date.text, location: location.value, frequency: frequency.text, end_notes: endNotes_field.value });
		}
		else {
				updateActivityLocal(activity.id,start_date.text,end_date.text,activity_field.value,location.value,frequency.text);
		}
		deleteGoalsForActivityLocal(activity.id);
		activity.goals.splice(0, activity.goals.length);
		if(goals_field.value != null) {
			if(goals_field.value.length > 1) {
				var final_goals = goals_field.value.split(',');
				for(var i=0;i < final_goals.length; i++) {
					if(final_goals[i].length < 2) continue;

					insertGoalForActivityLocal(activity.id,final_goals[i]);
					activity.goals.push(final_goals[i]);
				}
			}
		}
		
		updateActivitySuccessStatus(activity.id,successful_switcher.value);
		if(endNotes_field.value != null || endNotes_field.value.length > 1) updateActivityEndNotes(activity.id,endNotes_field.value); */
		
		
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
					      			navGroupWindow.close();
					      			return;
					
					      		 case 1:       			
					      		 default: return;
					  			}
							});
							confirm.show();
							
					}
				}
				if(all_saved) { 
					navGroupWindow.close(); 
					return;
				} 
		}
		else {  
			if(!validateDetails() || !validateActivity() || !validateGoals()) return;
			if(!beforeSaving()) return;
			saveStatus();
			saveEndNotes();
			saveGoals();
			saveMainActivity();
			saveDetails();
	
		
			activity.start_date = start_date.text;
			activity.end_date = end_date.text;
			activity.main_activity = main_activity.text;
			activity.frequency = frequency.text;
			activity.interval = interval.text;
			activity.alert = alert_text.text;
			activity.location = location.value;
			activity.end_notes = end_notes.text;
			//window.result = activity;
			navGroupWindow.result = activity;
			//navGroupWindow.getChildren()[0].close(window);
			navGroupWindow.close();
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
	if(activity.id) {
		sectionStatus.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', })); 
		sectionStatus.rows[sectionStatus.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));
	}
	
	var sectionEndNotes = Ti.UI.createTableViewSection({ headerTitle: 'Observations?' });
	sectionEndNotes.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 90, hasChild: true, }));	
	var end_notes = Ti.UI.createLabel({ left: 15, width: '90%', text: activity.end_notes, font: { fontSize: 15, }, });
	sectionEndNotes.rows[0].add(end_notes);
	if(activity.id) {
		sectionEndNotes.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
		sectionEndNotes.rows[sectionEndNotes.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, }));
	}
	
	var sectionPatient = Ti.UI.createTableViewSection({ headerTitle: 'Patient (required)', });
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
	sectionPatient.rows[4].add(diagnosis);
	
	var sectionGoals = Ti.UI.createTableViewSection({ headerTitle: '*Goals' });
	sectionGoals.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
	if(activity.goals.length == 0) var goals_message = "No goals listed";
	else if(activity.goals.length == 1) var goals_message = activity.goals.length+" goals listed";
	else var goals_message = activity.goals.length+" goals listed";
	var goals_title = Titanium.UI.createLabel({ text: goals_message, left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, });
	sectionGoals.rows[0].add(goals_title);
	
	var sectionActivity = Ti.UI.createTableViewSection({ headerTitle: 'Activity description(required)'});
	sectionActivity.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 90, hasChild: true, }));
	sectionActivity.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
	sectionActivity.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', })); 
	var main_activity = Ti.UI.createLabel({ left: 15, width: '90%', text: activity.main_activity, font: { fontSize: 15, }, });
	var location_description = Titanium.UI.createLabel({ text: "If this activity needs to happen at a particular location, please mention it here", left: 15, font: { fontSize: 15, }, });
	var location_title = Titanium.UI.createLabel({ text: 'Location', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var location = Titanium.UI.createTextField({ hintText: 'eg: home', value: activity.location, width: '55%', left: '45%' });
	sectionActivity.rows[0].add(main_activity);
	sectionActivity.rows[1].add(location_description);
	sectionActivity.rows[2].add(location_title);
	sectionActivity.rows[2].add(location);
	
	var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Details(* = required)' });
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
	var startDate_title = Titanium.UI.createLabel({ text: '*Start date', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var start_date = Titanium.UI.createLabel({ text: activity.start_date, width: '55%', left: '45%', old_start_date: activity.start_date, });
	var endDate_title = Titanium.UI.createLabel({ text: '*End date', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var end_date = Titanium.UI.createLabel({ text: activity.end_date, width: '55%', left: '45%', old_end_date: activity.end_date, });
	var frequency_title = Titanium.UI.createLabel({ text: '*How Many Times?', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var frequency = Titanium.UI.createLabel({ text: activity.frequency, left: '60%', width: '40%', }); //keyboard type 4 = number pad
	var interval_title = Titanium.UI.createLabel({ text: '*Interval', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var interval = Ti.UI.createLabel({ text: activity.interval, left: '60%', width: '40%', bubbleParent: false, old_interval: activity.interval, });
	var alert_description = Titanium.UI.createLabel({ text: "You can choose how long before every scheduled activity you would "+
														"like to be alerted. For example: if you have to ensure the activity is completed "+
														"twice a day, and you choose to be alerted 15 minutes before, we will "+
														"notify you 15 minutes before the two times that you choose below.", left: 15, font: { fontSize: 15, }, });
	var alert_title = Titanium.UI.createLabel({ text: '*Alert at', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var alert_text = Ti.UI.createLabel({ text: activity.alert, left: '60%', width: '40%', bubbleParent: false, old_advance: activity.alert, });
	var alertsPage_title = Titanium.UI.createLabel({ text: '('+activity.times.length+') Times for alerts', left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, old_times: activity.times, });
	if(frequency.text == 0) alertsPage_title.color = '#CCC';
	else alertsPage_title.color = 'black';
	sectionDetails.rows[0].add(startDate_title);
	sectionDetails.rows[0].add(start_date);
	sectionDetails.rows[1].add(endDate_title);
	sectionDetails.rows[1].add(end_date);
	sectionDetails.rows[2].add(frequency_title);
	sectionDetails.rows[2].add(frequency);
	sectionDetails.rows[3].add(interval_title);
	sectionDetails.rows[3].add(interval);
	sectionDetails.rows[4].add(alert_description);
	sectionDetails.rows[5].add(alert_title);
	sectionDetails.rows[5].add(alert_text);
	sectionDetails.rows[6].add(alertsPage_title);
	if(activity.id) { 
		sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
		sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));
	}
	
/*	var sectionOutcome = Ti.UI.createTableViewSection();
	sectionOutcome.add(Ti.UI.createTableViewRow({ height: 45, selectedBackgroundColor: 'white' }));
	var success_title = Titanium.UI.createLabel({ text: 'Successful?', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var successful_switcher = Titanium.UI.createSwitch({ value: activity.successful, right: 10 });
	sectionOutcome.rows[0].add(success_title);
	sectionOutcome.rows[0].add(successful_switcher);
	
	successful_switcher.addEventListener('change', function() {
		if(successful_switcher.value == true && Titanium.Network.online && 
			Titanium.Facebook.loggedIn && activity.facebook_id == null) { 
			sectionShare.rows[0].backgroundColor = 'blue';
			return;
		}
		sectionShare.rows[0].backgroundColor = '#CCC';
		
	}); */
	

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
	
	//Rules for what to display as the status
	if(activity.id) {
		if(!isValidDate(activity.end_date) && status.text === 'Scheduled') {
			status.text = "Complete";
		}
		if(activity.status == "Completed") {
			if(Titanium.App.Properties.getString('child')) {
				table.data = [sectionStatus, sectionEndNotes, sectionGoals, sectionActivity, sectionDetails];
			}
			else { 
				table.data = [sectionStatus, sectionEndNotes, sectionPatient, sectionGoals, sectionActivity, sectionDetails];	
			}
		}
		else {
			if(Titanium.App.Properties.getString('child')) {
				table.data = [sectionStatus, sectionGoals, sectionActivity, sectionDetails];
			}
			else { 
				table.data = [sectionStatus, sectionPatient, sectionGoals, sectionActivity, sectionDetails];
			}	
		}
	}
	else {
		table.data = [sectionPatient, sectionGoals, sectionActivity, sectionDetails];
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
	
	if(activity.entry_id == null) {
		alert('logic for this not entered. must find an existing entry based on diagnosis, category, symptoms/goals');
		return false;
	}
	
	if(activity.id == null) {
		var appointment_id=null;
		var appointment_cloud_id=null;
		if(activity.appointment_id != null) {
				appointment_cloud_id = getAppointmentLocal(activity.appointment_id)[0].cloud_id;
				appointment_id = '"'+activity.appointment_id+'"';
		}
			var entry_id = '"'+activity.entry_id+'"'; 
			activity.id = insertActivityLocal(entry_id, appointment_id, main_activity.text, 
												start_date.text, end_date.text, frequency.text, interval.text, alert_text.text);
		
		var entry_cloud_id = getEntryLocal(activity.entry_id)[0].cloud_id;
		createObjectACS('activities', { id: activity.id,
										appointment_id: appointment_cloud_id, 
										entry_id:  entry_cloud_id, 
										start_date: activity.start_date,
										end_date: activity.end_date,
										main_activity: main_activity.text,
										recommended_by: recommended_by.value,
										diagnosis: diagnosis.value, 
										frequency: frequency.text,
										interval: interval.text,
										alert: alert_text.text,
										goals: activity.goals,
										times: activity.times,
										end_notes: end_notes.text,
										status: status.text,
										//facebook_id: activity.facebook_id,
									});
									
	}
	updateRecordTimesForEntryLocal(activity.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
	
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

function saveStatus()
{
	if(!beforeSaving()) return;
	updateActivityLocal(activity.id, 'status', status.text);
	activity.status = status.text;
	if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == 'blue')	sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = '#CCC';
	if(status.text != 'Scheduled') sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved!';
	else { sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved-Pleased change dates below'; }
}

function saveEndNotes()
{
	if(!beforeSaving()) return;
	
	updateActivityLocal(activity.id, 'end_notes', end_notes.text);
	
	if(sectionEndNotes.rows[sectionEndNotes.rowCount-1].backgroundColor == 'blue') {
		sectionEndNotes.rows[sectionEndNotes.rowCount-1].backgroundColor = '#CCC';
		sectionEndNotes.rows[sectionEndNotes.rowCount-1].children[0].text = 'Changes Saved';
	}
}

function saveGoals()
{
	if(!validateGoals()) return false;	
	if(!beforeSaving()) return false;
		
		deleteGoalsForActivityLocal(activity.id);
		
		for(var i=0; i < activity.goals.length; i++) {
			activity.goals[i] = removeWhiteSpace(activity.goals[i]);
			insertGoalForActivityLocal(activity.id, activity.goals[i]);
		}
	
		return true;
}

function saveMainActivity()
{
	if(!beforeSaving()) return false;
	updateActivityLocal(activity.id, 'main_activity', main_activity.text);
	updateActivityLocal(activity.id, 'location', location.value);
	return true;
}

function deleteAllLocalNotifications()
{
	if(alertsPage_title.old_times.length == 0) return;
	
	var old_times = alertsPage_title.old_times;
	var local_start_date = start_date.old_start_date;
	var local_end_date = end_date.old_end_date;
	var old_advance = alert_text.old_advance;
	
	var days = Math.floor(( Date.parse(local_end_date) - Date.parse(local_start_date) ) / 86400000);
	if(old_advance === 'Time of event') var advance = 0;
	else { var advance = old_advance.split(' ')[0]; }
	
	var i=0;
	var d = new Date(local_start_date+' '+old_times[0]);
	do {
				d.setDate(d.getDate()+i); 	
				for(var j=0; j < old_times.length; j++) {
					//It means the text was alert time is in the hours
					if(advance > 0 && advance < 5) { 
						d.setHours(new Date(local_start_date+' '+old_times[j]).getHours()-advance);
					}
					else {  
						d.setMinutes(new Date(local_start_date+' '+old_times[j]).getMinutes()-advance);
					}
					var local_notification_id = d.getTime();
					
					Ti.App.iOS.cancelLocalNotification(local_notification_id);
				}
				i++;
		} while(i < days);
}

function saveDetails()
{
	if(!validateDetails()) return false;
	if(!beforeSaving()) return false;
	
	//deleteAllLocalNotifications();
	
/*	var days = Math.floor(( Date.parse(end_date.text) - Date.parse(start_date.text) ) / 86400000);
	if(alert_text.text === 'Time of event') var advance = 0;
	else { var advance = alert_text.text.split(' ')[0]; }
	
	if(interval.text === "every day") var day_increment=1;
	else if(interval.text === "every 2 days") var day_increment=2;
	else if(interval.text === "every 3 days") var day_increment=3;
	else if(interval.text === "every 4 days") var day_increment=4;
	else if(interval.text === "every week") var day_increment=7;
	else if(interval.text === "every 2 weeks") var day_increment=14;
	
	var i=0;
	var d = new Date(start_date.text+' '+activity.times[0]);

	
	if(alert_text.text != 'Never') {	
		do {
				d.setDate(d.getDate()+i); 	
				for(var j=0; j < activity.times.length; j++) {
					//It means the text was alert time is in the hours
					if(advance > 0 && advance < 5) { 
						d.setHours(new Date(start_date.text+' '+activity.times[j]).getHours()-advance);
					}
					else {  
						d.setMinutes(new Date(start_date.text+' '+activity.times[j]).getMinutes()-advance);
					}
					var local_notification_id = d.getTime();
					
						 
					Ti.App.iOS.scheduleLocalNotification({ 
						alertBody: child.first_name+" needs to complete an activity", 
						alertAction: "view", 
						userInfo: {"id": local_notification_id }, 
						date: new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null),  
					});		
				}
				i++;
		} while(i < days);
	} */
	Ti.App.fireEvent('eventSaved');
	
	alertsPage_title.old_times = activity.times;
	alert_text.old_advance = alert_text.text;
	interval.old_interval = interval.text;
	start_date.old_start_date = activity.start_date;
	end_date.old_end_date = activity.end_date;
	
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
	
	
	deleteTimesForActivityLocal(activity.id);
	
	for(var i=0; i < activity.times.length; i++) {
		insertTimeForActivityLocal(activity.id, activity.times[i]);
	}
	
	deactivateSaveButton();
}
	
	
//Functions that works with the modal picker to change the date
//input: date: the object that we need to work with(label object)
function changeDate(date)
{
var modalPicker = require('ui/common/helpers/modalPicker');
modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE,null,date.text); 

if(window.leftNavButton != null) { 
	window.leftNavButton.setTouchEnabled(false);
}
window.rightNavButton.setTouchEnabled(false); 
window.setTouchEnabled(false);
table.scrollable = false;
if(Titanium.Platform.osname == 'iphone') modalPicker.open();
if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: date, });

 
var picker_closed = function() {
	if(modalPicker.result) { 
		var newDate = modalPicker.result.toDateString();
		date.text = newDate;
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

}

sectionStatus.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		saveStatus();
		return;
	}
	
	var data = [];
	data[0] = 'Scheduled';
	data[1] = 'Completed';
	data[2] = 'Cancelled';
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,status.text); 
	
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: status, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			//The diagnosis section must only show if the appointment has been completed
			if(modalPicker.result == 'Completed' && status.text != 'Completed') {
				table.data = [sectionStatus, sectionEndNotes, sectionPatient, sectionGoals, sectionActivity, sectionDetails];
			}
			if(modalPicker.result != 'Complete' && status.text == 'Completed') {
				table.data = [sectionStatus, sectionCategories, sectionPatient, sectionGoals, sectionActivity, sectionDetails];
			}
			if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') {
				sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
			} 
			status.text = modalPicker.result;
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

sectionEndNotes.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		saveEndNotes();
		return;
	}
	
	var end_notes_page = require('ui/common/helpers/textarea');
	if(end_notes.text === "No observations") {
		var end_notes_text = '';
	}
	else {
		end_notes_text = end_notes.text;
	}
	end_notes_page = new end_notes_page('Main Activity', "Describe the main activity", main_activity_text);
	var children = navGroupWindow.getChildren();
	children[0].open(end_notes_page);
													
	end_notes_page.addEventListener('close', function() {
		if(!end_notes_page.result) {
			end_notes.text = "No activity";
		}
		else {
			end_notes.text = end_notes_page.result;
		}
	});
	
	if(sectionEndNotes.rows[sectionEndNotes.rowCount-1].backgroundColor == '#CCC') {
		sectionEndNotes.rows[sectionEndNotes.rowCount-1].backgroundColor = 'blue';
		sectionEndNotes.rows[sectionEndNotes.rowCount-1].children[0].text = 'Save Changes';
	}
});


goals_title.addEventListener('click', function() {
	var goals_page = require('ui/common/helpers/items');
	goals_page = new goals_page('Goals', activity.goals);
	var children = navGroupWindow.getChildren();
	children[0].open(goals_page);
	
	goals_page.addEventListener('close', function() {
		activity.goals = goals_page.result;
		if(activity.goals.length == 0) goals_title.text = "No symptoms listed"; 
		else if(activity.goals.length == 1) goals_title.text = activity.goals.length+" goal listed";
		else if(activity.goals.length > 1) goals_title.text = activity.goals.length+ " goals listed";
		activateSaveButton();
	});
});

main_activity.addEventListener('click', function() {
	var activity_page = require('ui/common/helpers/textarea');
	if(main_activity.text === "No activity") {
		var main_activity_text = '';
	}
	else {
		main_activity_text = main_activity.text;
	}
	activity_page = new activity_page('Main Activity', "Describe the main activity", main_activity_text);
	var children = navGroupWindow.getChildren();
	children[0].open(activity_page);
													
	activity_page.addEventListener('close', function() {
		if(!activity_page.result) {
			main_activity.text = "No activity";
		}
		else {
			main_activity.text = activity_page.result;
		}
	});
	
	activateSaveButton();
});


start_date.addEventListener('click', function() {
	changeDate(start_date);
	activity.start_date = start_date.text;
	});
end_date.addEventListener('click', function() {
	changeDate(end_date);
	activity.end_date = end_date.text;
	});	

frequency.addEventListener('click', function() {
	var data = '123456789';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(null,data,frequency.text); 

	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
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

interval.addEventListener('click', function() {
	var data = [];
	data[0] = 'every day';
	data[1] = 'every 2 days';
	data[2] = 'every 3 days';
	data[3] = 'every 4 days';
	data[4] = 'every week';
	data[5] = 'every 2 weeks';
		
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(null,data,interval.text); 

	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: interval, });


	var picker_closed = function() {
		if(modalPicker.result) {
			if(modalPicker.result != interval.text) {
				activateSaveButton();
			} 
			interval.text = modalPicker.result;
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

alert_text.addEventListener('click', function() {
	var data = [];
	data[0] = 'Time of event';
	data[1] = '5 minutes before';
	data[2] = '10 minutes before';
	data[3] = '15 minutes before';
	data[4] = '30 minutes before';
	data[5] = '1 hour before';
	data[6] = 'Never';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(null,data,alert_text.text); 

	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
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

alertsPage_title.addEventListener('click', function() {
	if(this.color == '#CCC') {
		alert("You have to set 'How many times' to 1 or more and Alert must not be 'Never' in order for you to set times");
		return;
	}
	
	var alerts_page = require('ui/common/helpers/alerts');
	alerts_page = new alerts_page(activity.times, alert_text.text);
	var children = navGroupWindow.getChildren();
	children[0].open(alerts_page);
	
	alerts_page.addEventListener('close', function() {
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
			saveDetails();
	}
})

return navGroupWindow;

}

module.exports = activity;
