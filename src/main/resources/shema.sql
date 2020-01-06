create table task_test.tasks
(
    id    integer      not null
        constraint tasks_pk
            primary key,
    topic varchar(255) not null
);

alter table task_test.tasks
    owner to postgres;

create unique index tasks_id_uindex
    on task_test.tasks (id);