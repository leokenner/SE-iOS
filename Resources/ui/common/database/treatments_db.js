


function initTreatmentsDBLocal()
{
	Ti.include('ui/common/database/database.js');
	
	db.execute('CREATE TABLE IF NOT EXISTS treatments (ID INTEGER PRIMARY KEY AUTOINCREMENT, CLOUD_ID TEXT, ENTRY_ID INTEGER, APPOINTMENT_ID INTEGER, START_DATE TEXT NOT NULL,END_DATE TEXT NOT NULL,MEDICATION TEXT,DOSAGE TEXT, FREQUENCY TEXT, SUCCESSFUL INTEGER, FACEBOOK_ID TEXT, FOREIGN KEY(ENTRY_ID) REFERENCES entries (ID), FOREIGN KEY(APPOINTMENT_ID) REFERENCES appointments (ID))');
	db.execute('CREATE TABLE IF NOT EXISTS treatment_symptoms (TREATMENT_ID INTEGER NOT NULL, SYMPTOM TEXT NOT NULL, FOREIGN KEY(TREATMENT_ID) REFERENCES treatments (ID))');
	db.execute('CREATE TABLE IF NOT EXISTS treatment_sideEffects (TREATMENT_ID INTEGER NOT NULL, SIDE_EFFECT TEXT NOT NULL, FOREIGN KEY(TREATMENT_ID) REFERENCES treatments (ID))');
}


