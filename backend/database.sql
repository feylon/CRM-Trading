create table admin (
id bigserial primary key,
email varchar(500) not null unique,
login varchar(500) not null unique,
password varchar(500) not null,
firstname varchar(500),
lastname varchar(500),
brithday DATE,
address varchar(500),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
Parent_Name varchar(500),
profil_url varchar(500),
state BOOLEAN DEFAULT true);
insert into admin (email, login, password, firstname, brithday) values
('jamshid14092002@gmail.com','jamshid14092002','$2b$10$qszd/we2sPerBlHoeUKageRfkVnM9T5LUndqxhgli3NmJdTHRhbOG', 'Jamshid', '14-09-2002');
-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
create table apealStatus(
id bigserial primary key unique,
	name varchar not null unique
);
insert into apealStatus (name)
values
('seen'), ('notseen'), ('panding'), ('cancel');
-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
