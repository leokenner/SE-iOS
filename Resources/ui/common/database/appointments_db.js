


function initAppointmentsDBLocal()
{
	Ti.include('ui/common/database/database.js');
	
	db.execute('CREATE TABLE IF NOT EXISTS appointments (ID INTEGER PRIMARY KEY AUTOINCREMENT, CLOUD_ID TEXT, ENTRY_ID INTEGER NOT NULL, DATE TEXT NOT NULL, TIME TEXT NOT NULL, DURATION_HOURS TEXT, DURATION_MINUTES TEXT, REPEAT TEXT, ALERT TEXT, STATUS TEXT, DIAGNOSIS TEXT, FINAL_DIAGNOSIS TEXT, ADDITIONAL_NOTES TEXT, CALENDAR_EVENT_ID TEXT, CREATED_AT TEXT, UPDATED_AT TEXT, FOREIGN KEY(ENTRY_ID) REFERENCES entries (ID))');
	db.execute('CREATE TABLE IF NOT EXISTS appointment_doctors (APPOINTMENT_ID INTEGER NOT NULL, NAME TEXT, LOCATION TEXT, STREET TEXT, CITY TEXT, STATE TEXT, ZIP INTEGER, COUNTRY TEXT, FOREIGN KEY(APPOINTMENT_ID) REFERENCES appointments (ID))');
	db.execute('CREATE TABLE IF NOT EXISTS appointment_symptoms (APPOINTMENT_ID INTEGER NOT NULL, SYMPTOM TEXT NOT NULL, FOREIGN KEY(APPOINTMENT_ID) REFERENCES appointments (ID))');
}


function insertAppointmentLocal(entry_id, date, time, created_at, updated_at) 
{ 
	Ti.include('ui/common/helpers/dateTime.js');
	var json_date = generateJsonDateString();
	if(!created_at) created_at = json_date;
	if(!updated_at) updated_at = json_date;
	
	var sql = "INSERT INTO appointments (entry_id, date, time, created_at, updated_at) VALUES ("; 
	sql = sql + "" + entry_id + ", ";
	sql = sql + "'" + date.replace("'", "''") + "', ";
	sql = sql + "'" + time.replace("'", "''") + "', ";
	sql = sql + "'" + created_at + "', ";	 
	sql = sql + "'" + updated_at + "')";
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}


function updateAppointmentCloudIdLocal(appointment_id, cloud_id)
{
	var sql = "UPDATE appointments SET CLOUD_ID='"+cloud_id+"' ";
	sql = sql + "WHERE ID='"+appointment_id+"'"; 
	
	db.execute(sql); 
}


function insertDoctorForAppointmentLocal(appointment_id, name, location, street, city, state, zip, country) 
{ 
	var sql = "INSERT INTO appointment_doctors (appointment_id, name, location, street, city, state, zip, country) VALUES ("; 
	sql = sql + "'" + appointment_id + "', ";
	sql = sql + "'" + name.replace("'", "''") + "', ";
	sql = sql + "'" + location + "', ";
	sql = sql + "'" + street + "', ";
	sql = sql + "'" + city + "', ";
	sql = sql + "'" + state + "', ";
	sql = sql + "'" + zip + "', "; 	 
	sql = sql + "'" + country + "')";
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function insertSymptomForAppointmentLocal(appointment_id, symptom)
{
	var sql = "INSERT INTO appointment_symptoms (appointment_id, symptom) VALUES (";
	sql = sql + "'" + appointment_id + "', ";
	sql = sql + "'" + symptom.replace("'", "''") + "')"; 
	db.execute(sql); 
	
	return db.lastInsertRowId;
}


function getAppointmentResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  entry_id: resultSet.fieldByName('entry_id'),
		   	  diagnosis: resultSet.fieldByName('diagnosis'),
		   	  final_diagnosis: resultSet.fieldByName('final_diagnosis'),
		   	  status: resultSet.fieldByName('status'),
		   	  date: resultSet.fieldByName('date'),
		   	  time: resultSet.fieldByName('time'),
		   	  duration: { 
		   	  	hours: parseInt(resultSet.fieldByName('duration_hours')),
		   	  	minutes: parseInt(resultSet.fieldByName('duration_minutes')),
		   	  },
		   	  repeat: resultSet.fieldByName('repeat'),
		   	  alert: resultSet.fieldByName('alert'),
		   	  calendar_event_id: resultSet.fieldByName('calendar_event_id'),
		   	  additional_notes: resultSet.fieldByName('additional_notes'),
		   	  created_at: resultSet.fieldByName('created_at'),
		   	  updated_at: resultSet.fieldByName('updated_at'),
	        });
	        
	resultSet.next();
    }
    resultSet.close();
    
    for(var i=0; i < results.length; i++) {
    	results[i].doctor = getDoctorByAppointmentLocal(results[i].id)[0];
    	results[i].symptoms = getSymptomsOfAppointmentLocal(results[i].id);
    }
    
    return results;	
}

function getAppointmentStatusResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
		   	  status: resultSet.fieldByName('status'),
		   	  additional_notes: resultSet.fieldByName('additional_notes'),
	        });
	        
	resultSet.next();
    }
    resultSet.close();
    
    return results;	
}

function getAppointmentMainResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
		   	  date: resultSet.fieldByName('date'),
		   	  time: resultSet.fieldByName('time'),
		   	  duration: { 
		   	  	hours: parseInt(resultSet.fieldByName('duration_hours')),
		   	  	minutes: parseInt(resultSet.fieldByName('duration_minutes')),
		   	  },
		   	  repeat: resultSet.fieldByName('repeat'),
		   	  alert: resultSet.fieldByName('alert'),
		   	  calendar_event_id: resultSet.fieldByName('calendar_event_id'),
	        });
	        
	resultSet.next();
    }
    resultSet.close();
    
    for(var i=0; i < results.length; i++) {
    	results[i].doctor = getDoctorByAppointmentLocal(results[i].id)[0];
    	results[i].symptoms = getSymptomsOfAppointmentLocal(results[i].id);
    }
    
    return results;	
}

