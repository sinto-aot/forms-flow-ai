insert into ACT_GE_SCHEMA_LOG
values ('400', CURRENT_TIMESTAMP, '7.15.0');

ALTER TABLE ACT_RU_VARIABLE
  ADD BATCH_ID_ varchar(64);
CREATE INDEX ACT_IDX_BATCH_ID ON ACT_RU_VARIABLE(BATCH_ID_);
ALTER TABLE ACT_RU_VARIABLE
    ADD CONSTRAINT ACT_FK_VAR_BATCH
    FOREIGN KEY (BATCH_ID_)
    REFERENCES ACT_RU_BATCH (ID_); 

create index ACT_IDX_VARIABLE_TASK_NAME_TYPE on ACT_RU_VARIABLE(TASK_ID_, NAME_, TYPE_);

create table ACT_RU_TASK_METER_LOG (
  ID_ varchar(64) not null,
  ASSIGNEE_HASH_ bigint,
  TIMESTAMP_ timestamp,
  primary key (ID_)
);

create index ACT_IDX_TASK_METER_LOG_TIME on ACT_RU_TASK_METER_LOG(TIMESTAMP_);

ALTER TABLE ACT_RU_INCIDENT
  ADD ANNOTATION_ varchar(4000);

ALTER TABLE ACT_HI_INCIDENT
  ADD ANNOTATION_ varchar(4000);
