ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

CREATE DATABASE kursach;
USE kursach;

CREATE TABLE users ( -- хранит пользователей
	idUser int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    userName varchar(35) NOT NULL,
    userPass varchar(32) NOT NULL,
    isAdmin boolean NOT NULL,
    email varchar(50) NOT NULL,
    phoneNumber varchar(20) NOT NULL
    -- constraint phone
    -- constraint mail
);

CREATE TABLE birdGenus ( -- хранит роды птиц
	idGenus int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    genusName varchar(100) NOT NULL,
	internationalName varchar(100),
    foundYear int,
    description varchar(256)
);

CREATE TABLE protectionStatus (
	idPrS int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    shortName varchar(20) NOT NULL,
    longName varchar(100) NOT NULL,
    description varchar(256)
);

CREATE TABLE birdSpecies ( -- хранит виды птиц
	idSpecies int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	speciesName varchar(100) NOT NULL,
    length double, -- метры
    weight double, -- граммы
    wingspan double, -- размах крыльев, метры
    description varchar(256),
    idGenus int NOT NULL,
    idPrS int NOT NULL,
    FOREIGN KEY (idGenus)
		REFERENCES birdGenus (idGenus),
	FOREIGN KEY (idPrS)
		REFERENCES protectionStatus (idPrS)
);

CREATE TABLE preserves ( -- хранит заповедники
	idPres int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    presName varchar(100) NOT NULL,
    presOwner varchar(50) NOT NULL,
    area int NOT NULL, -- тыс. гектаров
    foundYear int,
    address varchar(100) NOT NULL
);

CREATE TABLE preserves2birdSpecies (
	idPreserves2birdSpecies int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	idSpecies int NOT NULL,
    idPres int NOT NULL,
	FOREIGN KEY (idPres)
		REFERENCES preserves (idPres),
	FOREIGN KEY (idSpecies)
		REFERENCES birdSpecies (idSpecies)
);

CREATE TABLE donates (
	idUser int NOT NULL,
    idPreserves2birdSpecies int NOT NULL,
    donateDate datetime NOT NULL,
    donateAmount double NOT NULL,
    FOREIGN KEY (idUser)
		REFERENCES users (idUser),
	FOREIGN KEY (idPreserves2birdSpecies)
		REFERENCES preserves2birdSpecies (idPreserves2birdSpecies)
);

DROP DATABASE kursach;

/*
CREATE TABLE address (
	idAddr int PRIMARY KEY NOT NULL,
    country varchar(100) NOT NULL,
    city varchar(60),
    region varchar(60)
);
*/

/*
CREATE TABLE userBirdPreserveDonates ( -- хранит связь между пользователями, птицами и заповедникам, а также информацию о донате
	idUser int NOT NULL,
    idBird int NOT NULL,
    idPres int NOT NULL,
	FOREIGN KEY (idUser)
		REFERENCES birds (idUser),
	FOREIGN KEY (idBird)
		REFERENCES users (idBird),
	FOREIGN KEY (idPres) 
		REFERENCES preserves (idPres),
	donateDate datetime NOT NULL,
    donateCount int NOT NULL
);
*/
