import AceQLHttpApi from 'AceQLHttpApi';
import PrepStatementParametersBuilder from 'PrepStatementParametersBuilder';
import * as AceQLTypes from 'AceQLTypes';
/**
 * Example of AceQLJS Client api
 * 
 * @author abe
 */

this.remoteConnectionBuilder = function () {
    var serverUrl = "http://localhost:9090/aceql";
    var database = "kawansoft_example";
    var username = "User1";
    var password = "password1";

    return new AceQLConnection(serverUrl, database, username, password);
};

/**
 * Example of 2 INSERT in the same transaction.
 * @param {type} connection
 * @param {type} customerId
 * @param {type} itemId
 * 
 */
this.insertCustomerAndOrderLog = function (connection, customerId, itemId) {
    connection.setAutoCommit(false);   
    
    var sql = "INSERT INTO CUSTOMER VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )";
    connection.prepareStatement(sql);
    var i = 1;
    connection.setInt(i++, customerId);
    connection.setString(i++, "Sir");
    connection.setString(i++, "Doe");
    connection.setString(i++, "John");
    connection.setString(i++, "1 Madison Ave");
    connection.setString(i++, "New York");
    connection.setString(i++, "NY 10010");
    connection.setString(i++, null);
    console.log("Execute update");
    connection.executeUpdate();
    
    connection.commit();
     console.log("update done");
    sql = "INSERT INTO ORDERLOG (customer_id, item_id, description, item_cost, date_placed, date_shipped, is_delivered, quantity) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.prepareStatement(sql);
    
    var now = new Date();
    i = 1;
    connection.setInt(i++, customerId);
    connection.setInt(i++, itemId);
    connection.setString(i++, "Item Description");
    connection.setBigDecimal(i++, 99.99);
    connection.setDate(i++, now);
    connection.setTimestamp(i++, now);
    connection.setInt(i++, 1);
    connection.setInt(i++, 2);
    console.log("insert orderlog");
    try{
    connection.executeUpdate();
    }
    catch(error) {
        console.log(error);
    }
    console.log("insert orderlog done");
    connection.commit();
    connection.setAutoCommit(true);
};

/**
 * Example of 2 SELECT
 * @param {type} connection
 * @param {type} customerId
 * @param {type} itemId
 * 
 */
this.selectCustomerAndOrderLog = function (connection, customerId, itemId) {
    var sql = "SELECT CUSTOMER_ID, FNAME, LNAME FROM CUSTOMER "
		+ " WHERE CUSTOMER_ID = ?";
    connection.prepareStatement(sql);
    connection.setInt(1, customerId);

    var rs = connection.executeQuery();
    while (rs.next()) {
        var customerId2 = rs.getInt("customer_id");
        var fname = rs.getString("fname");
        var lname = rs.getString("lname");

        console.log("");
        console.log("customer_id: " + customerId2);
        console.log("fname      : " + fname);
        console.log("lname      : " + lname);
    }

    connection.setAutoCommit(false);

    // Display the created Order
    sql = "SELECT * FROM ORDERLOG WHERE  customer_id = ? AND item_id = ? ";

    connection.prepareStatement(sql);

    var i = 1;
    connection.setInt(i++, customerId);
    connection.setInt(i++, itemId);

    rs = connection.executeQuery();

    console.log();

    if (rs.next()) {
        var customerId2 = rs.getInt("customer_id");
        var itemId2 = rs.getInt("item_id");
        var description = rs.getString("description");
        var itemCost = rs.getBigDecimal("item_cost");
        var datePlaced = rs.getDate("date_placed");
        var dateShipped = rs.getTimestamp("date_shipped");
        
        var is_delivered = (rs.getInt("is_delivered") === 1) ? true
                : false; 
        var quantity = rs.getInt("quantity");

        console.log("customer_id : " + customerId2);
        console.log("item_id     : " + itemId2);
        console.log("description : " + description);
        console.log("item_cost   : " + itemCost);
        console.log("date_placed : " + datePlaced);
        console.log("date_shipped: " + dateShipped);
        console.log("is_delivered: " + is_delivered);
        console.log("quantity    : " + quantity);       
    }
    connection.setAutoCommit(true);
};

/**
 * Delete an existing customers
 * @param {type} connection
 * @param {type} customerId
 * @returns {undefined}
 */
this.deleteCustomer = function (connection, customerId) {
	var sql = "delete from customer where customer_id = ?";
	connection.prepareStatement(sql);
	connection.setInt(1, customerId);

	connection.executeUpdate();

};


/**
 * Delete an existing order log
 * @param {type} connection
 * @param {type} customerId
 * @param {type} idemId
 * @returns {undefined}
 */
this.deleteOrderlog = function (connection, customerId, idemId) {
	var sql = "delete from orderlog where customer_id = ? and item_id = ? ";
	connection.prepareStatement(sql);
	connection.setInt(1, customerId);
	connection.setInt(2, idemId);

	connection.executeUpdate();

 };
 
function testAceQL(){
    var doDelete = true;
    var doInsert = true;
    var doSelect = true;
    var testDisconnection = true;
    console.log("*******************************************************");
    console.log("*               AceQL TESTS                          **");
    console.log("*******************************************************");
    
    var connection = this.remoteConnectionBuilder();
    
    var customerId = 1;	
    var itemId = 1;
    if(doDelete){
        console.log("deleting customer...");
                // Delete previous instances, so that user can recall class
        this.deleteCustomer(connection, customerId);
        console.log("deleting orderlog...");
        this.deleteOrderlog(connection, customerId, itemId);
    }
    if(doInsert) {
        console.log("inserting customer and orderlog...");
        this.insertCustomerAndOrderLog(connection, customerId, itemId);
    }
    if(doSelect) {
        console.log("Select cutstomer and orderlog...");
        this.selectCustomerAndOrderLog(connection, customerId, itemId);
    }
    connection.close();
    if(testDisconnection) {
        try{
            console.log("Select cutstomer and orderlog, but we are disconnected...");
            this.selectCustomerAndOrderLog(connection, customerId, itemId);
            
            console.log("Nothing returnde");
        } catch (error) {
            console.log(error);
        }
    }
    console.log("*******************************************************");
    console.log("*                  END                               **");
    console.log("*******************************************************");
}