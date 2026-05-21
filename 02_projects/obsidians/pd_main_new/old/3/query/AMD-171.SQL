# // TODO - не забыть создать классы таблиц
CREATE TABLE projects_depots
(
    id int auto_increment not null comment 'id' primary key,
    depot_id int not null comment 'идентификатор склада',
    project_id int not null comment 'идентификатор проекта',
    title VARCHAR(30) not null comment 'наименование склада',
    UNIQUE KEY (depot_id, project_id)
)
    COMMENT 'таблица связи складов проектов';

ALTER TABLE ext_inventory_depot_detailed
    ADD depot_id INT NULL COMMENT 'id записи из таблицы projects_depots';

alter table ext_inventory_depot_detailed
    add constraint ext_inventory_depot_detailed_projects_depots_id_fk
        foreign key (depot_id) references projects_depots (id);