function getAllAppointmentsLocal()
{
	var sql = "SELECT * FROM appointments ORDER BY date ASC";
	
	var results = [];
	var resultSet = db.execute(sql);
    	
	return getAppointmentResultSet(resultSet, results);
}


function getAppointmentsForEntryLocal(entry_id) 
{ 
	var sql = "SELECT * FROM appointments WHERE ENTRY_ID='"+entry_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);	

	return getAppointmentResultSet(resultSet, results);
}


function getAppointmentByCloudIdLocal(cloud_id) 
{ 
	var sql = "SELECT * FROM appointments WHERE CLOUD_ID='"+cloud_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);

	return getAppointmentResultSet(resultSet, results);
}


function getAppointmentLocal(appointment_id) 
{ 
	var sql = "SELECT * FROM appointments WHERE ID='"+appointment_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);

	return getAppointmentResultSet(resultSet, results);
}

function getAppointmentStatusDetailsLocal(appointment_id) 
{ 
	var sql = "SELECT * FROM appointments WHERE ID='"+appointment_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);

	return getAppointmentStatusResultSet(resultSet, results);
}

function getAppointmentMainDetailsLocal(appointment_id) 
{ 
	var sql = "SELECT * FROM appointments WHERE ID='"+appointment_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);

	return getAppointmentMainResultSet(resultSet, results);
}

function getDoctorByAppointmentLocal(appointment_id) 
{
	var sql = "SELECT * FROM appointment_doctors WHERE APPOINTMENT_ID='"+appointment_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  appointment_id: resultSet.fieldByName('appointment_id'),
			  name: resultSet.fieldByName('name'),
			  location: resultSet.fieldByName('location'),
		      street: resultSet.fieldByName('street'),
		      city: resultSet.fieldByName('city'),
		   	  state: resultSet.fieldByName('state'),
		   	  zip: resultSet.fieldByName('zip'),
		   	  country: resultSet.fieldByName('country'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function getSymptomsOfAppointmentLocal(appointment_id) 
{
	var sql = "SELECT * FROM appointment_symptoms WHERE APPOINTMENT_ID='"+appointment_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) { 
    	results.push(resultSet.fieldByName('symptom'));
		resultSet.next();
    }
    resultSet.close();		

	return results;
}

function updateAppointmentLocal(appointment_id, column, data)
{
	
	var intRegex = /^\d+$/;
	if(intRegex.test(data)) {}   //The replacing quotes function throws an error if you use it on an integer
	else { data = data.replace("'","''"); }
	
	var sql = "UPDATE appointments SET "+column+"='"+data+"' ";
	sql = sql + "WHERE ID='"+appointment_id+"'"; 
	
	db.execute(sql);
}

function updateDoctorForAppointmentLocal(id, name, location, street, city ,state, zip, country) 
{ 
	var sql = "UPDATE appointment_doctors SET NAME='"+name.replace("'","''")+"', ";
	sql = sql + "LOCATION='"+location+"', ";
	sql = sql + "STREET='"+street+"', ";
	sql= sql + "CITY='"+city+"', ";
	sql= sql + "STATE='"+state+"', ";
	sql= sql + "ZIP='"+zip+"', ";
	sql = sql + "COUNTRY='"+country+"' "; 
	sql = sql + "WHERE APPOINTMENT_ID='"+id+"'"; 
	
	db.execute(sql); 
	
	return db.rowsAffected; 
}

function updateAppointmentStatus(appointment_id, status)
{
	var sql = "UPDATE appointments SET STATUS='"+status+"'";
	//var sql = "UPDATE appointments SET COMPLETE=0 ";

	sql = sql + "WHERE ID='"+appointment_id+"'"; 
	
	db.execute(sql);
}


function deleteAppointmentsTableLocal()
{
	var sql = "DROP TABLE IF EXISTS appointments";
	db.execute(sql);
}


function deleteAppointmentLocal(id)
{
	var activities = getActivitiesForAppointmentLocal(id);
	for(x in activities) {
		deleteActivityLocal(activities[x].id);
	}
	var treatments = getTreatmentsForAppointmentLocal(id);
	for(x in treatments) {
		deleteTreatmentLocal(treatments[x].id)
	}
	
	deleteDoctorForAppointmentLocal(id);
	deleteSymptomsForAppointmentLocal(id);
	
	var sql = "DELETE FROM appointments WHERE ID='"+id+ "'";
	db.execute(sql);
}

function deleteDoctorForAppointmentLocal(appointment_id)
{
	var sql = "DELETE FROM appointment_doctors WHERE APPOINTMENT_ID = '"+appointment_id+"'";
	db.execute(sql);
}

function deleteSymptomsForAppointmentLocal(appointment_id)
{
	var sql = "DELETE FROM appointment_symptoms WHERE APPOINTMENT_ID = '"+appointment_id+"'";
	db.execute(sql);
}

function deleteAllAppointments()
{
	deleteAllAppointmentDoctors();
	deleteAllAppointmentSymptoms();
	
	var sql = "DELETE FROM appointments";
	db.execute(sql);
}

function deleteAllAppointmentDoctors()
{
	var sql = "DELETE FROM appointment_doctors";
	db.execute(sql);
}

function deleteAllAppointmentSymptoms()
{
	var sql = "DELETE FROM appointment_symptoms";
	db.execute(sql);
}