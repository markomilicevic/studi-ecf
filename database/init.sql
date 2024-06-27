BEGIN;

DROP DATABASE IF EXISTS cinephoria;

CREATE DATABASE cinephoria;

USE cinephoria;

DELIMITER //

CREATE FUNCTION LAST_WEDNESDAY_OR_TODAY() RETURNS DATETIME BEGIN DECLARE today DATE;

DECLARE day_of_week INT;

DECLARE last_wednesday DATE;

SET
	today = CURDATE();

SET
	day_of_week = DAYOFWEEK(today);

-- DAYOFWEEK() returns 1 for Sunday, 2 for Monday, ..., 7 for Saturday
-- Wednesday is 4, so we need to adjust accordingly
SET
	last_wednesday = CASE
		WHEN day_of_week = 1 THEN DATE_SUB(today, INTERVAL 4 DAY) -- Sunday -> -4 days
		WHEN day_of_week = 2 THEN DATE_SUB(today, INTERVAL 5 DAY) -- Monday -> -5 days
		WHEN day_of_week = 3 THEN DATE_SUB(today, INTERVAL 6 DAY) -- Tuesday -> -6 days
		WHEN day_of_week = 4 THEN today -- Wednesday -> today
		WHEN day_of_week = 5 THEN DATE_SUB(today, INTERVAL 1 DAY) -- Thursday -> -1 day
		WHEN day_of_week = 6 THEN DATE_SUB(today, INTERVAL 2 DAY) -- Friday -> -2 days
		WHEN day_of_week = 7 THEN DATE_SUB(today, INTERVAL 3 DAY) -- Saturday -> -3 days
	END;

RETURN CONCAT(last_wednesday, ' 00:00:00');

END//

DELIMITER ;

CREATE TABLE genres (
	genreId UUID PRIMARY KEY,
	genreName ENUM('sci-fi', 'comedy') NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (genreName, unarchived)
);

INSERT INTO
	genres (genreId, genreName, createdAt)
VALUES
	(
		'0476dcd7-ca7a-463a-a4d4-a72e5354293e',
		'sci-fi',
		NOW()
	),
	(
		'ff423729-892d-4042-8879-b1e37084bee2',
		'comedy',
		NOW()
	);

CREATE TABLE movies (
	movieId UUID PRIMARY KEY,
	genreId UUID NOT NULL,
	posterId UUID NOT NULL,
	title VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	minimalAge TINYINT(2) DEFAULT NULL,
	isHighlight TINYINT(1) NOT NULL,
	rating DECIMAL(2, 1) DEFAULT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (title, unarchived),
	FOREIGN KEY (genreId) REFERENCES genres(genreId)
);

INSERT INTO
	movies (
		movieId,
		genreId,
		posterId,
		title,
		description,
		minimalAge,
		isHighlight,
		rating,
		createdAt
	)
VALUES
	(
		'b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1',
		'0476dcd7-ca7a-463a-a4d4-a72e5354293e',
		'7aaece02-f35c-48f9-acae-2f934e75f86f',
		'Terminator',
		'Terminator (The Terminator) est un film de science-fiction américain réalisé par James Cameron et sorti en 1984. Il met en scène Arnold Schwarzenegger, Michael Biehn et Linda Hamilton dans les rôles principaux.',
		16,
		1,
		4.6,
		LAST_WEDNESDAY_OR_TODAY()
	),
	(
		'b87a3c4e-91f4-415f-9f69-763f3ab71dd9',
		'0476dcd7-ca7a-463a-a4d4-a72e5354293e',
		'3f8fcade-fe3e-49a7-84cb-f73824b64779',
		'Terminator 2 : Le Jugement dernier',
		'Terminator 2 : Le Jugement dernier (Terminator 2: Judgment Day) est un film de science-fiction américain réalisé par James Cameron et sorti en 1991. Il met en scène Arnold Schwarzenegger, Linda Hamilton, Robert Patrick et Edward Furlong dans les rôles principaux.',
		16,
		1,
		4.1,
		LAST_WEDNESDAY_OR_TODAY()
	),
	(
		'86c5d353-5846-41af-856c-fcb5a286f84c',
		'0476dcd7-ca7a-463a-a4d4-a72e5354293e',
		'6a81235e-6423-4d8b-9cf8-269bb32f1416',
		'Terminator 3 : Le Soulèvement des machines',
		'Terminator 3 : Le Soulèvement des machines ou Terminator 3 : La Guerre des machines au Québec (Terminator 3: Rise of the Machines) est un film américain de science-fiction réalisé par Jonathan Mostow, sorti en 2003.',
		16,
		0,
		NULL,
		LAST_WEDNESDAY_OR_TODAY()
	),
	(
		'77aca143-4630-4615-a1cd-a8e3c59db32e',
		'ff423729-892d-4042-8879-b1e37084bee2',
		'07dc4159-57ca-4d09-bf91-c168fa7a84d2',
		'Un jour sans fin',
		'Un jour sans fin (Groundhog Day), ou Le Jour de la marmotte au Québec, est une comédie romantique et fantastique américaine réalisée par Harold Ramis, écrite par Danny Rubin, et sortie en 1993.',
		NULL,
		1,
		3.9,
		LAST_WEDNESDAY_OR_TODAY()
	);

