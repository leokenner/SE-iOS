

function initRelationshipsDBLocal()
{ 
	db.execute('CREATE TABLE IF NOT EXISTS relationships (CHILD_ID INTEGER NOT NULL, USER_ID INTEGER NOT NULL,RELATION TEXT, FOREIGN KEY(USER_ID) REFERENCES users (ID), FOREIGN KEY(CHILD_ID) REFERENCES children (ID))');
}


function insertRelationshipLocal(child_id,user_id, relation) 
{ 
	var sql = "INSERT INTO relationships (child_id, user_id, relation) VALUES ("; 
	sql = sql + "'" + child_id + "', ";
	sql = sql + "'" + user_id + "', "; 	 
	sql = sql + "'" + relation + "')"; 
	db.execute(sql); 
	
	return db.lastInsertRowId; 
}

function updateRelationshipLocal(child_id,user_id, relation) 
{ 
	var sql = "UPDATE relationships SET relation='";
	sql = sql + relation + "' WHERE CHILD_ID='";
	sql = sql + child_id+ "' AND USER_ID='";
	sql = sql + user_id+ "'"; 

	db.execute(sql);	 
}

function getRelationshipLocal(user_id,child_id) 
{ 
	if(!user_id || !child_id) { return; }
	var sql = "SELECT relation FROM relationships WHERE USER_ID='"+user_id+"' AND CHILD_ID='";
	sql = sql + child_id + "'";
	var result = db.execute(sql);
	result = result.fieldByName('relation');
	
	return result; 
}

function getRelationsToChildLocal(child_id)
{
	var sql = "SELECT * FROM relationships WHERE CHILD_ID='"+child_id+"'";
	
	var results = [];
	var resultSet = db.execute(sql);
    while (resultSet.isValidRow()) {
			results.push({
		      user_id: resultSet.fieldByName('user_id'),
		   	  relation: resultSet.fieldByName('relation'),
	        });
	resultSet.next();
    }
    resultSet.close();		

	return results;
}

function deleteRelationshipsToUser(user_id)
{
	var sql = "DELETE FROM relationships WHERE USER_ID='"+user_id+ "'";
	db.execute(sql);
}

function deleteAllRelationships()
{
	var sql = "DELETE FROM relationships";
	db.execute(sql);
}
