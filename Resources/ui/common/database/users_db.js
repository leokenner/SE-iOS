


function initUsersDBLocal()
{ 
	db.execute('CREATE TABLE IF NOT EXISTS users (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, CLOUD_ID TEXT, FIRST_NAME TEXT NOT NULL, LAST_NAME TEXT NOT NULL, EMAIL TEXT)'); 
}

function insertUserLocal(cloud_id,first_name, last_name) 
{ 	
	var sql = "INSERT INTO users (cloud_id, first_name, last_name) VALUES ("; 
	sql = sql + "" + cloud_id + ", ";
	sql = sql + "'" + first_name.replace("'", "''") + "', "; 	 
	sql = sql + "'" + last_name.replace("'", "''") + "')"; 
	db.execute(sql); 
	
	return db.lastInsertRowId; 
	
}

function updateUserLocal(id, first_name, last_name, email)
{
	var sql = "UPDATE users SET FIRST_NAME='"+first_name.replace("'", "''");    
	sql = sql + "', LAST_NAME='"+last_name.replace("'","''");
	sql = sql + "', EMAIL='"+email;
	sql = sql + "' WHERE ID='"+id+"'";
	
	db.execute(sql);
}

function getAllUsersLocal() 
{
	var sql = "SELECT * FROM users";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		      cloud_id: resultSet.fieldByName('cloud_id'),
		   	  first_name: resultSet.fieldByName('first_name'),
		   	  last_name: resultSet.fieldByName('last_name'),
		   	  email: resultSet.fieldByName('email'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}


function getUserLocal(id) 
{
	var sql = "SELECT * FROM users WHERE ID='"+id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      id: resultSet.fieldByName('id'),
		      cloud_id: resultSet.fieldByName('cloud_id'),
		   	  first_name: resultSet.fieldByName('first_name'),
		   	  last_name: resultSet.fieldByName('last_name'),
		   	  email: resultSet.fieldByName('email'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function deleteUserLocal(cloud_id)
{
	var sql = "DELETE FROM users WHERE CLOUD_ID='"+cloud_id+ "'";
	db.execute(sql);
}

function deleteAllUsers()
{
	var sql = "DELETE FROM users";
	db.execute(sql);
}