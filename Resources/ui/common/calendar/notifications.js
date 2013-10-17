


function scheduleAppointmentNotification(appointment)
{	
	if(appointment.alert === 'no alert') {
		var defCalendar = Ti.Calendar.defaultCalendar;
		if(appointment.calendar_event_id) { 
			var event = defCalendar.getEventById(appointment.calendar_event_id);
			if(event) event.remove(Titanium.Calendar.SPAN_FUTUREEVENTS);
		}
		return;
	}
		
	var record_id = getEntryLocal(appointment.entry_id)[0].record_id;
	var individual_id = getRecordLocal(record_id)[0].child_id;
	var individual = getChildLocal(individual_id)[0];
	
	var notes= individual.first_name+' '+individual.last_name+" has an appointment with Dr. "+appointment.doctor.name+" regarding ";
	notes += (individual.sex === "Male")?"his issues with ":(individual.sex === "Female")?"her issues with ":"their issues with ";
	
	for(var i=0; i < appointment.symptoms.length; i++) {
		notes += appointment.symptoms[i];
		if(i < appointment.symptoms.length-2) notes += ", ";
		else if(i == appointment.symptoms.length-2) notes += " and ";
	}
	notes += "\n\n This appointment was scheduled using StarsEarth";
	
	var location = '';
	if(appointment.doctor.location) location += appointment.doctor.location + '\n';
	if(appointment.doctor.street) location += appointment.doctor.street + '\n';
	if(appointment.doctor.city) location += appointment.doctor.city + '\n';
	if(appointment.doctor.state) location += appointment.doctor.state + '\n';
	if(appointment.doctor.zip) location += appointment.doctor.zip + '\n';
	if(appointment.doctor.country) location += appointment.doctor.country + '\n';
	
	var frequency=undefined;
	if(appointment.repeat === 'every day') frequency = Ti.Calendar.RECURRENCEFREQUENCY_DAILY;
	else if(appointment.repeat === 'every week') frequency = Ti.Calendar.RECURRENCEFREQUENCY_WEEKLY;
	else if(appointment.repeat === 'every month') frequency = Ti.Calendar.RECURRENCEFREQUENCY_MONTHLY;
	else if(appointment.repeat === 'every year') frequency = Ti.Calendar.RECURRENCEFREQUENCY_YEARLY;

    var start = new Date(appointment.date+' '+appointment.time),
        end = new Date(appointment.date+' '+appointment.time);
        end.setHours(end.getHours() + appointment.duration.hours);
        end.setMinutes(end.getMinutes() + appointment.duration.minutes);
        
    var alertDate = new Date(appointment.date+' '+appointment.time);
    var relativeOffset = 0;
	if(appointment.alert === "15 minutes before") {
		alertDate.setMinutes(alertDate.getMinutes()-15);
		relativeOffset = -15*(60*1000);
	}
	else if(appointment.alert === "30 minutes before") {
		alertDate.setMinutes(alertDate.getMinutes()-30);
		relativeOffset = -30*(60*1000);
	}
	else if(appointment.alert === "1 hour before") {
		alertDate.setHours(alertDate.getHours()-1);
		relativeOffset = -1*(60*60*1000);
	}
	else if(appointment.alert === "2 hours before") {
		alertDate.setHours(alertDate.getHours()-2);
		relativeOffset = -2*(60*60*1000);
	}
	else if(appointment.alert === "1 day before") {
		alertDate.setDate(alertDate.getDate()-1);
		relativeOffset = -24*(60*60*1000);
	}   
    
    var defCalendar = Ti.Calendar.defaultCalendar;
	if(appointment.calendar_event_id) { 
		var event = defCalendar.getEventById(appointment.calendar_event_id);
		if(event) event.remove(Titanium.Calendar.SPAN_FUTUREEVENTS);
	}
	
    var event1 = defCalendar.createEvent({
                        title: individual.first_name+' '+individual.last_name+"'s appointment",
                        notes: notes,
                        location: location,
                        begin: start,
                        end: end,
                        availability: Ti.Calendar.AVAILABILITY_FREE,
                        allDay: false,
                });
    var alert1 = event1.createAlert({
                        absoluteDate: alertDate
                });
	var alert2 = event1.createAlert({
        relativeOffset: relativeOffset
   });
    var allAlerts = new Array(alert2);
    event1.alerts = allAlerts;
    var newRule = event1.createRecurenceRule({
                        frequency: frequency,
                        interval: 1,
                });
    if(appointment.repeat !== 'once only') event1.recurrenceRules = [newRule];
    event1.save(Ti.Calendar.SPAN_FUTUREEVENTS);
    updateAppointmentLocal(appointment.id, 'calendar_event_id', event1.id);
	
}

