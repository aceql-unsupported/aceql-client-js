# AceQL HTTP 2.0 - JavaScript Client SDK
<img src="https://www.aceql.com/favicon.png" alt=""/>

# Fundamentals

This document describes how to use the AceQL SDK / module and gives some details about how it operates with the AceQL Server side.

The AceQL SDK / module allows you to wrap the [AceQL HTTP APIs](https://github.com/kawansoft/aceql-http/blob/master/aceql-http-2.0-user-guide-api.md)  to access remote SQL databases and/or SQL databases in the cloud by simply including JDBC like SQL calls in your code. 

The AceQL Server operation is described in [AceQL HTTP Server Installation and Configuration Guide](https://github.com/kawansoft/aceql-http/blob/master/aceql-http-2.0-user-guide-server.md), whose content is sometimes referred to in his User Guide.

On the remote side, like the AceQL Server access to the SQL database using Java JDBC, we will sometimes use the JDBC terminology (ResultSet, etc.) in this document. Nevertheless, knowledge of Java or JDBC is *not* a requirement.

## JavaScript Versions

The SDK supports ECMAScript versions 5 to 8.

## AceQL Server side compatibility

This 2.0 SDK version is compatible with AceQL HTTP server side v2.0. It is not compatible with AceQL HTTP server side v1.0.

## Installation

`npm install aceql-client`

## Data transport

HTTP requests parameters are transported in UTF-8 format and JSON format is used for data and class  transport

All requests are streamed:

- Output requests (from the client side)  are streamed directly from the socket to the server to avoid buffering any     content body
- Input responses (for the client side)   are streamed directly from the socket to the server to efficiently read     .the response body

## Best practices for fast response time

Every HTTP exchange between the client and server side is time-consuming, because the HTTP call is synchronous and waits for the server's response

Try to avoid coding SQL calls inside loops, as this can reduce execution speed. Each SQL call will send an http request and wait for the response from the server.

Note that AceQL is optimized as much as possible. A SELECT call returning a huge data volume will not consume memory on the server or client side:  AceQL uses input stream and output stream I/O for data  transfer.

Server JDBC ResultSet retrieval is as fast as possible :

- The ResultSet creation is done once on the server by the executeQuery.


- The rows are all dumped at once on the servlet output stream by the server


- The client side gets the ResultSet content as a file.

All data reading commands are executed locally on the client side with forward-only reading.

## Datatypes

The main server side JDBC data types for columns are supported:

`Boolean`, `Blob/Clob`, `Integer`, `Short`, `Double`,  `Float`, `BigDecimal`, `Long`, `String`, `Date`, `Time`, and `Timestamp`.

Note that the AceQL module does not allow you to specify data types to use; data types are implicitly chosen by the module.

Parameter values are automatically converted to their SQL equivalent. 

## Quickstart

To use the module, just create a `AceQLConnection` object that represents the database:

```javascript
    // The URL of the AceQL Server servlet
    // Port number is the port number used to start the Web Server:
 	var serverUrl = "http://localhost:9090/aceql";
    
    // The remote database to use:
    var database = "kawansoft_example";
    
   // (username, password) for authentication on server side.
    var username = "User1";
    var password = "password1";

   // Attempt to establish a connection to the remote database:
    var connection = new AceQLConnection(serverUrl, database, username, password);
```

The schema of the database is here:  [kawansoft_example](https://www.aceql.com/rest/soft/2.0/src/kawansoft_example_other_databases.txt)

From now on, you can use the `AceQLConnection` to execute updates and queries on the remote database, using standard JDBC like calls:

Following sample shows how to insert a new customer in the CUSTOMER table:

```javascript
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
    connection.executeUpdate();
```

Following sample shows how to execute read data from remote database:

```javascript
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
```

At end of our session, it is highly recommended to close the `AceQLConnection `:

```javascript
// Make sure connection is always closed in order to close and release
// server connection into the pool:
connection.close();
```

## Handling Exceptions

The `AceQLException` contains 4 pieces of information :

| Info             | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| Reason           | The error message. Retrieved with `getMessage()`.            |
| Error Type       | See below for description. Retrieved with `getErrorCode()`.  |
| Http Status Code | See below for description. Retrieved with `getHttpStatusCode(`). |
| Server Exception | The Exception Stack Trace thrown on the server side, if any. Retrieved with `getRemoteStackTrace()`. |

### The error type

The error type allows users to get the type of error and where the error occurred. It is retrieved with `AceQLException.getErrorCode()`:

| Error Type Value | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| 0                | The error occurred locally on the client side. See `getHttpStatusCode()` for more info. Typical cases: no Internet connection, no route to host, etc. |
| 1                | The error is due to a JDBC Exception. It was raised by the remote JDBC Driver and is rerouted by AceQL as is. The JDBC error message is accessible via `getMessage()` Typical case: an error in the SQL statement. Examples: wrong table or column name. |
| 2                | The error was raised by the AceQL Server. It means that the AceQL Server expected a value or parameter that was not sent by the client side. Typical cases: misspelling in URL parameter, missing required request parameters, JDBC Connection expiration, etc. The detailed error message is accessible via `getMessage()`. See below for the most common AceQL Server error messages. |
| 3                | The AceQL Server forbids the execution of the SQL statement for a security reason. For security reasons, `getMessage()` gives access to voluntarily vague details. |
| 4                | The AceQL Server is on failure and raised an unexpected Java Exception. The stack track is included and accessible via `getRemoteStackTrace()`. |

###  Most common AceQL server messages

| AceQL  Sever Error Messages   (AceQLException.getErrorCode()  = 2) |
| ------------------------------------------------------------ |
| AceQL main  servlet not found in path                        |
| An error occurred  during Blob download                      |
| An error occurred  during Blob upload                        |
| Blob directory  defined in `DatabaseConfigurator.getBlobDirectory()` does not exist |
| Connection is  invalidated (probably expired)                |
| Database does not  exist                                     |
| Invalid blob_id.  Cannot be used to create a file            |
| Invalid blob_id.  No Blob corresponding to blob_id           |
| Invalid  session_id                                          |
| Invalid username  or password                                |
| No action found  in request                                  |
| Unable to get a  Connection                                  |
| Unknown SQL  action or not supported by software             |

### HTTP Status Codes

The HTTP Status Code is accessible with the `Error.http_status_code` property. The HTTP Status Code is 200 (OK) on successful completion calls.

When an error occurs:

- If error type is 0, the HTTP Status Code is returned by the client side and may take all possible values in a malformed HTTP call.

- If error type is > 0, the HTTP Status Code can take one the following values returned by the server side:



| HTTP  Status Code            | Description                              |
| ---------------------------- | ---------------------------------------- |
| 400  (BAD REQUEST)           | Missing element in URL path<br />Missing request parameters<br />All JDBC errors raised by the remote JDBC  Driver |
| 401  (UNAUTHORIZED)          | Invalid username or password in connect<br />Invalid session_id<br />The AceQL Server forbade the execution of  the SQL statement for security reasons |
| 404 (NOT_FOUND)              | BLOB directory does not exist on server<br />BLOB file not found on server |
| 500  (INTERNAL_SERVER_ERROR) | The AceQL Server is on failure and raised  an unexpected Java Exception |

## Advanced Usage

### Transactions

Transactions are supported by the SDK. Because the remote server executes JDBC code, client code must follow the JDBC requirement to set the auto commit mode to false prior executing a transaction.

Transaction example:

```javascript
connection.setAutoCommit(false);   
    try {
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
    	connection.executeUpdate();
     
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
	
        connection.commit();
	    console.log("insert orderlog done");
    }
    catch(error) {
        connection.rollback();
        console.log(error);    
    }
    
    connection.setAutoCommit(true);
```



------





























