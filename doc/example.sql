-- Exemple de transaction SQL
-- Cas : réservation de places

-- Commence par un début de transaction
BEGIN;

-- Insertion des informations principales de la réservation
-- Tous les champs sont nommés à l'avance entre paranthèse pour gareder un contrôle sur l'ordre de l'insertion
-- Ceci est une requete préparée, d'où la présence de "?"" afin d'éviter de possible injection SQL
INSERT INTO `bookings` 
    (`bookingId`,`userId`,`sessionId`,`movieId`,`totalPlacesNumber`,`totalPriceValue`,`totalPriceUnit`,`createdAt`,`updatedAt`)
    VALUES (?,?,?,?,?,?,?,?,?);

-- Insertion des places réservés de la réservation (ici deux entrées)
-- Tous les champs sont nommés à l'avance entre paranthèse pour gareder un contrôle sur l'ordre de l'insertion
-- L'ORM utilisé ici ne va pas utiliser de requete préparée car les valeurs sont des types non-string (UUIDs, nombres et dates)
INSERT INTO `sessions_reserved_placements`
    (`sessionId`,`bookingId`,`placementNumber`,`createdAt`,`updatedAt`) 
    VALUES
    ('29969f77-5a36-4046-a0f7-0bcf7263cc8f','a31ac295-9168-41b4-843b-9eb633fc8eba',1,'2024-06-29 03:47:36.283','2024-06-29 03:47:36.283'),
    ('29969f77-5a36-4046-a0f7-0bcf7263cc8f','a31ac295-9168-41b4-843b-9eb633fc8eba',2,'2024-06-29 03:47:36.283','2024-06-29 03:47:36.283');

-- Enfin, finalisation de la transaction par son un succès
-- Important : ne pas oublier cette instruction auquel cas votre transaction ne sera pas appliquée
-- Note : certains services ne sont pas transactionels (exemple : envoi de mail, écriture base NoSQL), dans cas,
-- il est conseiller de faire ces opérations tout au bout de la transaction, afin de pouvoir ROLLBACK si nécessaire
COMMIT;