CREATE TABLE cinemas (
	cinemaId UUID PRIMARY KEY,
	cinemaName VARCHAR(255) NOT NULL,
	countryCode CHAR(3) NOT NULL,
	address TEXT NOT NULL,
	phoneNumber VARCHAR(255) NOT NULL,
	openingHours TEXT NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (cinemaName, unarchived)
);

INSERT INTO
	cinemas (
		cinemaId,
		cinemaName,
		countryCode,
		address,
		phoneNumber,
		openingHours,
		createdAt
	)
VALUES
	(
		'6343bc7c-bef9-4309-b6ee-483c823960a8',
		'Cinéphoria Nantes',
		'FRA',
		'12 avenue Jean Jaurès, Nantes, France',
		'+33612345678',
		'Du mardi au dimanche : de 11h00 à 22h00',
		NOW()
	),
	(
		'748ff6f2-b362-48c1-8d18-6ab0ab9980c8',
		'Cinéphoria Bordeaux',
		'FRA',
		'12 avenue Jean Jaurès, Bordeaux, France',
		'+33612345678',
		'Du mardi au dimanche : de 11h00 à 22h00',
		NOW()
	),
	(
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'Cinéphoria Paris',
		'FRA',
		'12 avenue Jean Jaurès, Paris, France',
		'+33612345678',
		'Du mardi au dimanche : de 11h00 à 22h00',
		NOW()
	),
	(
		'971d416b-44eb-4d2c-8c8b-b3779eb4077d',
		'Cinéphoria Toulouse',
		'FRA',
		'12 avenue Jean Jaurès, Toulouse, France',
		'+33612345678',
		'Du mardi au dimanche : de 11h00 à 22h00',
		NOW()
	),
	(
		'd325e37e-5272-4164-92b2-20812045bd7b',
		'Cinéphoria Lille',
		'FRA',
		'12 avenue Jean Jaurès, Lille, France',
		'+33612345678',
		'Du mardi au dimanche : de 11h00 à 22h00',
		NOW()
	),
	(
		'09f3c5df-bbbe-4e55-bad1-3897be5b608a',
		'Cinéphoria Charleroi',
		'BEL',
		'12 avenue Jean Jaurès, Charleroi, Belgique',
		'+3212345678',
		'Du mardi au dimanche : de 11h00 à 22h00',
		NOW()
	),
	(
		'6c84ac65-8876-40c2-9f59-4d88f8e266bb',
		'Cinéphoria Liège',
		'BEL',
		'12 avenue Jean Jaurès, Liège, Belgique',
		'+3212345678',
		'Du mardi au dimanche : de 11h00 à 22h00',
		NOW()
	);

CREATE TABLE qualities (
	qualityId UUID PRIMARY KEY,
	qualityName ENUM('4DX', '3D', '4K', 'STD') NOT NULL DEFAULT 'STD',
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (qualityName, unarchived)
);

INSERT INTO
	qualities (qualityId, qualityName, createdAt)
VALUES
	(
		'b5f344e9-7968-4364-971c-9cacec0e90ea',
		'4DX',
		NOW()
	),
	(
		'9298d94f-9186-4f50-957c-84719d96b2cc',
		'3D',
		NOW()
	),
	(
		'54671b5f-75a9-4742-82c7-56cf2ffbc343',
		'4K',
		NOW()
	),
	(
		'25d69489-4384-4494-9852-0c63feca08a2',
		'STD',
		NOW()
	);

CREATE TABLE cinemas_rooms (
	cinemaRoomId UUID PRIMARY KEY,
	cinemaId UUID NOT NULL,
	qualityId UUID NOT NULL,
	roomNumber TINYINT(2) NOT NULL,
	placementsMatrix TEXT NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (cinemaId, roomNumber, unarchived),
	FOREIGN KEY (cinemaId) REFERENCES cinemas(cinemaId),
	FOREIGN KEY (qualityId) REFERENCES qualities(qualityId)
);

