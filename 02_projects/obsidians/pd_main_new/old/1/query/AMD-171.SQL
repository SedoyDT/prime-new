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

# SELECT * FROM entity_prop_enum;