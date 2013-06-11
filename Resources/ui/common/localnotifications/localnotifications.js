var isAppActive=true;
var isAppointmentConfirmWindowOpen=false;
var isActivityConfirmWindowOpen=false; //This flag is used to ensure confirm window is not opened twice
var isTreatmentConfirmWindowOpen=false;

var timeIntervalIds = [];

function scheduleAppointmentLocalNotifications(appointment, child)
{	
	if(appointment.alert != "no alert") {  
		var d = new Date(appointment.date+' '+appointment.time);
		if(appointment.alert === "15 minutes before") d.setMinutes(d.getMinutes()-15);
		else if(appointment.alert === "30 minutes before") d.setMinutes(d.getMinutes()-30);
		else if(appointment.alert === "1 hour before") d.setHours(d.getHours()-1);
		else if(appointment.alert === "2 hours before") d.setHours(d.getHours()-2);
		else if(appointment.alert === "1 day before") d.setDate(d.getDate()-1);

		if(appointment.repeat === "once only") var repeat = null;
		else if(appointment.repeat === "every day") var repeat = "daily";
		else var repeat = appointment.repeat.split(' ')[1] + "ly";	
	
	if(appointment.alert === "1 day before") var alertBody = "tomorrow";
	else var alertBody = "in " + appointment.alert.split(' ')[0] + " " + appointment.alert.split(' ')[1];
	
	timeIntervalIds[timeIntervalIds.length] = setTimeout(function() {
							var the_appointment = getAppointmentLocal(appointment.id); //If it doesnt exist anymore, do not display the confirm dialog
							if(the_appointment.length == 0) return;
							
							if(isAppointmentConfirmWindowOpen) return;
							if(isAppActive) {
								isAppointmentConfirmWindowOpen=true;
								
								var confirm = Titanium.UI.createAlertDialog({ title: "Reminder for an appointment", 
								message: child.first_name+" has an appointment with Dr. "+appointment.doctor.name+" "+alertBody, 
								buttonNames: ['View Details','Close'], cancel: 1 });
								
								confirm.addEventListener('click', function(g) { 
							   			//Clicked cancel, first check is for iphone, second for android
							   			if (g.cancel === g.index || g.cancel === true) { return; }
							
							
							  			 switch (g.index) {
							     		 case 0:
							     		 	isAppointmentConfirmWindowOpen=false;
							     		 
							     		  	var window = Ti.UI.createWindow({ title: 'Reminder', backgroundColor: 'white', });
							     		  	var done_btn = Ti.UI.createButton({
							     		  		systemButton: Ti.UI.iPhone.SystemButton.DONE,
							     		  	});
							     		  	done_btn.addEventListener('click', function() {
							     		  		window.close();
							     		  	});
							     		  	window.rightNavButton = done_btn;
							     		  	
							     		  	var label = Ti.UI.createLabel({
							     		  		width: 200,
							     		  		textAlign: 1,
							     		  	});
							     		  	var duration_string = (appointment.duration.hours > 0)?appointment.duration.hours+' hours ':'';
											duration_string += (appointment.duration.minutes > 1)?appointment.duration.minutes+' minutes':''; 							     		  	
							     		  	label.setText(child.first_name+" has an appointment scheduled for "+duration_string+" with Dr. "+appointment.doctor.name+" "+alertBody);
							     		  	if(appointment.doctor.location) label.setText(label.getText()+" at "+appointment.doctor.location);
							     		  	else if(appointment.doctor.street) {
							     		  		label.setText(label.getText()+" at "+appointment.doctor.street)  
							     		  		if(appointment.doctor.city) label.setText(label.getText()+", "+appointment.doctor.city); 
							     		  		if(appointment.doctor.state) label.setText(label.getText()+", "+appointment.doctor.state);
							     		  		if(appointment.doctor.zip) label.setText(label.getText()+", "+appointment.doctor.zip);
							     		  		if(appointment.doctor.country) label.setText(label.getText()+", "+appointment.doctor.country);
							     		  	}
							     		  	if(appointment.symptoms.length > 0) {
							     		  		label.setText(label.getText()+". "+child.first_name+" is suffering from "+appointment.symptoms[0]);
							     		  		for(var i=0; i < appointment.symptoms.length; i++) {
							     		  			label.setText(label.getText()+", "+appointment.symptoms[i]);
							     		  		}
							     		  	}
							     		  	window.add(label);
							     		  	window.open({ modal: true, });
							     		  	
							      			break;
							
							      		 case 1:       			
							      		 default: isAppointmentConfirmWindowOpen=false;
							      		 		break;
							  			}
									});
									confirm.show();
							}
						}, d.getTime() - (new Date).getTime());
	
		Ti.App.iOS.scheduleLocalNotification({ 
			alertBody: child.first_name+" has an appointment with Dr. "+appointment.doctor.name+" "+alertBody, 
			alertAction: "view",
			repeat: repeat, 
			userInfo: {"child": child, "type": "appointment", "appointment": JSON.stringify(appointment) }, 
			date: new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null),  
		});
	
	}	
	
}

