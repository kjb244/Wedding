drop table if exists wedding_list;
CREATE TABLE wedding_list
(
  id serial primary key,
  firstname text,
  lastname text,
  email text not null,
  dietaryrestrictions text,
  attending boolean default false,
  dateupdate timestamp without time zone
);

insert into wedding_list(firstname, lastname, email) values ('kevin', 'bacino', 'kevin.bacino@gmail.com');
insert into wedding_list(firstname, lastname, email) values (null, null, 'kevin.bacino@gmail.com');

insert into wedding_list(firstname, lastname, email) values ('test', 'er', 'test@test.com');

commit;

drop table if exists wedding_list_audits;

create table wedding_list_audits (
id serial primary key,
weddingid int not null,
oldfirstname text,
newfirstname text,
oldlastname text,
newlastname text,
oldattending boolean,
newattending boolean,
olddietaryrestrictions text,
newdietaryrestrictions text,
  sysdate timestamp);

create or replace function log_audits()
 returns trigger as
 $$
 begin
	insert into wedding_list_audits(weddingid, oldfirstname, newfirstname, oldlastname,
	newlastname, oldattending, newattending, olddietaryrestrictions, newdietaryrestrictions, sysdate)
	values(old.id, old.firstname, new.firstname, old.lastname, new.lastname, old.attending, new.attending, old.dietaryrestrictions, new.dietaryrestrictions, now());

	return new;
 end;
 $$ LANGUAGE plpgsql;

CREATE TRIGGER wedding_audits
BEFORE UPDATE
ON wedding_list
FOR EACH ROW
EXECUTE PROCEDURE log_audits();

