# // TODO - не забыть создать классы таблиц
CREATE TABLE ext_inventory_depot_list
(
    id int auto_increment not null comment 'id' primary key,
    depot_id int not null comment 'идентификатор склада',
    project_id int not null comment 'идентификатор проекта',
    title VARCHAR(30) not null comment 'наименование склада',
    UNIQUE KEY (depot_id, project_id)
)
    COMMENT 'таблица связи складов проектов';

ALTER TABLE ext_inventory_depot_detailed
    ADD depot_id INT NULL COMMENT 'id записи из таблицы ext_inventory_depot_list';

alter table ext_inventory_depot_detailed
    add constraint ext_inventory_depot_detailed_ibfk_4
        foreign key (depot_id) references ext_inventory_depot_detailed (id);

SELECT DISTINCT project_id FROM ext_inventory_depot_detailed;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 1) WHERE project_id = 1;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 2) WHERE project_id = 2;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 3) WHERE project_id = 3;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 5) WHERE project_id = 5;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 7) WHERE project_id = 7;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 8) WHERE project_id = 8;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 9) WHERE project_id = 9;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 19) WHERE project_id = 19;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 20) WHERE project_id = 20;
UPDATE ext_inventory_depot_detailed SET depot_id = (SELECT id FROM ext_inventory_depot_list where project_id = 18) WHERE project_id = 18;