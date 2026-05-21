
#0_Pd_Mysql_stored_objects
#Mysql_stored_objects


<!-- basicblock-start oid="ObsKMlLlWmrJg6IngpzTBola"  deck='0_Pd_Mysql_stored_objects' -->
Stored objects include these object types:::

 • Stored procedure: An object created with `CREATE PROCEDURE` and invoked using the `CALL` statement. A procedure does not have a return value but can modify its parameters for later inspection by the caller. It can also generate result sets to be returned to the client program.
 • Stored function: An object created with `CREATE FUNCTION` and used much like a built-in function. You invoke it in an expression and it returns a value during expression evaluation.
 • Trigger: An object created with `CREATE TRIGGER`[that](https://dev.mysql.com/doc/refman/5.7/en/create-trigger.html) is associated with a table. A trigger is activated when a particular event occurs for the table, such as an insert or update.
 • Event: An object created with `CREATE EVENT` and invoked by the server according to schedule.
 • View: An object created with `CREATE VIEW` that when referenced produces a result set. A view acts as a virtual table.
<!-- basicblock-end -->