INSERT INTO
	cinemas_rooms (
		cinemaRoomId,
		cinemaId,
		qualityId,
		roomNumber,
		placementsMatrix,
		createdAt
	)
VALUES
	(
		'93214f9d-84d9-4f25-9917-efd195fc0be9',
		'748ff6f2-b362-48c1-8d18-6ab0ab9980c8',
		'25d69489-4384-4494-9852-0c63feca08a2',
		1,
		"SSS DDD\nSSS SSS",
		NOW()
	),
	(
		'22c65b73-c309-4a4b-84fa-d0942ee76ba4',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'25d69489-4384-4494-9852-0c63feca08a2',
		1,
		"SSS DDD\nSSS SSS",
		NOW()
	),
	(
		'04e4121c-79f7-41b6-b769-5d933ffed4e2',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'25d69489-4384-4494-9852-0c63feca08a2',
		2,
		"S D\nS D",
		NOW()
	),
	(
		'a3b16130-bffe-45fe-90f8-53063c830d68',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'25d69489-4384-4494-9852-0c63feca08a2',
		3,
		"S D\nS D",
		NOW()
	);

CREATE TABLE cinemas_rooms_incidents (
	cinemaRoomIncidentId UUID PRIMARY KEY,
	cinemaRoomId UUID NOT NULL,
	cinemaId UUID NOT NULL,
	incident TEXT NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (cinemaRoomId, unarchived),
	FOREIGN KEY (cinemaRoomId) REFERENCES cinemas_rooms(cinemaRoomId),
	FOREIGN KEY (cinemaId) REFERENCES cinemas(cinemaId)
);

INSERT INTO
	cinemas_rooms_incidents (
		cinemaRoomIncidentId,
		cinemaRoomId,
		cinemaId,
		incident,
		createdAt
	)
VALUES
	(
		'dc395642-4732-4040-bee9-37d6a54a9f37',
		'22c65b73-c309-4a4b-84fa-d0942ee76ba4',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		"Les places suivantes nécessitent un nettoyage : 2, 3 et 6",
		NOW()
	);

CREATE TABLE sessions (
	sessionId UUID PRIMARY KEY,
	cinemaId UUID NOT NULL,
	movieId UUID NOT NULL,
	cinemaRoomId UUID NOT NULL,
	startDate DATETIME NOT NULL,
	endDate DATETIME DEFAULT NULL,
	standartFreePlaces INT(11) NOT NULL,
	disabledFreePlaces INT(11) NOT NULL,
	qualityId UUID NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	FOREIGN KEY (cinemaId) REFERENCES cinemas(cinemaId),
	FOREIGN KEY (movieId) REFERENCES movies(movieId),
	FOREIGN KEY (cinemaRoomId) REFERENCES cinemas_rooms(cinemaRoomId)
);

INSERT INTO
	sessions (
		sessionId,
		cinemaId,
		movieId,
		cinemaRoomId,
		qualityId,
		startDate,
		endDate,
		standartFreePlaces,
		disabledFreePlaces,
		createdAt
	)
