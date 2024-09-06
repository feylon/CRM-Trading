create table if not exists admin (
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

create table if not exists apealStatus(
id bigserial primary key unique,
	name varchar not null unique
);
insert into apealStatus (name)
values
('seen'), ('notseen'), ('panding'), ('cancel')
on conflict (name) do nothing;

CREATE TABLE if not exists apeal (
    id BIGSERIAL PRIMARY KEY,
    firstname VARCHAR(500) NOT NULL,
    lastname VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(500),
	phone VARCHAR(500),
    status INTEGER DEFAULT 2,
    reseen DATE,
    state BOOLEAN DEFAULT true,
    CONSTRAINT fk_status FOREIGN KEY (status) REFERENCES apealstatus (id),
    CONSTRAINT check_reseen_not_null CHECK (
        (status = 3 AND reseen IS NOT NULL) OR status != 3
    )
);
create index if not exists idx_apeal_state on apeal (state, created_at desc);
create index if not exists idx_apeal_status on apeal (status);

CREATE TABLE if not exists calendar (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255),
    title VARCHAR(255),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    description TEXT,
    image VARCHAR(255),
    tags VARCHAR(255),
    location VARCHAR(255),
    active BOOLEAN DEFAULT true
);

create table if not exists apeal_comment (
    id bigserial primary key,
    apeal_id bigint not null references apeal (id) on delete cascade,
    admin_id bigint references admin (id) on delete set null,
    text varchar(1000) not null,
    created_at timestamp default current_timestamp
);
create index if not exists idx_comment_apeal on apeal_comment (apeal_id);

CREATE TABLE if not exists "session" (
  "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

CREATE INDEX if not exists "IDX_session_expire" ON "session" ("expire");
