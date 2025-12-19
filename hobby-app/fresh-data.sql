-- Fresh Real Data for Hobby App Database
-- Clear existing data
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE user_friends;
TRUNCATE TABLE user_hobbies;
TRUNCATE TABLE user_groups;
TRUNCATE TABLE event;
TRUNCATE TABLE `groups`;
TRUNCATE TABLE hobby;
TRUNCATE TABLE `user`;
SET FOREIGN_KEY_CHECKS=1;

-- Insert Users
INSERT INTO `user` (`id`, `bio`, `email`, `name`, `password`, `phone`) VALUES
(1, 'Football passionate, love playing and watching matches', 'ali.sport@gmail.com', 'Ali Khaled', '$2a$10$1234567890abcdef', '21655123456'),
(2, 'Professional artist, digital and traditional mediums', 'fatima.art@gmail.com', 'Fatima Ben Ali', '$2a$10$1234567890abcdef', '21622456789'),
(3, 'Full stack developer, love open source', 'mohamed.dev@gmail.com', 'Mohamed Saidane', '$2a$10$1234567890abcdef', '21698765432'),
(4, 'Music lover and guitarist', 'amin.music@gmail.com', 'Amin Chbab', '$2a$10$1234567890abcdef', '22554894000'),
(5, 'Travel enthusiast and photographer', 'leila.travel@gmail.com', 'Leila Mansouri', '$2a$10$1234567890abcdef', '21654321098'),
(6, 'Chef and food blogger', 'rami.chef@gmail.com', 'Rami Boudriga', '$2a$10$1234567890abcdef', '21643215678'),
(7, 'Fitness trainer and health coach', 'sara.fitness@gmail.com', 'Sara Hamdi', '$2a$10$1234567890abcdef', '21678901234'),
(8, 'Book lover and writer', 'karim.writer@gmail.com', 'Karim Douki', '$2a$10$1234567890abcdef', '21687654321'),
(9, 'Board game enthusiast', 'noor.games@gmail.com', 'Noor Zahra', '$2a$10$1234567890abcdef', '21612345678'),
(10, 'Film critic and cinematographer', 'zaineb.film@gmail.com', 'Zaineb Karim', '$2a$10$1234567890abcdef', '21621098765');

-- Insert Hobbies
INSERT INTO `hobby` (`id`, `name`, `description`) VALUES
(1, 'Football', 'Sports activities and football matches'),
(2, 'Drawing & Art', 'Artistic activities and creative expression'),
(3, 'Programming', 'Software development and coding'),
(4, 'Music', 'Musical arts and instruments'),
(5, 'Photography', 'Photography and visual arts'),
(6, 'Cooking', 'Culinary arts and food preparation'),
(7, 'Fitness', 'Health, exercise and wellness'),
(8, 'Reading', 'Books, novels and literature'),
(9, 'Board Games', 'Strategy games and board gaming'),
(10, 'Cinematography', 'Films, movies and cinema');

-- Insert Groups for each hobby
INSERT INTO `groups` (`id`, `hobby_id`, `name`, `description`, `location`) VALUES
(1, 1, 'Mahdia Football Club', 'Football enthusiasts from Mahdia region', 'Mahdia'),
(2, 1, 'Tunis Football Society', 'Professional football community in Tunis', 'Tunis'),
(3, 1, 'Sfax United Supporters', 'Passionate football fans united', 'Sfax'),
(4, 2, 'Art Studio Tunis', 'Professional drawing and painting workshop', 'Tunis'),
(5, 2, 'Creative Minds Sousse', 'Art collective and creative space', 'Sousse'),
(6, 2, 'Digital Art Lab', 'Exploration of digital artistic techniques', 'Tunis'),
(7, 3, 'Dev Meetup Tunisia', 'Developers meeting and networking', 'Tunis'),
(8, 3, 'Mobile Dev Community', 'Mobile application development group', 'Sfax'),
(9, 3, 'Web Dev Workshops', 'Web development learning and collaboration', 'Tunis'),
(10, 4, 'Music Jam Sessions', 'Live music performances and jam sessions', 'Tunis'),
(11, 4, 'Guitar Club', 'Guitar enthusiasts and learners', 'Sousse'),
(12, 4, 'Piano Academy', 'Piano lessons and performances', 'Bizerte'),
(13, 5, 'Photography Club', 'Photography techniques and exhibitions', 'Tunis'),
(14, 5, 'Nature Photographers', 'Landscape and wildlife photography', 'Sfax'),
(15, 6, 'Culinary Masterclass', 'Advanced cooking techniques workshop', 'Tunis'),
(16, 6, 'Food Lovers Community', 'Food tasting and recipe sharing', 'Sousse'),
(17, 7, 'Fitness First Gym', 'Fitness training and wellness', 'Tunis'),
(18, 7, 'Marathon Training Club', 'Running and marathon preparation', 'Tunis'),
(19, 8, 'Book Club Tunis', 'Monthly book discussions', 'Tunis'),
(20, 8, 'Literature Cafe', 'Reading circle and writer meetups', 'Sousse'),
(21, 9, 'Board Game Cafe', 'Strategy games and tabletop gaming', 'Tunis'),
(22, 9, 'Dice Rollers Society', 'Tabletop RPG and board games', 'Sfax'),
(23, 10, 'Cinema Lovers Club', 'Film analysis and movie discussions', 'Tunis'),
(24, 10, 'Documentary Society', 'Documentary viewing and discussions', 'Sousse');

