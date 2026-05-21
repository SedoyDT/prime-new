
#ign_mysql
#mysql

#telegram 

# select name, length( name )
<!-- basicblock-start  deck='ign_mysql' -->
select name, length( name )::

from users
where length( name ) = ( select max( length( name ) ) from users );
<!-- basicblock-end -->




#ign_mysql
#mysql

#telegram 

# #greatest-n-per-group
<!-- basicblock-start  deck='ign_mysql' -->
#greatest-n-per-group::


<!-- basicblock-end -->



