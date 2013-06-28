var month=new Array();
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";

function getMonth(input)
{
	return month[input];
}

/* function to judge if time ented is valid(ie: equal to or later than current time)
 * input: the appointment date and time as a string
 * output: boolean: date is valid/invalid
 * 
 */

function isValidDateTime(appointment_date)
{
var appointment = new Date(appointment_date);
var current = new Date();	


if(appointment.getFullYear() > current.getFullYear()) { return true; }
else {
	if(appointment.getMonth() > current.getMonth()) { return true; }
	else {
		if(appointment.getDate() > current.getDate()) { return true; }
		else {
			if(appointment.getHours() > current.getHours()) { return true; }
			else {
				if(appointment.getMinutes() > current.getMinutes()) { return true; }
				else 
				{ 
					return false; 
				}
			}
		}
	}
 }
}


function isValidDate(apt_date)
{
var date = new Date(apt_date);
var current = new Date();	

if(date.getFullYear() > current.getFullYear()) { return true; }
else if(date.getFullYear() < current.getFullYear()) { return false; }
else {
	if(date.getMonth() > current.getMonth()) { return true; }
	else if(date.getMonth() < current.getMonth()) { return false; }
	else {
		if(date.getDate() >= current.getDate()) { return true; }
		else {
				return false; 	
		}
	}
 }
}

function isStartBeforeEnd(start_date,end_date)
{
	if(end_date == null) { var end = new Date(); }
	else { var end = new Date(end_date); }
	if(start_date == null) { var start = new Date(); }
	else { var start = new Date(start_date); }	

if(end.getFullYear() > start.getFullYear()) { return true; }
else if(end.getFullYear() < start.getFullYear()) { return false; }
else {
	if(end.getMonth() > start.getMonth()) { return true; }
	else if(end.getMonth() < start.getMonth()) { return false; }
	else {
		if(end.getDate() >= start.getDate()) { return true; }
		else {
				return false; 
		}
	}
 }
}

//input: left_time, right_time: strings
//output: boolean
function isLeftTimeGreater(left_time, right_time)
{
	var time1=null;
	var time2=null;
	
	var dateTime = timeFormatted(new Date());
	
	if(left_time == null) time1 = new Date();
	else time1 = new Date(dateTime.date+' '+left_time);
	if(right_time == null) time2 = new Date();
	else time2 = new Date(dateTime.date+' '+right_time);
	if(time1.getHours() > time2.getHours()) return true;
	if(time1.getHours() == time2.getHours())
		if(time1.getMinutes() > time2.getMinutes()) return true;
	
	return false;
}

function isLeftEqualToRight(left_time, right_time)
{
	if(left_time == null || right_time == null) return null;
	var dateTime = timeFormatted(new Date());
	var time1 = new Date(dateTime.date+' '+left_time);
	var time2 = new Date(dateTime.date+' '+right_time);
	if(time1.getHours() != time2.getHours()) return false;
	if(time1.getMinutes() != time2.getMinutes()) return false;
	
	return true;
}

//function to round the mintues to the nearest 5 so we can use 5 min interval in picker
function roundMinutes(d) {
	var min = d.getMinutes();
		var min1 = min%10;
		if(min1%5 == 0) return d;
		
		if(min1 < 5) { var min2 = 5-min1; }
		else { var min2 = 10-min1; }
		min = min + min2;
		d.setMinutes(min,0,0);
		
	return d;
}



//This function formats the time to remove excess text like time zone and hours compared to GMT
//input: date as a Date object
function timeFormatted(date)
{
var d = date; 
var d_current = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null);
d_current = d_current.toDateString() + ' ' + d_current.toLocaleTimeString();
d_current = d_current.split('CST');
d_current = d_current[0].split('EST');
d_current = d_current[0].split('PST');
d_current = d_current[0].split('GMT');
var final_time = d_current[0].split(':');
var final_time2 = final_time[2].split(' ');

var date = final_time[0].split(' ');
var final_date=date[0]+' ';
for(var i=1;i<date.length-1;i++)
{
	final_date += date[i] + ' ';
}
final_time = date[i] + ':' + final_time[1]+' '+final_time2[1];
final_time =  { date: final_date, time: final_time } 
//final_time =  final_time[0]+':'+final_time[1]+' '+final_time2[1];
return final_time;
}



function calculateAge(birthDate, otherDate) {
    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() || 
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }
    
    if(years == 0) {
    	if(otherDate.getMonth() >= birthDate.getMonth()) {
    		var months = otherDate.getMonth() - birthDate.getMonth();
    	}
    	else {
    		var months = (12 - birthDate.getMonth()) + otherDate.getMonth();
    	}
    	
    	if(otherDate.getDate() < birthDate.getDate()) {
    		months--;
    	}
    }
    
    if(months == 0) {
    	var days = otherDate.getDate() - birthDate.getDate();
    }
    
    var result = (years > 0)?years+' years':(months > 0)?months+' months':days+' days';

    return result;
}

function millisecondsToHoursMinutesSeconds(milliseconds)
{
	var minutes = Math.floor((milliseconds%(1000*60*60))/(1000*60));
	var hours = Math.floor(milliseconds/(1000*60*60));
	var seconds = Math.floor(((milliseconds % (1000*60*60)) % (1000*60)) / 1000);
	
	return { minutes: minutes, hours: hours };
}

function hoursMinutesToMilliseconds(hours, minutes)
{
	return (((hours*60)+minutes)*60)*1000;
}

function generateJsonDateString()
{
	var d = new Date();
	d.setMonth(d.getMonth()+1);
	d.setMinutes(d.getMinutes()+d.getTimezoneOffset());
	var json_date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+'T'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'+0000';
	
	return json_date;
}

function jsonDateToRegularDateString(json_date)
{
	json_date = JSON.stringify(json_date);
	json_date = json_date.replace(new RegExp("-", 'g'), "/");
	json_date = json_date.replace('T',' ');
	json_date = json_date.replace(new RegExp('"', 'g'), '');
	
	return json_date;
}

function jsonDateStringTimeFormatted(json_date_string)
{
	var date_object = new Date(json_date_string);
	
	return timeFormatted(date_object);
}

