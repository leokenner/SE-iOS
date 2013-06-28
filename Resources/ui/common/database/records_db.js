



function initRecordsDBLocal()
{
	Ti.include('ui/common/database/database.js');
	
	db.execute('CREATE TABLE IF NOT EXISTS records (ID INTEGER PRIMARY KEY AUTOINCREMENT, CLOUD_ID TEXT, CHILD_ID INTERGER NOT NULL, CREATED_AT TEXT, UPDATED_AT TEXT, FOREIGN KEY(CHILD_ID) REFERENCES children (ID))');
}

function insertRecordLocal(child_id, created_at, updated_at)
{
	Ti.include('ui/common/helpers/dateTime.js');
	var json_date = generateJsonDateString();
	if(!created_at) created_at = json_date;
	if(!updated_at) updated_at = json_date;
	
	var sql = "INSERT INTO records (child_id, created_at, updated_at) VALUES ("; 
	sql = sql + "'" + child_id + "', ";
	sql = sql + "'" + created_at + "', ";
	sql = sql + "'" + updated_at + "')";	 
	db.execute(sql); 
	
	return db.lastInsertRowId;
}

function getRecordResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  child_id: resultSet.fieldByName('child_id'),
		   	  created_at: resultSet.fieldByName('created_at'),
		   	  updated_at: resultSet.fieldByName('updated_at'),
	        });
	resultSet.next();
    }
    resultSet.close();
    
    return results;
}

function getRecordMainResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
	        });
	resultSet.next();
    }
    resultSet.close();
    
    return results;
}

function updateRecordCloudIdLocal(record_id, cloud_id)
{
	var sql = "UPDATE records SET CLOUD_ID='"+cloud_id+"' ";
	sql = sql + "WHERE ID='"+record_id+"'"; 
	
	db.execute(sql); 
}

function updateRecordLocal(record_id, column, data)
{
	var intRegex = /^\d+$/;
	if(intRegex.test(data)) {}   //The replacing quotes function throws an error if you use it on an integer
	else { data = data.replace("'","''"); }
	
	var sql = "UPDATE records SET "+column+"='"+data+"' ";
	sql = sql + "WHERE ID='"+record_id+"'"; 
	
	db.execute(sql);
}

function updateRecordTimesForEntryLocal(current, updated_at) 
{ 
	var sql = "UPDATE records SET ";
	sql = sql + "UPDATED_AT='"+latest_time+"' ";
	sql = sql + "WHERE CURRENT='"+current+"'"; 
	
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function getAllRecordsLocal() 
{ 
	var sql = "SELECT * FROM records";   
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getRecordResultSet(resultSet, results);
}


function getRecordsForChildLocal(child_id) 
{ 
	var sql = "SELECT * FROM records WHERE CHILD_ID='"+child_id+"' ORDER BY updated_at DESC";  //Order by most recent first 
	
	var results = [];
	var resultSet = db.execute(sql);	

	return getRecordResultSet(resultSet, results);
}

function getRecordLocal(id) 
{ 
	var sql = "SELECT * FROM records WHERE ID='"+id+"'";   
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getRecordResultSet(resultSet, results);
}

function getRecordMainDetailsLocal(id) 
{ 
	var sql = "SELECT * FROM records WHERE ID='"+id+"'";   
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getRecordMainResultSet(resultSet, results);
}

function getRecordByCloudIdLocal(cloud_id) 
{ 
	var sql = "SELECT * FROM records WHERE CLOUD_ID='"+cloud_id+"'";   
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getRecordResultSet(resultSet, results);
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
