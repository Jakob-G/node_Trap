DROP DATABASE IF EXISTS trap;
create database trap;
\connect trap;

CREATE TABLE Users (
    User_ID SERIAL PRIMARY KEY,
    User_Name VARCHAR(50),
    Password VARCHAR (255)
);

CREATE TABLE Trap(
    Trap_ID SERIAL PRIMARY KEY,
    Floor_ID Integer,
    Trap_type VARCHAR(20),
    Time TIMESTAMP,
    Bait_left Integer
);

CREATE TABLE Floor(
    Floor_ID SERIAL PRIMARY KEY,
    Building_ID Integer,
    Floor_name VARCHAR(20),
);

CREATE TABLE Building(
    Building_ID SERIAL PRIMARY KEY,
    Building_name VARCHAR(50),
    Location VARCHAR(50)
);


ALTER TABLE Floor
   ADD CONSTRAINT FK_Building_ID
   FOREIGN KEY (Building_ID) REFERENCES Building (Building_ID);

ALTER TABLE Trap
   ADD CONSTRAINT FK_Floor_ID
   FOREIGN KEY (Floor_ID) REFERENCES Floor (Floor_ID);

Insert into Users(user_name, password) VALUES ('admin','pass');