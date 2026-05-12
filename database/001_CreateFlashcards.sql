CREATE TABLE `flashcards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `area` varchar(255) NOT NULL,
  `era` varchar(255) NOT NULL,
  `question` text NOT NULL,
  `answers` json NOT NULL,
  `correct_answer` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);