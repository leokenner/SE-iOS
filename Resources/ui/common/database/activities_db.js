


function initActivitiesDBLocal()
{
	Ti.include('ui/common/database/database.js');
	
	db.execute('CREATE TABLE IF NOT EXISTS activities (ID INTEGER PRIMARY KEY AUTOINCREMENT, CLOUD_ID TEXT, ENTRY_ID INTEGER, APPOINTMENT_ID INTEGER, MAIN_ACTIVITY TEXT NOT NULL, RECOMMENDED_BY TEXT, DIAGNOSIS TEXT, START_DATE TEXT NOT NULL, END_DATE TEXT NOT NULL, FREQUENCY TEXT, INTERVAL TEXT, ALERT TEXT, STATUS TEXT, LOCATION TEXT, ADDITIONAL_NOTES TEXT, FACEBOOK_ID TEXT, FOREIGN KEY(ENTRY_ID) REFERENCES entries (ID), FOREIGN KEY(APPOINTMENT_ID) REFERENCES appointments (ID))');
	db.execute('CREATE TABLE IF NOT EXISTS activity_times (ACTIVITY_ID INTEGER NOT NULL, TIME TEXT NOT NULL, FOREIGN KEY(ACTIVITY_ID) REFERENCES activities (ID))');
	db.execute('CREATE TABLE IF NOT EXISTS activity_goals (ACTIVITY_ID INTEGER NOT NULL, GOAL TEXT NOT NULL, FOREIGN KEY(ACTIVITY_ID) REFERENCES activities (ID))');
}


//removed the quotes from entry_id and appointment_id to allow for null values
function insertActivityLocal(entry_id, appointment_id, main_activity, start_date, end_date, frequency, interval, alert) 
{ 
	var sql = "INSERT INTO activities (entry_id, appointment_id, main_activity, start_date, end_date, frequency, interval, alert) VALUES ("; 
	sql = sql + "" + entry_id + ", ";
	sql = sql + "" + appointment_id + ", ";
	sql = sql + "'" + main_activity.replace("'", "''") + "', ";
	sql = sql + "'" + start_date.replace("'", "''") + "', ";
	sql = sql + "'" + end_date.replace("'", "''") + "', ";
	sql = sql + "'" + frequency + "', ";
	sql = sql + "'" + interval.replace("'", "''") + "', ";
	sql = sql + "'" + alert.replace("'", "''") + "')";
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function updateActivityCloudIdLocal(activity_id, cloud_id)
{
	var sql = "UPDATE activities SET CLOUD_ID='"+cloud_id+"' ";
	sql = sql + "WHERE ID='"+activity_id+"'"; 
	
	db.execute(sql); 
}

function insertTimeForActivityLocal(activity_id, time)
{
	var sql = "INSERT INTO activity_times (activity_id, time) VALUES (";
	sql = sql + "'" + activity_id + "', ";
	sql = sql + "'" + time.replace("'", "''") + "')"; 
	db.execute(sql); 
	
	return db.lastInsertRowId;
}

function insertGoalForActivityLocal(activity_id, goal)
{
	var sql = "INSERT INTO activity_goals (activity_id, goal) VALUES (";
	sql = sql + "'" + activity_id + "', ";
	sql = sql + "'" + goal.replace("'", "''") + "')"; 
	db.execute(sql); 
	
	return db.lastInsertRowId;
}


function getActivityResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  entry_id: resultSet.fieldByName('entry_id'),
			  appointment_id: resultSet.fieldByName('appointment_id'),
		   	  main_activity: resultSet.fieldByName('main_activity'),
		   	  recommended_by: resultSet.fieldByName('recommended_by'),
		   	  diagnosis: resultSet.fieldByName('diagnosis'),
		   	  start_date: resultSet.fieldByName('start_date'),
		   	  end_date: resultSet.fieldByName('end_date'),
		   	  frequency: resultSet.fieldByName('frequency'),
		   	  interval: resultSet.fieldByName('interval'),
		   	  location: resultSet.fieldByName('location'),
		   	  alert: resultSet.fieldByName('alert'),
		   	  status: resultSet.fieldByName('status'),
		   	  additional_notes: resultSet.fieldByName('additional_notes'),
		   	  facebook_id: resultSet.fieldByName('facebook_id'),
	        });
	resultSet.next();
    }
    resultSet.close();
    
    for(var i=0; i < results.length; i++) {
    	results[i].times = getTimesOfActivityLocal(results[i].id);
    	results[i].goals = getGoalsOfActivityLocal(results[i].id);
    }	
    
    return results;
}


