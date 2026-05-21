1;PRIMARY;ddp;;ALL;depot_detailed_photo_fk2;;;;38329;100;"Using temporary; Using filesort"
1;PRIMARY;<derived2>;;ref;<auto_key1>;<auto_key1>;4;pzo.ddp.item_id;32811;33.33;Using where
2;DERIVED;<derived3>;;system;;;;;0;0;const row not found
2;DERIVED;d;;ALL;PRIMARY;;;;28424;100;
2;DERIVED;d2iw;;eq_ref;id_2,id;id_2;4;pzo.d.id;1;100;
2;DERIVED;field1;;eq_ref;PRIMARY;PRIMARY;4;pzo.d.field1;1;100;
2;DERIVED;field2;;eq_ref;PRIMARY;PRIMARY;4;pzo.d.field2;1;100;
2;DERIVED;field3;;eq_ref;PRIMARY;PRIMARY;4;pzo.d.field3;1;100;
2;DERIVED;field4;;eq_ref;PRIMARY;PRIMARY;4;pzo.d.field4;1;100;
2;DERIVED;field13;;eq_ref;PRIMARY;PRIMARY;4;pzo.d.field13;1;100;
2;DERIVED;d2d;;ref;PRIMARY;PRIMARY;4;pzo.d.id;5;100;
2;DERIVED;<derived4>;;ref;<auto_key0>;<auto_key0>;4;pzo.d.id;10;100;
2;DERIVED;bp1;;ref;depot_id,item_id,cur_date,date_to,type,depot_id_2,bp_type;item_id;4;pzo.d.id;8;100;Using where
2;DERIVED;dae;;eq_ref;depot_additional_expenses_pk;depot_additional_expenses_pk;8;const,pzo.d.id;1;100;
2;DERIVED;bp2;;ref;depot_id,item_id,cur_date,date_to,type,depot_id_2,bp_type;item_id;4;pzo.d.id;8;100;Using where
2;DERIVED;bp1_in;;ref;depot_id,item_id,cur_date,date_to,type,depot_id_2,bp_type;item_id;4;pzo.d.id;8;100;Using where
2;DERIVED;bp2_in;;index_merge;depot_id,item_id,cur_date,date_to,type,depot_id_2,bp_type;type,bp_type;4,1;;1;100;"Using intersect(type,bp_type); Using where; Using join buffer (Block Nested Loop)"
4;DERIVED;<derived11>;;ALL;;;;;413739;30;"Using where; Using temporary; Using filesort"
4;DERIVED;sub_dd;;eq_ref;PRIMARY,claim_id,item_id,depot_id,item_id_2;PRIMARY;4;sub_vddm.dd_id;1;50;Using where
4;DERIVED;sub_cl;;eq_ref;PRIMARY,claim_status,manager_client;PRIMARY;4;pzo.sub_dd.claim_id;1;50;Using where
4;DERIVED;sub_ou;;ref;userId;userId;4;sub_vddm.user_id;1;100;Using index
11;DERIVED;ddm;;index;PRIMARY,user_id,dd_id;PRIMARY;4;;75;100;
12;UNION;dd;;index;PRIMARY,claim_id,item_id,manager_id,depot_id,item_id_2;PRIMARY;4;;413664;100;
12;UNION;ddm;;ref;dd_id;dd_id;4;pzo.dd.id;1;100;
3;DERIVED;;;;;;;;;;Impossible WHERE
8;DERIVED;ddm;;index;PRIMARY,user_id,dd_id;PRIMARY;4;;75;100;
8;DERIVED;b;;ref;detailed_id,state;detailed_id;4;pzo.ddm.dd_id;3;100;Using where
8;DERIVED;ddmb;;eq_ref;blocks_id_2,dd_manager_id,blocks_id;blocks_id_2;8;pzo.b.id,pzo.ddm.id;1;100;
9;UNION;b;;ref;PRIMARY,unique_key_2,detailed_id,state;state;1;const;1718;100;"Using index condition; Using temporary; Using filesort"
9;UNION;ddmb;;eq_ref;blocks_id_2,dd_manager_id,blocks_id;blocks_id_2;8;pzo.b.id,const;1;100;
;UNION RESULT;<union8,9>;;ALL;;;;;;;Using temporary
5;DERIVED;ddm;;index;PRIMARY,user_id,dd_id;PRIMARY;4;;75;100;
6;UNION;dd;;index;PRIMARY,claim_id,item_id,manager_id,depot_id,item_id_2;PRIMARY;4;;413664;100;
6;UNION;ddm;;ref;dd_id;dd_id;4;pzo.dd.id;1;100;