function scheduleActivityLocalNotifications(activity, child)
{
	var days = Math.floor(( Date.parse(activity.end_date) - Date.parse(activity.start_date) ) / 86400000);
	if(activity.alert === 'Time of event') var advance = 0;
	else { var advance = activity.alert.split(' ')[0]; }
	
	if(activity.interval === "every day") var day_increment=1;
	else if(activity.interval === "every 2 days") var day_increment=2;
	else if(activity.interval === "every 3 days") var day_increment=3;
	else if(activity.interval === "every 4 days") var day_increment=4;
	else if(activity.interval === "every week") var day_increment=7;
	else if(activity.interval === "every 2 weeks") var day_increment=14;
	
	var i=0;
	var d = new Date(activity.start_date+' '+activity.times[0]);

	
	if(activity.alert != 'Never') {	
		do {
				d.setDate(d.getDate()+i); 	
				for(var j=0; j < activity.times.length; j++) {
					//It means the text was alert time is in the hours
					if(advance > 0 && advance < 5) { 
						d.setHours(new Date(activity.start_date+' '+activity.times[j]).getHours()-advance);
					}
					else {  
						d.setMinutes(new Date(activity.start_date+' '+activity.times[j]).getMinutes()-advance);
					}
					var local_notification_id = d.getTime();
					
					if(d > new Date()) {
			timeIntervalIds[timeIntervalIds.length]	=	setTimeout(function() {
							var the_activity = getActivityLocal(activity.id); //If it doesnt exist anymore, do not display the confirm dialog
							if(the_activity.length == 0) return;
							
							if(isActivityConfirmWindowOpen) return;
							if(isAppActive) {
								isActivityConfirmWindowOpen=true;
								
								var confirm = Titanium.UI.createAlertDialog({ title: "Reminder for an activity", 
								message: child.first_name+" needs to complete an activity", 
								buttonNames: ['View Details','Close'], cancel: 1 });
								
								confirm.addEventListener('click', function(g) { 
							   			//Clicked cancel, first check is for iphone, second for android
							   			if (g.cancel === g.index || g.cancel === true) { return; }
							
							
							  			 switch (g.index) {
							     		 case 0:
							     		 	isActivityConfirmWindowOpen=false;
							     		 
							     		  	var window = Ti.UI.createWindow({ title: 'Reminder', backgroundColor: 'white', });
							     		  	var done_btn = Ti.UI.createButton({
							     		  		systemButton: Ti.UI.iPhone.SystemButton.DONE,
							     		  	});
							     		  	done_btn.addEventListener('click', function() {
							     		  		window.close();
							     		  	});
							     		  	window.rightNavButton = done_btn;
							     		  	
							     		  	var label = Ti.UI.createLabel({
							     		  		width: 200,
							     		  		textAlign: 1,
							     		  	});
							     		  	label.setText(child.first_name+" needs to do an activity "+activity.interval+". This is part of a "+days+" day activity plan.");
							     		  	label.setText(label.getText()+" The activity is: "+activity.main_activity);
							     		  	window.add(label);
							     		  	window.open({ modal: true, });
							     		  	
							      			break;
							
							      		 case 1:       			
							      		 default: isActivityConfirmWindowOpen=false;
							      		 		break;
							  			}
									});
									confirm.show();
							}
						}, d.getTime() - (new Date).getTime());
						 	 
						Ti.App.iOS.scheduleLocalNotification({ 
							alertBody: child.first_name+" needs to complete an activity", 
							alertAction: "view", 
							userInfo: {"id": local_notification_id, "child": child, "type": "activity", "activity": JSON.stringify(activity) }, 
							date: new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null),  
						});		
					}
				}
				i++;
		} while(i < days);
	}
}

