

function initChildrenDBLocal()
{ 
	db.execute('CREATE TABLE IF NOT EXISTS children (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, CLOUD_ID TEXT, USER_ID TEXT NOT NULL, FIRST_NAME TEXT, LAST_NAME TEXT, SEX TEXT, DATE_OF_BIRTH TEXT, DIAGNOSIS TEXT, CREATED_AT TEXT, UPDATED_AT TEXT, FOREIGN KEY(USER_ID) REFERENCES users (ID))');
}


function insertChildLocal(user_id, first_name, last_name, sex, date_of_birth, diagnosis, created_at, updated_at) 
{
	Ti.include('ui/common/helpers/dateTime.js');
	var json_date = generateJsonDateString();
	if(!created_at) created_at = json_date;
	if(!updated_at) updated_at = json_date;
	 
	var sql = "INSERT INTO children (user_id, first_name, last_name, sex, date_of_birth, diagnosis, created_at, updated_at) VALUES ("; 
	sql = sql + "'" + user_id + "', "; 	 
	sql = sql + "'" + first_name.replace("'", "''") + "', ";
	sql = sql + "'" + last_name.replace("'", "''") + "', "; 	
	sql = sql + "" + sex + ", ";
	sql = sql + "" + date_of_birth + ", ";
	sql = sql + "" + diagnosis + ", ";
	sql = sql + "'" + created_at + "', "; 
	sql = sql + "'" + updated_at + "')";
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function updateChildCloudIdLocal(id, cloud_id)
{
	var sql = "UPDATE children SET CLOUD_ID='"+cloud_id.replace("'", "''");    
	sql = sql + "' WHERE ID='"+id+"'";
	
	db.execute(sql);
}

function getChildrenResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		      cloud_id: resultSet.fieldByName('cloud_id'),
		      user_id: resultSet.fieldByName('user_id'),
		   	  first_name: resultSet.fieldByName('first_name'),
		   	  last_name: resultSet.fieldByName('last_name'),
		   	  sex: resultSet.fieldByName('sex'),
		   	  date_of_birth: resultSet.fieldByName('date_of_birth'),
		   	  diagnosis: resultSet.fieldByName('diagnosis'),
		   	  created_at: resultSet.fieldByName('created_at'),
		   	  updated_at: resultSet.fieldByName('updated_at'),
	        });
	resultSet.next();
    }
    resultSet.close();
    
    for(var i=0;i < results.length; i++) {
    	results[i].relationships = getRelationsToChildLocal(results[i].id);
    }
    
    return results;
}

function getChildrenMainResultSet(resultSet, results)
{
	while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		      cloud_id: resultSet.fieldByName('cloud_id'),
		   	  first_name: resultSet.fieldByName('first_name'),
		   	  last_name: resultSet.fieldByName('last_name'),
		   	  sex: resultSet.fieldByName('sex'),
		   	  date_of_birth: resultSet.fieldByName('date_of_birth'),
		   	  diagnosis: resultSet.fieldByName('diagnosis'),
	        });
	resultSet.next();
    }
    resultSet.close();
    
    for(var i=0;i < results.length; i++) {
    	results[i].relationships = getRelationsToChildLocal(results[i].id);
    	for(var j=0;j < results[i].relationships.length; j++) {
    		results[i].relationships[j].user_id = getUserLocal(results[i].relationships[j].user_id)[0].cloud_id;
    	}
    }
    
    return results;
}

function getAllChildrenLocal()
{
	var sql = "SELECT * FROM children";
	
	var results = [];
	var resultSet = db.execute(sql);
    
	return getChildrenResultSet(resultSet, results);
}

function getChildLocal(id) { 
	var sql = "SELECT * FROM children WHERE ID='"+id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getChildrenResultSet(resultSet, results);
}

function getChildMainDetailsLocal(id) { 
	var sql = "SELECT * FROM children WHERE ID='"+id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getChildrenMainResultSet(resultSet, results);
}

function getChildByCloudIdLocal(cloud_id) { 
	var sql = "SELECT * FROM children WHERE CLOUD_ID='"+cloud_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getChildrenResultSet(resultSet, results);
}

function getChildByUserIdLocal(user_id)
{
	var sql = "SELECT * FROM children WHERE USER_ID='"+user_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getChildrenResultSet(resultSet, results);
}

function getChildByNameLocal(first_name, last_name) { 
	var sql = "SELECT * FROM children WHERE FIRST_NAME='"+first_name+"' AND LAST_NAME='"+last_name+"'";
	
	var results = [];
	var resultSet = db.execute(sql);		

	return getChildrenResultSet(resultSet, results);
}

function updateChildLocal(child_id, column, data)
{
	var intRegex = /^\d+$/;
	if(intRegex.test(data)) {}   //The replacing quotes function throws an error if you use it on an integer
	else { data = data.replace("'","''"); }
	
	var sql = "UPDATE children SET "+column+"='"+data+"' ";
	sql = sql + "WHERE ID='"+child_id+"'"; 
	
	db.execute(sql);
}

function updateChildCloudIdLocal(id, cloud_id) 
{
	var sql = "UPDATE children SET CLOUD_ID='"+cloud_id.replace("'", "''");    
	sql = sql + "' WHERE ID='"+id+"'";
	
	db.execute(sql);
}

function deleteChildByUserIdLocal(user_id)
{
	var sql = "DELETE FROM children WHERE USER_ID='"+user_id+ "'";
	db.execute(sql);
}

function deleteChildLocal(id)
{
	var records = getRecordsForChildLocal(id);
	for(x in records) {
		deleteRecordLocal(records[x].id);
	}
	
	var sql = "DELETE FROM children WHERE ID='"+id+ "'";
	db.execute(sql);
}

function deleteAllChildren()
{
	var sql = "DELETE FROM children";
	db.execute(sql);
}