function getAllActivitiesLocal()
{
	var sql = "SELECT * FROM activities";
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getActivityResultSet(resultSet, results);
}

function getActivitiesForEntryLocal(entry_id) 
{ 
	var sql = "SELECT * FROM activities WHERE ENTRY_ID='"+entry_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);	

	return getActivityResultSet(resultSet, results);
}


function getActivityByCloudIdLocal(cloud_id) 
{ 
	var sql = "SELECT * FROM activities WHERE CLOUD_ID='"+cloud_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);	

	return getActivityResultSet(resultSet, results);
}


function getActivitiesForAppointmentLocal(appointment_id) 
{ 
	var sql = "SELECT * FROM activities WHERE APPOINTMENT_ID='"+appointment_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);	

	return getActivityResultSet(resultSet, results);
}


function getActivityLocal(activity_id) 
{ 
	var sql = "SELECT * FROM activities WHERE ID='"+activity_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getActivityResultSet(resultSet, results);
}

function getTimesOfActivityLocal(activity_id) 
{
	var sql = "SELECT * FROM activity_times WHERE ACTIVITY_ID='"+activity_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) { 
    	results.push(resultSet.fieldByName('time'));
		resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getGoalsOfActivityLocal(activity_id) 
{
	var sql = "SELECT * FROM activity_goals WHERE ACTIVITY_ID='"+activity_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) { 
    	results.push(resultSet.fieldByName('goal'));
		resultSet.next();
    }
    resultSet.close();		

	return results;
}


function updateActivityLocal(activity_id, column, data)
{
	var intRegex = /^\d+$/;
	if(intRegex.test(data)) {}   //The replacing quotes function throws an error if you use it on an integer
	else if(!data) { data=''; }
	else { data = data.replace("'","''"); }
	
	var sql = "UPDATE activities SET "+column+"='"+data+"' ";
	sql = sql + "WHERE ID='"+activity_id+"'"; 
	
	db.execute(sql);
}

/*
function updateActivityLocal(activity_id, start_date, end_date, main_activity, location, frequency) 
{ 
	var sql = "UPDATE activities SET START_DATE='"+start_date.replace("'","''")+"', ";
	sql = sql + "END_DATE='"+end_date.replace("'","''")+"', ";
	sql = sql + "MAIN_ACTIVITY='"+main_activity.replace("'","''")+"', ";
	sql = sql + "LOCATION='"+location+"', ";
	sql = sql + "FREQUENCY='"+frequency.replace("'","''")+"' ";
	sql = sql + "WHERE ID='"+activity_id+"'"; 
	
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}
*/

function updateActivitySuccessStatus(activity_id, success_status)
{
	if(success_status == false) {
		var sql = "UPDATE activities SET SUCCESSFUL=0 ";
	}
	else {
		var sql = "UPDATE activities SET SUCCESSFUL=1 ";
	}
	sql = sql + "WHERE ID='"+activity_id+"'"; 
	
	db.execute(sql);
}

function updateActivityEndNotes(activity_id, end_notes)
{
	var sql = "UPDATE activities SET END_NOTES='"+end_notes+"'";
	sql = sql + "WHERE ID='"+activity_id+"'";
	db.execute(sql);
}

function updateActivityFacebookId(activity_id, facebook_id)
{
	var sql = "UPDATE activities SET FACEBOOK_ID="+facebook_id+" ";
	sql = sql + "WHERE ID='"+activity_id+"'";
	db.execute(sql);
}

function deleteActivityTableLocal()
{
	var sql = "DROP TABLE IF EXISTS activities";
	db.execute(sql);
}

function deleteActivityLocal(activity_id)
{
	deleteGoalsForActivityLocal(activity_id);
	deleteTimesForActivityLocal(activity_id);
	
	var sql = "DELETE FROM activities WHERE ID='"+activity_id+ "'";
	db.execute(sql);
}

function deleteGoalsForActivityLocal(activity_id)
{
	var sql = "DELETE FROM activity_goals WHERE ACTIVITY_ID = '"+activity_id+"'";
	db.execute(sql);
}

function deleteTimesForActivityLocal(activity_id)
{
	var sql = "DELETE FROM activity_times WHERE ACTIVITY_ID = '"+activity_id+"'";
	db.execute(sql);
}

function deleteAllActivities()
{
	deleteAllActivityGoals();
	deleteAllActivityTimes();
	
	var sql = "DELETE FROM activities";
	db.execute(sql);
}

function deleteAllActivityGoals()
{
	var sql = "DELETE FROM activity_goals";
	db.execute(sql);
}

function deleteAllActivityTimes()
{
	var sql = "DELETE FROM activity_times";
	db.execute(sql);
}