function scheduleTreatmentLocalNotifications(treatment, child)
{
	var days = Math.floor(( Date.parse(treatment.end_date) - Date.parse(treatment.start_date) ) / 86400000);
	if(treatment.alert === 'Time of event') var advance = 0;
	else { var advance = treatment.alert.split(' ')[0]; }
	if(treatment.type == 'Solid') {
		if(treatment.dosage == 1) {
			var alertBody = treatment.dosage+" pill of "+treatment.medication+" for "+child.first_name;
		}
		else { 
			var alertBody = treatment.dosage+" pills of "+treatment.medication+" for "+child.first_name;
		}
	}
	else {
		var alertBody = treatment.dosage+" of "+treatment.medication+" for "+child.first_name;
	}
	var i=0;
	var d = new Date(treatment.start_date+' '+treatment.times[0]);

	
	if(treatment.alert != 'Never') {	
		do {
				d.setDate(d.getDate()+i); 	
				for(var j=0; j < treatment.times.length; j++) {
					//It means the text was alert time is in the hours
					if(advance > 0 && advance < 5) { 
						d.setHours(new Date(treatment.start_date+' '+treatment.times[j]).getHours()-advance);
					}
					else {  
						d.setMinutes(new Date(treatment.start_date+' '+treatment.times[j]).getMinutes()-advance);
					}
					var local_notification_id = d.getTime();
					
					if(d > new Date()) {
		timeIntervalIds[timeIntervalIds.length]	=	setTimeout(function() {
							var the_treatment = getTreatmentLocal(treatment.id);  //If it doesnt exist anymore, do not display
							if(the_treatment.length == 0) return;
							
							if(isTreatmentConfirmWindowOpen) return;
							if(isAppActive) {
								isTreatmentConfirmWindowOpen=true;
								
								var confirm = Titanium.UI.createAlertDialog({ title: "Reminder for treatment", 
								message: alertBody, 
								buttonNames: ['View Details','Close'], cancel: 1 });
								
								confirm.addEventListener('click', function(g) { 
							   			//Clicked cancel, first check is for iphone, second for android
							   			if (g.cancel === g.index || g.cancel === true) { return; }
							
							
							  			 switch (g.index) {
							     		 case 0:
							     		 	isTreatmentConfirmWindowOpen=false;
							     		 
							     		  	var window = Ti.UI.createWindow({ title: 'Reminder', backgroundColor: 'white', });
							     		  	var done_btn = Ti.UI.createButton({
							     		  		systemButton: Ti.UI.iPhone.SystemButton.DONE,
							     		  	});
							     		  	done_btn.addEventListener('click', function() {
							     		  		window.close();
							     		  	});
							     		  	window.rightNavButton = done_btn;
							     		  	
							     		  	var label = Ti.UI.createLabel({
							     		  		width: 200,
							     		  		textAlign: 1,
							     		  	});
							     		  	if(treatment.type == 'Solid') {
												if(treatment.dosage == 1) {
													label.setText(child.first_name+" needs to take "+treatment.dosage+" pill of "+treatment.medication);
												}
												else { 
													label.setText(child.first_name+" needs to take "+treatment.dosage+" pills of "+treatment.medication);
												}
											}
											else {
												label.setText(child.first_name+"needs to take "+treatment.dosage+" of "+treatment.medication);
											}
											label.setText(label.getText()+" as part of a "+days+" day treatment");
											if(treatment.diagnosis) label.setText(label.getText()+" to cure "+treatment.diagnosis);
											if(treatment.prescribed_by) label.setText(label.getText()+", as prescibed by "+treatment.prescribed_by);
							     		  	window.add(label);
							     		  	window.open({ modal: true, });
							     		  	
							      			break;
							
							      		 case 1:       			
							      		 default: isTreatmentConfirmWindowOpen=false;
							      		 			break;
							  			}
									});
									confirm.show();
							}
						}, d.getTime() - (new Date).getTime());
						 	 
						Ti.App.iOS.scheduleLocalNotification({ 
							alertBody: child.first_name+" needs to take medication", 
							alertAction: "view", 
							userInfo: {"id": local_notification_id, "child": child, "type": "treatment", "treatment": JSON.stringify(treatment) }, 
							date: new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null),  
						});	
					}	
				}
				i++;
		} while(i < days);
	}
}

var scheduleAllLocalNotifications = function()
{	
	Ti.App.iOS.cancelAllLocalNotifications();
	for(var i=0; i < timeIntervalIds.length; i++) {
		clearInterval(timeIntervalIds[i]);
	}
	
	var children = getAllChildrenLocal();
	
	for(var i=0; i < children.length; i++) {
		var records = getRecordsForChildLocal(children[i].id);
		for(var j=0; j < records.length; j++) {
			var entries = getEntryBy('record_id', records[j].id);
			for(var k=0; k < entries.length; k++) {
				var activities = getActivitiesForEntryLocal(entries[k].id);
				for(var l=0; l < activities.length; l++) {
					scheduleActivityLocalNotifications(activities[l], children[i]);
				}
				
				var treatments = getTreatmentsForEntryLocal(entries[k].id);
				for(var l=0; l < treatments.length; l++) {
					scheduleTreatmentLocalNotifications(treatments[l], children[i]);
				}
				
				var appointments = getAppointmentsForEntryLocal(entries[k].id);
				for(var l=0; l < appointments.length; l++) {
					scheduleAppointmentLocalNotifications(appointments[l], children[i]);
					
					var activities = getActivitiesForAppointmentLocal(appointments[l].id);
					for(var m=0; m < activities.length; m++) {
						scheduleActivityLocalNotifications(activities[m], children[i]);	
					}
					
					var treatments = getTreatmentsForAppointmentLocal(appointments[l].id);
					for(var m=0; m < treatments.length; m++) {
						scheduleTreatmentLocalNotifications(treatments[m], children[i]);
					}
				}
			} 
		}
	}
	
}