function scheduleActivityNotification(activity)
{	
	if(activity.alert === 'Never') {
		var defCalendar = Ti.Calendar.defaultCalendar;
		for(x in activity.calendar_event_ids) {
			if(!activity.calendar_event_ids[x]) continue; 
			var event = defCalendar.getEventById(activity.calendar_event_ids[x]);
			if(event) event.remove(Titanium.Calendar.SPAN_FUTUREEVENTS);
		}
		return;
	}
		
	var record_id = getEntryLocal(activity.entry_id)[0].record_id;
	var individual_id = getRecordLocal(record_id)[0].child_id;
	var individual = getChildLocal(individual_id)[0];
	
	var notes= individual.first_name+' '+individual.last_name+" has to do this activity:\n"+activity.main_activity+"\n";
	notes += (individual.sex === "Male")?"He has to ":(individual.sex === "Female")?"She has to ":"They have to ";
	notes += "accomplish the following goals: ";
	
	for(var i=0; i < activity.goals.length; i++) {
		notes += activity.goals[i];
		if(i < activity.goals.length-2) notes += ", ";
		else if(i == activity.goals.length-2) notes += " and ";
	}
	notes += "\n\n This activity was scheduled using StarsEarth";
	
	var location = activity.location;
	
	var frequency=undefined;
	var occurences = Math.floor(( Date.parse(activity.end_date) - Date.parse(activity.start_date) ) / 86400000); //1000*60*60*24
	occurences = occurences + 1;  //Difference of 0 is 1 day
	if(activity.interval === 'every day') frequency = Ti.Calendar.RECURRENCEFREQUENCY_DAILY;
	else if(activity.interval === 'every week') {
		frequency = Ti.Calendar.RECURRENCEFREQUENCY_WEEKLY;
		occurences = occurences/7;
	}
	else if(activity.interval === 'every month') {
		frequency = Ti.Calendar.RECURRENCEFREQUENCY_MONTHLY;
		occurences = occurences/30;
	}
	else if(activity.interval === 'every year') {
		frequency = Ti.Calendar.RECURRENCEFREQUENCY_YEARLY;
		occurences = occurences/365;
	}

        
    var relativeOffset = 0;
	if(activity.alert === "5 minutes before") relativeOffset = -5*(60*1000);
	else if(activity.alert === "10 minutes before") relativeOffset = -10*(60*1000);
	else if(activity.alert === "15 minutes before") relativeOffset = -15*(60*1000);
	else if(activity.alert === "30 minutes before") relativeOffset = -30*(60*1000);
	else if(activity.alert === "1 hour before") relativeOffset = -1*(60*60*1000);
    
    var defCalendar = Ti.Calendar.defaultCalendar;
	for(x in activity.calendar_event_ids) {
		if(!activity.calendar_event_ids[x]) continue;
		var event = defCalendar.getEventById(activity.calendar_event_ids[x]);
		if(event) event.remove(Titanium.Calendar.SPAN_FUTUREEVENTS);
	}
	
	
	 
		for(x in activity.times) {
			var start = new Date(activity.start_date+' '+activity.times[x]);
			var end = new Date(activity.start_date+' '+activity.times[x]);
			end.setMinutes(end.getMinutes() + 30);		
			 
		    var event1 = defCalendar.createEvent({
		                        title: individual.first_name+' '+individual.last_name+"'s activity",
		                        notes: notes,
		                        location: location,
		                        begin: start,
		                        end: end,
		                        availability: Ti.Calendar.AVAILABILITY_FREE,
		                        allDay: false,
		                });
			var alert2 = event1.createAlert({
		        relativeOffset: relativeOffset
		   });
		    var allAlerts = new Array(alert2);
		    event1.alerts = allAlerts;
		    var end_date = new Date(activity.end_date);
		    var newRule = event1.createRecurenceRule({
		                        frequency: frequency,
		                        interval: 1,
		                        end: {occurrenceCount: occurences }
		                });
		    if(activity.repeat !== 'once only') event1.recurrenceRules = [newRule];
		    event1.save(Ti.Calendar.SPAN_FUTUREEVENTS);
		    updateActivityTimesLocal(activity.id, activity.times[x], 'calendar_event_id', event1.id);
	   }
	
}

