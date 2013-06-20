




function initEntriesDBLocal()
{
	Ti.include('ui/common/database/database.js');
	
	db.execute('CREATE TABLE IF NOT EXISTS entries (ID INTEGER PRIMARY KEY AUTOINCREMENT,CLOUD_ID TEXT, RECORD_ID INTEGER NOT NULL, MAIN_ENTRY TEXT NOT NULL, DATE TEXT, TIME TEXT, FOREIGN KEY(RECORD_ID) REFERENCES records (ID))');
	

}


function insertEntryLocal(record_id, main_entry, date, time) 
{ 
	var sql = "INSERT INTO entries (record_id, main_entry, date, time) VALUES ("; 
	sql = sql + "'" + record_id + "', ";
	sql = sql + "'" + main_entry.replace("'", "''") + "', "; 
	sql = sql + "'" + date.replace("'", "''") + "', "; 
	sql = sql + "'" + time.replace("'", "''") + "')";
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function updateEntryCloudIdLocal(entry_id, cloud_id)
{
	var sql = "UPDATE entries SET CLOUD_ID='"+cloud_id+"' ";
	sql = sql + "WHERE ID='"+entry_id+"'"; 
	
	db.execute(sql); 
}


function getEntryResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
			  id: resultSet.fieldByName('id'),
			  cloud_id: resultSet.fieldByName('cloud_id'),
			  record_id: resultSet.fieldByName('record_id'),
		   	  main_entry: resultSet.fieldByName('main_entry'),
		   	  date: resultSet.fieldByName('date'),
		   	  time: resultSet.fieldByName('time'),
	        });
	resultSet.next();
    }
    resultSet.close();
    
    return results;
}


function getAllEntriesLocal()
{
	var sql = "SELECT * FROM entries ORDER BY date ASC";
	
	var results = [];
	var resultSet = db.execute(sql);	

	return getEntryResultSet(resultSet, results);
}


function getEntryLocal(entry_id) 
{ 
	var sql = "SELECT * FROM entries WHERE ID='"+entry_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getEntryResultSet(resultSet, results);
}

function getEntryByCloudIdLocal(cloud_id) 
{ 
	var sql = "SELECT * FROM entries WHERE CLOUD_ID='"+cloud_id+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getEntryResultSet(resultSet, results);
}

function getEntryBy(column, data)
{
	var sql = "SELECT * FROM entries WHERE "+column+"='"+data+"'"; 
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getEntryResultSet(resultSet, results);
}



function updateEntryLocal(entry_id, column, data) 
{ 
	var intRegex = /^\d+$/;
	if(intRegex.test(data)) {}   //The replacing quotes function throws an error if you use it on an integer
	else { data = data.replace("'","''"); }
	
	var sql = "UPDATE entries SET "+column+"='"+data+"' ";
	sql = sql + "WHERE ID='"+entry_id+"'"; 
	
	db.execute(sql); 
}


function deleteAllEntries()
{
	var sql = "DELETE FROM entries";
	db.execute(sql);
}


function deleteEntriesTableLocal()
{
	var sql = "DROP TABLE IF EXISTS entries";
	db.execute(sql);
}


function deleteEntryLocal(id)
{
	var sql = "DELETE FROM entries WHERE ID='"+id+ "'";
	db.execute(sql);
	
}
