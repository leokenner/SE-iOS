

function initChildrenDBLocal()
{ 
	db.execute('CREATE TABLE IF NOT EXISTS children (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, CLOUD_ID TEXT, USER_ID TEXT NOT NULL, FIRST_NAME TEXT, LAST_NAME TEXT, SEX TEXT, DATE_OF_BIRTH TEXT, DIAGNOSIS TEXT, FOREIGN KEY(USER_ID) REFERENCES users (ID))');
}


function insertChildLocal(user_id, first_name, last_name, sex, date_of_birth, diagnosis) 
{ 
	var sql = "INSERT INTO children (user_id, first_name, last_name, sex, date_of_birth, diagnosis) VALUES ("; 
	sql = sql + "'" + user_id + "', "; 	 
	sql = sql + "'" + first_name.replace("'", "''") + "', ";
	sql = sql + "'" + last_name.replace("'", "''") + "', "; 	
	sql = sql + "" + sex + ", ";
	sql = sql + "" + date_of_birth + ", "; 
	sql = sql + "" + diagnosis + ")";
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function updateChildCloudIdLocal(id, cloud_id)
{
	var sql = "UPDATE children SET CLOUD_ID='"+cloud_id.replace("'", "''");    
	sql = sql + "' WHERE ID='"+id+"'";
	
	db.execute(sql);
}


function getAllChildrenLocal()
{
	var sql = "SELECT * FROM children";
	
	var results = [];
	var resultSet = db.execute(sql);
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
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getChildLocal(id) { 
	var sql = "SELECT * FROM children WHERE ID='"+id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
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
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getChildByCloudIdLocal(cloud_id) { 
	var sql = "SELECT * FROM children WHERE CLOUD_ID='"+cloud_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
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
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function getChildByNameLocal(first_name, last_name) { 
	var sql = "SELECT * FROM children WHERE FIRST_NAME='"+first_name+"' AND LAST_NAME='"+last_name+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
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
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function getChildByCloudId(cloud_id)
{
	var sql = "SELECT * FROM children WHERE CLOUD_ID='"+cloud_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
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
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function updateChildLocal(id,first_name,last_name,sex,date_of_birth,diagnosis)
{
	var sql = "UPDATE children SET FIRST_NAME='"+first_name.replace("'", "''");    
	sql = sql + "', LAST_NAME='"+last_name.replace("'","''");
	sql = sql + "', SEX='"+sex;
	sql = sql + "', DATE_OF_BIRTH='"+date_of_birth;
	sql = sql + "', DIAGNOSIS='"+diagnosis;
	sql = sql + "' WHERE ID='"+id+"'";
	
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

function deleteAllChildren()
{
	var sql = "DELETE FROM children";
	db.execute(sql);
}