VALUES
	(
		'88ad4c7c-4218-4d1e-a9d3-b842e8b12304',
		'748ff6f2-b362-48c1-8d18-6ab0ab9980c8',
		'b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1',
		'93214f9d-84d9-4f25-9917-efd195fc0be9',
		'25d69489-4384-4494-9852-0c63feca08a2',
		'2001-01-01 16:00:00',
		'2001-01-01 18:00:00',
		0,
		0,
		'2000-12-24 10:00:00'
	),
	(
		'857e81c2-a02b-4563-aebc-b3063d50431a',
		'748ff6f2-b362-48c1-8d18-6ab0ab9980c8',
		'b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1',
		'93214f9d-84d9-4f25-9917-efd195fc0be9',
		'25d69489-4384-4494-9852-0c63feca08a2',
		NOW() + INTERVAL 6 HOUR,
		NOW() + INTERVAL 8 HOUR,
		100,
		10,
		NOW()
	),
	(
		'29969f77-5a36-4046-a0f7-0bcf7263cc8f',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1',
		'22c65b73-c309-4a4b-84fa-d0942ee76ba4',
		'25d69489-4384-4494-9852-0c63feca08a2',
		NOW() + INTERVAL 6 HOUR,
		NOW() + INTERVAL 8 HOUR,
		100,
		10,
		NOW()
	),
	(
		'c932e1ff-cdd6-4709-8d63-d4bbf02ef552',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1',
		'22c65b73-c309-4a4b-84fa-d0942ee76ba4',
		'54671b5f-75a9-4742-82c7-56cf2ffbc343',
		NOW() + INTERVAL 9 HOUR,
		NOW() + INTERVAL 11 HOUR,
		2,
		1,
		NOW()
	),
	(
		'98eedd1b-61fd-4314-8b54-64af0dbfbc87',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1',
		'04e4121c-79f7-41b6-b769-5d933ffed4e2',
		'25d69489-4384-4494-9852-0c63feca08a2',
		NOW() + INTERVAL 25 HOUR,
		NOW() + INTERVAL 27 HOUR,
		100,
		10,
		NOW()
	),
	(
		'ffd55c72-bc1f-4826-afd9-af79197e75ac',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'77aca143-4630-4615-a1cd-a8e3c59db32e',
		'22c65b73-c309-4a4b-84fa-d0942ee76ba4',
		'25d69489-4384-4494-9852-0c63feca08a2',
		NOW() + INTERVAL 5 HOUR,
		NOW() + INTERVAL 7 HOUR,
		100,
		10,
		NOW()
	),
	(
		'7228c993-a748-4de9-b435-b8ea52bc5b80',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'b87a3c4e-91f4-415f-9f69-763f3ab71dd9',
		'a3b16130-bffe-45fe-90f8-53063c830d68',
		'9298d94f-9186-4f50-957c-84719d96b2cc',
		NOW() + INTERVAL 9 DAY,
		NOW() + INTERVAL 9 DAY + INTERVAL 2 HOUR,
		100,
		10,
		NOW()
	),
	(
		'4af1e73a-5be5-489b-85a6-d32d901effa0',
		'c92c5a2b-3deb-4e0c-912f-dc8434fa2873',
		'b87a3c4e-91f4-415f-9f69-763f3ab71dd9',
		'a3b16130-bffe-45fe-90f8-53063c830d68',
		'9298d94f-9186-4f50-957c-84719d96b2cc',
		NOW() + INTERVAL 9 + 7 + 7 DAY,
		NOW() + INTERVAL 9 + 7 + 7 DAY + INTERVAL 2 HOUR,
		100,
		10,
		NOW()
	);

CREATE TABLE users (
	userId UUID PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
	password CHAR(64) NOT NULL,
	firstName VARCHAR(255) NOT NULL,
	lastName VARCHAR(255) NOT NULL,
	userName VARCHAR(255) NOT NULL,
	role ENUM('user', 'employee', 'admin') NOT NULL DEFAULT 'user',
	resetPasswordToken UUID DEFAULT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (email, unarchived)
);

INSERT INTO
	users (
		userId,
		email,
		password,
		firstName,
		lastName,
		userName,
		role,
		createdAt
	)
VALUES
	(
		'2299bf64-58f5-44bf-b255-398f42595ead',
		'admin@example.com',
		'8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
		'Admin',
		'Strator',
		'admin',
		'admin',
		NOW()
	),
	(
		'81d50ad7-310d-4eef-a738-62adb5a5ffed',
		'employee@example.com',
		'2fdc0177057d3a5c6c2c0821e01f4fa8d90f9a3bb7afd82b0db526af98d68de8',
		'Empl',
		'Oyee',
		'employee',
		'employee',
		NOW()
	),
	(
		'50601073-b3e4-4772-a444-cbeff5c82b45',
		'john.doe@example.com',
		'30f69670bba25e88a97e749a67b8b93db6541ebd309094e5ad0e3c56e7cc3961',
		'John',
		'Doe',
		'john.doe',
		'user',
		NOW()
	);

CREATE TABLE bookings (
	bookingId UUID PRIMARY KEY,
	userId UUID NOT NULL,
	sessionId UUID NOT NULL,
	movieId UUID NOT NULL,
	totalPlacesNumber INTEGER(11) NOT NULL,
	totalPriceValue DECIMAL(5, 2) NOT NULL,
	totalPriceUnit ENUM('EUR') NOT NULL DEFAULT 'EUR',
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	FOREIGN KEY (userId) REFERENCES users(userId),
	FOREIGN KEY (sessionId) REFERENCES sessions(sessionId),
	FOREIGN KEY (movieId) REFERENCES movies(movieId)
);

INSERT INTO
	bookings (
		bookingId,
		userId,
		sessionId,
		movieId,
		totalPlacesNumber,
		totalPriceValue,
		totalPriceUnit,
		createdAt
	)
