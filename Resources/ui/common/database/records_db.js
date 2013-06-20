



function initRecordsDBLocal()
{
	Ti.include('ui/common/database/database.js');
	
	db.execute('CREATE TABLE IF NOT EXISTS records (ID INTEGER PRIMARY KEY AUTOINCREMENT, CLOUD_ID TEXT, CHILD_ID INTERGER NOT NULL, CURRENT INTEGER, CURRENT_TYPE TEXT, LATEST_DATE TEXT, LATEST_TIME TEXT, FOREIGN KEY(CHILD_ID) REFERENCES children (ID))');
}

function insertRecordLocal(child_id, current, latest_date, latest_time, current_type)
{
	var sql = "INSERT INTO records (child_id, current, latest_date, latest_time, current_type) VALUES ("; 
	sql = sql + "'" + child_id + "', ";
	sql = sql + "'" + current + "', ";
	sql = sql + "'" + latest_date + "', ";
	sql = sql + "'" + latest_time + "', ";	 
	sql = sql + "'" + current_type + "')";
	db.execute(sql); 
	
	return db.lastInsertRowId;
}

function updateRecordCloudIdLocal(record_id, cloud_id)
{
	var sql = "UPDATE records SET CLOUD_ID='"+cloud_id+"' ";
	sql = sql + "WHERE ID='"+record_id+"'"; 
	
	db.execute(sql); 
}

function updateRecordLocal(record_id, current, current_type, latest_date, latest_time) 
{ 
	var sql = "UPDATE records SET CURRENT='"+current+"', ";
	sql = sql + "LATEST_DATE='"+latest_date.replace("'","''")+"', ";
	sql = sql + "LATEST_TIME='"+latest_time+"', ";
	sql = sql + "CURRENT_TYPE='"+current_type+"' ";
	sql = sql + "WHERE ID='"+record_id+"'"; 
	
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function updateRecordTimesForEntryLocal(current, latest_date, latest_time) 
{ 
	var sql = "UPDATE records SET ";
	sql = sql + "LATEST_DATE='"+latest_date.replace("'","''")+"', ";
	sql = sql + "LATEST_TIME='"+latest_time+"' ";
	sql = sql + "WHERE CURRENT='"+current+"'"; 
	
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function getAllRecordsLocal() 
{ 
	var sql = "SELECT * FROM records";   
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  child_id: resultSet.fieldByName('child_id'),
		   	  current: resultSet.fieldByName('current'),
		   	  current_type: resultSet.fieldByName('current_type'),
		   	  latest_date: resultSet.fieldByName('latest_date'),
		   	  latest_time: resultSet.fieldByName('latest_time'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function getRecordsForChildLocal(child_id) 
{ 
	var sql = "SELECT * FROM records WHERE CHILD_ID='"+child_id+"' ORDER BY latest_date, latest_time DESC";  //Order by most recent first 
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  child_id: resultSet.fieldByName('child_id'),
		   	  current: resultSet.fieldByName('current'),
		   	  current_type: resultSet.fieldByName('current_type'),
		   	  latest_date: resultSet.fieldByName('latest_date'),
		   	  latest_time: resultSet.fieldByName('latest_time'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getRecordLocal(id) 
{ 
	var sql = "SELECT * FROM records WHERE ID='"+id+"'";   
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  child_id: resultSet.fieldByName('child_id'),
		   	  current: resultSet.fieldByName('current'),
		   	  current_type: resultSet.fieldByName('current_type'),
		   	  latest_date: resultSet.fieldByName('latest_date'),
		   	  latest_time: resultSet.fieldByName('latest_time'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getRecordByCloudIdLocal(cloud_id) 
{ 
	var sql = "SELECT * FROM records WHERE CLOUD_ID='"+cloud_id+"'";   
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  child_id: resultSet.fieldByName('child_id'),
		   	  current: resultSet.fieldByName('current'),
		   	  current_type: resultSet.fieldByName('current_type'),
		   	  latest_date: resultSet.fieldByName('latest_date'),
		   	  latest_time: resultSet.fieldByName('latest_time'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function deleteRecordLocal(id)
{
	var sql = "DELETE FROM records WHERE ID='"+id+ "'";
	db.execute(sql);
}

function deleteRecordsByCloudIdLocal(cloud_id)
{
	var sql = "DELETE FROM records WHERE CLOUD_ID='"+cloud_id+ "'";
	db.execute(sql);
}

function deleteAllRecords()
{
	var sql = "DELETE FROM records";
	db.execute(sql);
}
