




function initIncidentsDBLocal()
{
	Ti.include('ui/common/database/database.js');
	
	db.execute('CREATE TABLE IF NOT EXISTS incidents (ID INTEGER PRIMARY KEY AUTOINCREMENT,RECORD_ID INTEGER NOT NULL, CAUSES TEXT, DATE TEXT, TIME TEXT, DURATION TEXT, FOREIGN KEY(RECORD_ID) REFERENCES records (ID))');
	db.execute('CREATE TABLE IF NOT EXISTS incident_symptoms (INCIDENT_ID INTEGER NOT NULL, SYMPTOM TEXT NOT NULL, FOREIGN KEY(INCIDENT_ID) REFERENCES incidents (ID))');

}


function insertIncidentLocal(record_id,causes, date, time, duration) 
{ 
	var sql = "INSERT INTO incidents (record_id, causes, duration, date, time) VALUES ("; 
	sql = sql + "'" + record_id + "', ";
	sql = sql + "'" + causes + "', ";
	sql = sql + "'" + duration.replace("'", "''") + "', "; 
	sql = sql + "'" + date.replace("'", "''") + "', "; 
	sql = sql + "'" + time.replace("'", "''") + "')";
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}


function insertSymptomForIncidentLocal(incident_id, symptom)
{
	var sql = "INSERT INTO incident_symptoms (incident_id, symptom) VALUES (";
	sql = sql + "'" + incident_id + "', ";
	sql = sql + "'" + symptom.replace("'", "''") + "')"; 
	db.execute(sql); 
	
	return db.lastInsertRowId;
}






function getAllIncidentsLocal()
{
	var sql = "SELECT * FROM incidents ORDER BY date ASC";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  record_id: resultSet.fieldByName('record_id'),
		   	  causes: resultSet.fieldByName('causes'),
		   	  date: resultSet.fieldByName('date'),
		   	  time: resultSet.fieldByName('time'),
		   	  duration: resultSet.fieldByName('duration'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function getIncidentLocal(incident_id) 
{ 
	var sql = "SELECT * FROM incidents WHERE ID='"+incident_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  record_id: resultSet.fieldByName('record_id'),
		   	  causes: resultSet.fieldByName('causes'),
		   	  date: resultSet.fieldByName('date'),
		   	  time: resultSet.fieldByName('time'),
		   	  duration: resultSet.fieldByName('duration'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function getSymptomsOfIncidentLocal(incident_id) 
{
	var sql = "SELECT * FROM incident_symptoms WHERE INCIDENT_ID='"+incident_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) { 
    	results.push(resultSet.fieldByName('symptom'));
		resultSet.next();
    }
    resultSet.close();		

	return results;
}






function updateIncidentLocal(incident_id, causes, date, time, duration) 
{ 
	var sql = "UPDATE incidents SET CAUSES='"+causes+"', ";
	sql = sql + "DATE='"+date.replace("'","''")+"', ";
	sql = sql + "TIME='"+time.replace("'","''")+"', ";
	sql = sql + "DURATION='"+duration+"' ";
	sql = sql + "WHERE ID='"+incident_id+"'"; 
	
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}




function deleteIncidentsTableLocal()
{
	var sql = "DROP TABLE IF EXISTS incidents";
	db.execute(sql);
}


function deleteIncidentLocal(id)
{
	var sql = "DELETE FROM incidents WHERE ID='"+id+ "'";
	db.execute(sql);
	
}

function deleteSymptomsForIncidentLocal(incident_id)
{
	var sql = "DELETE FROM incident_symptoms WHERE INCIDENT_ID = '"+incident_id+"'";
	db.execute(sql);
}