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
-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CREATE TABLE apeal (
    id BIGSERIAL PRIMARY KEY,
    firstname VARCHAR(500) NOT NULL,
    lastname VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(500),
	phone VARCHAR(500),
    status INTEGER DEFAULT 1,
    reseen DATE,
    CONSTRAINT fk_status FOREIGN KEY (status) REFERENCES apealstatus (id),
    CONSTRAINT check_reseen_not_null CHECK (
        (status = 3 AND reseen IS NOT NULL) OR status != 3
    )
);
-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CREATE TABLE calendar (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255),
    title VARCHAR(255),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    description TEXT,
    image VARCHAR(255),
    tags VARCHAR(255),
    location VARCHAR(255)
);
ALTER TABLE calendar
ADD COLUMN active BOOLEAN DEFAULT true;

ALTER TABLE apeal
ADD COLUMN state BOOLEAN DEFAULT true;
