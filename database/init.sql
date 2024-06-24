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

CREATE TABLE movies (
	movieId UUID PRIMARY KEY,
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
	UNIQUE KEY (title, unarchived)
);

INSERT INTO
	movies (
		movieId,
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
		'07dc4159-57ca-4d09-bf91-c168fa7a84d2',
		'Un jour sans fin',
		'Un jour sans fin (Groundhog Day), ou Le Jour de la marmotte au Québec, est une comédie romantique et fantastique américaine réalisée par Harold Ramis, écrite par Danny Rubin, et sortie en 1993.',
		NULL,
		1,
		3.9,
		LAST_WEDNESDAY_OR_TODAY()
	);

COMMIT;