Ti.App.iOS.addEventListener('notification', function(e) { 
	var window = Ti.UI.createWindow({ title: "Reminder", backgroundColor: 'white', });
	var done_btn = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.DONE, });
	
	done_btn.addEventListener('click', function() { 
		window.close(); 
	});
	Ti.App.addEventListener('paused', function() {
		window.close();
	});
	
	window.rightNavButton = done_btn;
							     		  	
	var label = Ti.UI.createLabel({
				  		width: 200,
	     		  		textAlign: 1,
    		  	});
    var child = e.userInfo.child;
    if(e.userInfo.type === "appointment") {
    	var appointment = JSON.parse(e.userInfo.appointment);
    	
    	if(appointment.alert === "1 day before") var alertBody = "tomorrow";
		else var alertBody = "in " + appointment.alert.split(' ')[0] + " " + appointment.alert.split(' ')[1];
	
		var duration_string = (appointment.duration.hours > 0)?appointment.duration.hours+' hours ':'';
			duration_string += (appointment.duration.minutes > 1)?appointment.duration.minutes+' minutes':'';
	
    	label.setText(child.first_name+" has an appointment scheduled for "+duration_string+" with Dr. "+appointment.doctor.name+" "+alertBody);
		if(appointment.doctor.location) label.setText(label.getText()+" at "+appointment.doctor.location);
		else if(appointment.doctor.street) {
			label.setText(label.getText()+" at "+appointment.doctor.street) 		
			if(appointment.doctor.city) label.setText(label.getText()+", "+appointment.doctor.city)  
			if(appointment.doctor.state) label.setText(label.getText()+", "+appointment.doctor.state);
			if(appointment.doctor.zip) label.setText(label.getText()+", "+appointment.doctor.zip);
			if(appointment.doctor.country) label.setText(label.getText()+", "+appointment.doctor.country);
		}		  	
		if(appointment.symptoms.length > 0) {
			label.setText(label.getText()+". "+child.first_name+" is suffering from "+appointment.symptoms[0]);
			for(var i=0; i < appointment.symptoms.length; i++) {
					label.setText(label.getText()+", "+appointment.symptoms[i]);
			}
		}
    }
    if(e.userInfo.type === "activity") {
    	var activity = JSON.parse(e.userInfo.activity);
    	var days = Math.floor(( Date.parse(activity.end_date) - Date.parse(activity.start_date) ) / 86400000);
    	label.setText(child.first_name+" needs to do an activity "+activity.interval+". This is part of a "+days+" day activity plan.");
		label.setText(label.getText()+" The activity is: "+activity.main_activity);
    }		  	
    else if(e.userInfo.type === "treatment") {
    	var treatment = JSON.parse(e.userInfo.treatment); 
    	var days = Math.floor(( Date.parse(treatment.end_date) - Date.parse(treatment.start_date) ) / 86400000);		  	
	   	if(treatment.type == 'Solid') {
				if(treatment.dosage == 1) {
					label.setText(child.first_name+" needs to take "+treatment.dosage+" pill of "+treatment.medication);
				}
				else { 
					label.setText(child.first_name+" needs to take "+treatment.dosage+" pills of "+treatment.medication);
				}
		}
		else {
				label.setText(child.first_name+"needs to take "+treatment.dosage+" of "+treatment.medication);
		}
		label.setText(label.getText()+" as part of a "+days+" day treatment");
		if(treatment.diagnosis) label.setText(label.getText()+" to cure "+treatment.diagnosis);
		if(treatment.prescribed_by) label.setText(label.getText()+", as prescibed by "+treatment.prescribed_by);
	}
	window.add(label);
	window.open({ modal: true });						     		  	
});



Ti.App.addEventListener('resumed', function() { isAppActive=true; });
Ti.App.addEventListener('paused', function() { isAppActive=false; });
Ti.App.addEventListener('eventSaved', scheduleAllLocalNotifications);