//Removed quotes from entry_id and appointment_id to allow for null values
function insertTreatmentLocal(entry_id, appointment_id, start_date, end_date, medication, dosage, frequency) 
{ 
	var sql = "INSERT INTO treatments (entry_id, appointment_id, facebook_id, start_date, end_date, medication, dosage, frequency) VALUES ("; 
	sql = sql + "" + entry_id + ", ";
	sql = sql + "" + appointment_id + ", ";
	sql = sql + "" + null + ", ";
	sql = sql + "'" + start_date.replace("'", "''") + "', ";
	sql = sql + "'" + end_date.replace("'", "''") + "', ";
	sql = sql + "'" + medication.replace("'", "''") + "', ";
	sql = sql + "'" + dosage.replace("'", "''") + "', "; 
	sql = sql + "'" + frequency.replace("'", "''") + "')";
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function updateTreatmentCloudIdLocal(treatment_id, cloud_id)
{
	var sql = "UPDATE treatments SET CLOUD_ID='"+cloud_id+"' ";
	sql = sql + "WHERE ID='"+treatment_id+"'"; 
	
	db.execute(sql); 
}


function insertSymptomForTreatmentLocal(treatment_id, symptom)
{
	var sql = "INSERT INTO treatment_symptoms (treatment_id, symptom) VALUES (";
	sql = sql + "'" + treatment_id + "', ";
	sql = sql + "'" + symptom.replace("'", "''") + "')"; 
	db.execute(sql); 
	
	return db.lastInsertRowId;
}

function insertSideEffectForTreatmentLocal(treatment_id, side_effect)
{
	var sql = "INSERT INTO treatment_sideEffects (treatment_id, side_effect) VALUES (";
	sql = sql + "'" + treatment_id + "', ";
	sql = sql + "'" + side_effect.replace("'", "''") + "')"; 
	db.execute(sql); 
	
	return db.lastInsertRowId;
}

function getAllTreatmentsLocal()
{
	var sql = "SELECT * FROM treatments";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  entry_id: resultSet.fieldByName('entry_id'),
			  appointment_id: resultSet.fieldByName('appointment_id'),
		   	  start_date: resultSet.fieldByName('start_date'),
		   	  end_date: resultSet.fieldByName('end_date'),
		   	  medication: resultSet.fieldByName('medication'),
		   	  dosage: resultSet.fieldByName('dosage'),
		   	  frequency: resultSet.fieldByName('frequency'),
		   	  successful: resultSet.fieldByName('successful'),
		   	  facebook_id: resultSet.fieldByName('facebook_id'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getTreatmentsForEntryLocal(entry_id) 
{ 
	var sql = "SELECT * FROM treatments WHERE ENTRY_ID='"+entry_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  entry_id: resultSet.fieldByName('entry_id'),
			  appointment_id: resultSet.fieldByName('appointment_id'),
		   	  start_date: resultSet.fieldByName('start_date'),
		   	  end_date: resultSet.fieldByName('end_date'),
		   	  medication: resultSet.fieldByName('medication'),
		   	  dosage: resultSet.fieldByName('dosage'),
		   	  frequency: resultSet.fieldByName('frequency'),
		   	  successful: resultSet.fieldByName('successful'),
		   	  facebook_id: resultSet.fieldByName('facebook_id'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getTreatmentByCloudIdLocal(cloud_id) 
{ 
	var sql = "SELECT * FROM treatments WHERE CLOUD_ID='"+cloud_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  entry_id: resultSet.fieldByName('entry_id'),
			  appointment_id: resultSet.fieldByName('appointment_id'),
		   	  start_date: resultSet.fieldByName('start_date'),
		   	  end_date: resultSet.fieldByName('end_date'),
		   	  medication: resultSet.fieldByName('medication'),
		   	  dosage: resultSet.fieldByName('dosage'),
		   	  frequency: resultSet.fieldByName('frequency'),
		   	  successful: resultSet.fieldByName('successful'),
		   	  facebook_id: resultSet.fieldByName('facebook_id'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function getTreatmentsForAppointmentLocal(appointment_id) 
{ 
	var sql = "SELECT * FROM treatments WHERE APPOINTMENT_ID='"+appointment_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  entry_id: resultSet.fieldByName('entry_id'),
			  appointment_id: resultSet.fieldByName('appointment_id'),
		   	  start_date: resultSet.fieldByName('start_date'),
		   	  end_date: resultSet.fieldByName('end_date'),
		   	  medication: resultSet.fieldByName('medication'),
		   	  dosage: resultSet.fieldByName('dosage'),
		   	  frequency: resultSet.fieldByName('frequency'),
		   	  successful: resultSet.fieldByName('successful'),
		   	  facebook_id: resultSet.fieldByName('facebook_id'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function getTreatmentLocal(treatment_id) 
{ 
	var sql = "SELECT * FROM treatments WHERE ID='"+treatment_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  entry_id: resultSet.fieldByName('entry_id'),
			  appointment_id: resultSet.fieldByName('appointment_id'),
		   	  start_date: resultSet.fieldByName('start_date'),
		   	  end_date: resultSet.fieldByName('end_date'),
		   	  medication: resultSet.fieldByName('medication'),
		   	  dosage: resultSet.fieldByName('dosage'),
		   	  frequency: resultSet.fieldByName('frequency'),
		   	  successful: resultSet.fieldByName('successful'),
		   	  facebook_id: resultSet.fieldByName('facebook_id'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}





function getSymptomsOfTreatmentLocal(treatment_id) 
{
	var sql = "SELECT * FROM treatment_symptoms WHERE TREATMENT_ID='"+treatment_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) { 
    	results.push(resultSet.fieldByName('symptom'));
		resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getSideEffectsOfTreatmentLocal(treatment_id) 
{
	var sql = "SELECT * FROM treatment_sideEffects WHERE TREATMENT_ID='"+treatment_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) { 
    	results.push(resultSet.fieldByName('side_effect'));
		resultSet.next();
    }
    resultSet.close();		

	return results;
}


function updateTreatmentLocal(treatment_id, start_date, end_date, medication, dosage, frequency) 
{ 
	var sql = "UPDATE treatments SET START_DATE='"+start_date.replace("'","''")+"', ";
	sql = sql + "END_DATE='"+end_date.replace("'","''")+"', ";
	sql = sql + "MEDICATION='"+medication.replace("'","''")+"', ";
	sql = sql + "DOSAGE='"+dosage.replace("'","''")+"', ";
	sql = sql + "FREQUENCY='"+frequency.replace("'","''")+"' ";
	sql = sql + "WHERE ID='"+treatment_id+"'"; 
	
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function updateTreatmentFacebookId(treatment_id, facebook_id)
{
	var sql = "UPDATE treatments SET FACEBOOK_ID="+facebook_id+" ";
	sql = sql + "WHERE ID='"+treatment_id+"'";
	db.execute(sql);
}

function updateTreatmentSuccessStatus(treatment_id, success_status)
{
	if(success_status == true) {
		var sql = "UPDATE treatments SET SUCCESSFUL=1 ";
	}
	else {
		var sql = "UPDATE treatments SET SUCCESSFUL=0 ";
	}

	sql = sql + "WHERE ID='"+treatment_id+"'"; 
	
	db.execute(sql);
}

function deleteTreatmentsTableLocal()
{
	var sql = "DROP TABLE IF EXISTS treatments";
	db.execute(sql);
}


function deleteTreatmentLocal(treatment_id)
{
	deleteSymptomsForTreatmentLocal(treatment_id);
	deleteSideEffectsForTreatmentLocal(treatment_id);
	
	var sql = "DELETE FROM treatments WHERE ID='"+treatment_id+ "'";
	db.execute(sql);
}

function deleteSymptomsForTreatmentLocal(treatment_id)
{
	var sql = "DELETE FROM treatment_symptoms WHERE TREATMENT_ID = '"+treatment_id+"'";
	db.execute(sql);
}

function deleteSideEffectsForTreatmentLocal(treatment_id)
{
	var sql = "DELETE FROM treatment_sideEffects WHERE TREATMENT_ID = '"+treatment_id+"'";
	db.execute(sql);
}

function deleteAllTreatments()
{
	deleteAllTreatmentSymptoms();
	deleteAllTreatmentSideEffects();
	
	var sql = "DELETE FROM treatments";
	db.execute(sql);
}

function deleteAllTreatmentSymptoms()
{
	var sql = "DELETE FROM treatment_symptoms";
	db.execute(sql);
}

function deleteAllTreatmentSideEffects()
{
	var sql = "DELETE FROM treatment_sideEffects";
	db.execute(sql);
}