VALUES
	(
		'0fc14dd2-1eeb-4472-9572-28286d50fd3d',
		'50601073-b3e4-4772-a444-cbeff5c82b45',
		'88ad4c7c-4218-4d1e-a9d3-b842e8b12304',
		'b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1',
		1,
		19.90,
		'EUR',
		'2000-12-28 15:00:00.000'
	);

CREATE TABLE sessions_reserved_placements(
	sessionId UUID NOT NULL,
	-- TODO: Remove me in favor of booking.sessionId
	bookingId UUID NOT NULL,
	placementNumber INT(11) NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (sessionId, placementNumber, unarchived),
	FOREIGN KEY (bookingId) REFERENCES bookings(bookingId)
);

INSERT INTO
	sessions_reserved_placements (
		sessionId,
		bookingId,
		placementNumber,
		createdAt
	)
VALUES
	(
		'88ad4c7c-4218-4d1e-a9d3-b842e8b12304',
		'0fc14dd2-1eeb-4472-9572-28286d50fd3d',
		3,
		NOW()
	);

CREATE TABLE prices (
	qualityId UUID NOT NULL,
	countryCode CHAR(3) NOT NULL,
	priceValue DECIMAL(5, 2) NOT NULL,
	priceUnit ENUM('EUR') NOT NULL DEFAULT 'EUR',
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (qualityId, countryCode, unarchived),
	FOREIGN KEY (qualityId) REFERENCES qualities(qualityId)
);

INSERT INTO
	prices (
		qualityId,
		countryCode,
		priceValue,
		priceUnit,
		createdAt
	)
VALUES
	(
		'b5f344e9-7968-4364-971c-9cacec0e90ea',
		'FRA',
		14.99,
		'EUR',
		NOW()
	),
	(
		'9298d94f-9186-4f50-957c-84719d96b2cc',
		'FRA',
		13.99,
		'EUR',
		NOW()
	),
	(
		'54671b5f-75a9-4742-82c7-56cf2ffbc343',
		'FRA',
		12.99,
		'EUR',
		NOW()
	),
	(
		'25d69489-4384-4494-9852-0c63feca08a2',
		'FRA',
		11.99,
		'EUR',
		NOW()
	),
	(
		'b5f344e9-7968-4364-971c-9cacec0e90ea',
		'BEL',
		14.99,
		'EUR',
		NOW()
	),
	(
		'9298d94f-9186-4f50-957c-84719d96b2cc',
		'BEL',
		13.99,
		'EUR',
		NOW()
	),
	(
		'54671b5f-75a9-4742-82c7-56cf2ffbc343',
		'BEL',
		12.99,
		'EUR',
		NOW()
	),
	(
		'25d69489-4384-4494-9852-0c63feca08a2',
		'BEL',
		11.99,
		'EUR',
		NOW()
	);

CREATE TABLE movies_comments (
	movieCommentId UUID PRIMARY KEY,
	movieId UUID NOT NULL,
	sessionId UUID NOT NULL,
	userId UUID NOT NULL,
	comment TEXT NOT NULL,
	status ENUM('created', 'approved', 'rejected') NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (sessionId, userId, unarchived),
	FOREIGN KEY (movieId) REFERENCES movies(movieId),
	FOREIGN KEY (sessionId) REFERENCES sessions(sessionId),
	FOREIGN KEY (userId) REFERENCES users(userId)
);

INSERT INTO
	movies_comments (
		movieCommentId,
		movieId,
		sessionId,
		userId,
		comment,
		status,
		createdAt
	)
VALUES
	(
		'b9ab7ed9-fc2d-41fb-b014-f6f869b7bb89',
		'b3efa1f5-7d09-4cc4-a3d2-d0792a667dd1',
		'88ad4c7c-4218-4d1e-a9d3-b842e8b12304',
		'50601073-b3e4-4772-a444-cbeff5c82b45',
		'Très bon film !',
		'approved',
		'2001-01-05 09:00:00.000'
	);

CREATE TABLE movies_ratings (
	movieRatingId UUID PRIMARY KEY,
	movieId UUID NOT NULL,
	sessionId UUID NOT NULL,
	userId UUID NOT NULL,
	rating TINYINT(1) NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME DEFAULT NULL,
	deletedAt DATETIME DEFAULT NULL,
	unarchived BOOLEAN GENERATED ALWAYS AS (IF(deletedAt IS NULL, 1, NULL)) VIRTUAL,
	UNIQUE KEY (sessionId, userId, unarchived),
	FOREIGN KEY (movieId) REFERENCES movies(movieId),
	FOREIGN KEY (sessionId) REFERENCES sessions(sessionId),
	FOREIGN KEY (userId) REFERENCES users(userId)
);

COMMIT;