function scheduleTreatmentNotification(treatment)
{	
	if(treatment.alert === 'Never') {
		var defCalendar = Ti.Calendar.defaultCalendar;
		for(x in treatment.calendar_event_ids) {
			if(!treatment.calendar_event_ids[x]) continue; 
			var event = defCalendar.getEventById(treatment.calendar_event_ids[x]);
			if(event) event.remove(Titanium.Calendar.SPAN_FUTUREEVENTS);
		}
		return;
	}
		
	var record_id = getEntryLocal(treatment.entry_id)[0].record_id;
	var individual_id = getRecordLocal(record_id)[0].child_id;
	var individual = getChildLocal(individual_id)[0];
	
	var notes= individual.first_name+' '+individual.last_name+" has to take ";
	if(treatment.type === 'Solid') { 
		notes += treatment.dosage;
		notes += (treatment.dosage > 1)?" pills of ":" pill of ";
		notes += treatment.medication+". ";
	}
	else if(treatment.type === 'Liquid') notes += treatment.dosage+" of "+treatment.medication+". ";
	
	notes += "This is for ";
	notes += (individual.sex === "Male")?"his issues with ":(individual.sex === "Female")?"her issues with ":"their issues with ";
	
	for(var i=0; i < treatment.symptoms.length; i++) {
		notes += treatment.symptoms[i];
		if(i < treatment.symptoms.length-2) notes += ", ";
		else if(i == treatment.symptoms.length-2) notes += " and ";
	}
	notes += "\n\n This treatment was scheduled using StarsEarth";
	
	var frequency=undefined;
	var occurences = Math.floor(( Date.parse(treatment.end_date) - Date.parse(treatment.start_date) ) / 86400000); //1000*60*60*24
	occurences = occurences + 1;  //Difference of 0 is 1 day
	if(treatment.interval === 'every day') frequency = Ti.Calendar.RECURRENCEFREQUENCY_DAILY;
	else if(treatment.interval === 'every week') {
		frequency = Ti.Calendar.RECURRENCEFREQUENCY_WEEKLY;
		occurences = occurences/7;
	}
	else if(treatment.interval === 'every month') {
		frequency = Ti.Calendar.RECURRENCEFREQUENCY_MONTHLY;
		occurences = occurences/30;
	}
	else if(treatment.interval === 'every year') {
		frequency = Ti.Calendar.RECURRENCEFREQUENCY_YEARLY;
		occurences = occurences/365;
	}

        
    var relativeOffset = 0;
	if(treatment.alert === "5 minutes before") relativeOffset = -5*(60*1000);
	else if(treatment.alert === "10 minutes before") relativeOffset = -10*(60*1000);
	else if(treatment.alert === "15 minutes before") relativeOffset = -15*(60*1000);
	else if(treatment.alert === "30 minutes before") relativeOffset = -30*(60*1000);
	else if(treatment.alert === "1 hour before") relativeOffset = -1*(60*60*1000);
    
    var defCalendar = Ti.Calendar.defaultCalendar;
	for(x in treatment.calendar_event_ids) {
		if(!treatment.calendar_event_ids[x]) continue;
		var event = defCalendar.getEventById(treatment.calendar_event_ids[x]);
		if(event) event.remove(Titanium.Calendar.SPAN_FUTUREEVENTS);
	}
	
	
	 
		for(x in treatment.times) {
			var start = new Date(treatment.start_date+' '+treatment.times[x]);
			var end = new Date(treatment.start_date+' '+treatment.times[x]);
			end.setMinutes(end.getMinutes() + 30);		
			 
		    var event1 = defCalendar.createEvent({
		                        title: individual.first_name+' '+individual.last_name+"'s treatment",
		                        notes: notes,
		                        begin: start,
		                        end: end,
		                        availability: Ti.Calendar.AVAILABILITY_FREE,
		                        allDay: false,
		                });
			var alert2 = event1.createAlert({
		        relativeOffset: relativeOffset
		   });
		    var allAlerts = new Array(alert2);
		    event1.alerts = allAlerts;
		    var newRule = event1.createRecurenceRule({
		                        frequency: frequency,
		                        interval: 1,
		                        end: {occurrenceCount: occurences }
		                });
		    if(treatment.repeat !== 'once only') event1.recurrenceRules = [newRule];
		    event1.save(Ti.Calendar.SPAN_FUTUREEVENTS);
		    updateTreatmentTimesLocal(treatment.id, treatment.times[x], 'calendar_event_id', event1.id);
	   }
	
}

function scheduleNotification(type, object)
{
	if(Ti.Calendar.eventsAuthorization == Ti.Calendar.AUTHORIZATION_AUTHORIZED) {
    	if(type === 'appointment') scheduleAppointmentNotification(object);
    	if(type === 'activity') scheduleActivityNotification(object);
    	if(type === 'treatment') scheduleTreatmentNotification(object);
	} else {
    	Ti.Calendar.requestEventsAuthorization(function(e){
        	    if (e.success) {
            	    if(type === 'appointment') scheduleAppointmentNotification(object);
            	    if(type === 'activity') scheduleActivityNotification(object);
            	    if(type === 'treatment') scheduleTreatmentNotification(object);
            	} else {
                	alert('Access to calendar is not allowed');
            	}
        });
	}
}