-- Insert User-Groups Relationships (Users joining groups)
INSERT INTO `user_groups` (`user_id`, `group_id`) VALUES
(1, 1), (1, 2), (1, 3),  -- Ali in 3 football groups
(2, 4), (2, 5), (2, 6),  -- Fatima in 3 art groups
(3, 7), (3, 8), (3, 9),  -- Mohamed in 3 dev groups
(4, 10), (4, 11), (4, 12), -- Amin in 3 music groups
(5, 13), (5, 14),         -- Leila in photography groups
(6, 15), (6, 16),         -- Rami in cooking groups
(7, 17), (7, 18),         -- Sara in fitness groups
(8, 19), (8, 20),         -- Karim in reading groups
(9, 21), (9, 22),         -- Noor in board game groups
(10, 23), (10, 24);       -- Zaineb in cinema groups

-- Insert User-Hobbies Relationships
INSERT INTO `user_hobbies` (`user_id`, `hobby_id`) VALUES
(1, 1), (1, 7),           -- Ali: Football, Fitness
(2, 2), (2, 5),           -- Fatima: Art, Photography
(3, 3), (3, 5),           -- Mohamed: Programming, Photography
(4, 4), (4, 8),           -- Amin: Music, Reading
(5, 5), (5, 7),           -- Leila: Photography, Fitness
(6, 6), (6, 2),           -- Rami: Cooking, Art
(7, 7), (7, 1),           -- Sara: Fitness, Football
(8, 8), (8, 10),          -- Karim: Reading, Cinema
(9, 9), (9, 8),           -- Noor: Board Games, Reading
(10, 10), (10, 2);        -- Zaineb: Cinema, Art

-- Insert Events
INSERT INTO `event` (`id`, `group_id`, `title`, `description`, `date`) VALUES
(1, 1, 'Training Session', 'Regular football training for all levels', '2025-12-05 18:00:00'),
(2, 1, 'Friendly Match', 'Friendly match against Sousse team', '2025-12-12 17:00:00'),
(3, 4, 'Life Drawing Workshop', 'Professional life drawing techniques', '2025-12-06 19:00:00'),
(4, 4, 'Gallery Exhibition', 'Showcase member artworks', '2025-12-20 18:30:00'),
(5, 7, 'JavaScript Meetup', 'Modern JavaScript frameworks discussion', '2025-12-07 18:30:00'),
(6, 7, 'Web Performance Workshop', 'Optimization techniques for web apps', '2025-12-14 17:00:00'),
(7, 10, 'Jam Session', 'Improvisation and collaboration session', '2025-12-06 20:00:00'),
(8, 10, 'Concert Night', 'Member performances and showcase', '2025-12-15 19:00:00'),
(9, 13, 'Photography Walk', 'Urban photography tour', '2025-12-08 10:00:00'),
(10, 15, 'Cooking Class', 'Mediterranean cuisine basics', '2025-12-09 19:00:00'),
(11, 17, 'Group Training', 'Cardio and strength training session', '2025-12-05 07:00:00'),
(12, 19, 'Book Discussion', 'Monthly book club meeting', '2025-12-10 19:00:00'),
(13, 21, 'Game Night', 'Strategy game tournament', '2025-12-06 20:00:00'),
(14, 23, 'Film Screening', 'Classic cinema screening', '2025-12-17 20:00:00');

-- Insert Friends Relationships
INSERT INTO `user_friends` (`user_id`, `friend_id`) VALUES
(1, 3), (3, 1),           -- Ali and Mohamed are friends
(1, 7), (7, 1),           -- Ali and Sara are friends
(2, 6), (6, 2),           -- Fatima and Rami are friends
(3, 4), (4, 3),           -- Mohamed and Amin are friends
(5, 10), (10, 5),         -- Leila and Zaineb are friends
(7, 9), (9, 7),           -- Sara and Noor are friends
(8, 4), (4, 8);           -- Karim and Amin are friends
