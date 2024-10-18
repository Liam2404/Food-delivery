-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 18 oct. 2024 à 09:06
-- Version du serveur : 8.0.30
-- Version de PHP : 8.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `food`
--

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` bigint UNSIGNED NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `email_address`, `password`, `is_admin`, `username`) VALUES
(1, 'test@test.test', '$2a$10$3mdpCspESfH/DltKaRtmUuVi3bS3DcYoifJWv6DgrvbIdGAGmR2iq', 0, 'test'),
(2, 'client@client.client', '$2a$10$kSWiELtwN08lZ.blrOSBnOefpdOKq73whCOA129A6Ek8YklqI2hZ6', 0, 'client');

-- --------------------------------------------------------

--
-- Structure de la table `meal`
--

CREATE TABLE `meal` (
  `meal_id` bigint UNSIGNED NOT NULL,
  `meal_name` varchar(255) NOT NULL,
  `meal_description` varchar(255) NOT NULL,
  `meal_price` decimal(8,2) NOT NULL,
  `meal_img` varchar(255) DEFAULT NULL,
  `restaurant_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `meal`
--

INSERT INTO `meal` (`meal_id`, `meal_name`, `meal_description`, `meal_price`, `meal_img`, `restaurant_id`) VALUES
(2, 'test', 'test', 3.00, 'uploads\\1725870524147.png', 2),
(3, 'test', 'test', 5.00, 'uploads\\1726737627504.png', 2),
(4, 'image test', 'img', 50.00, 'uploads\\1727775979033.png', 2);

-- --------------------------------------------------------

--
-- Structure de la table `rating`
--

CREATE TABLE `rating` (
  `id` int NOT NULL,
  `restaurant_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `score` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `rating`
--

INSERT INTO `rating` (`id`, `restaurant_id`, `user_id`, `score`) VALUES
(1, 1, 2, 4);

-- --------------------------------------------------------

--
-- Structure de la table `restaurant`
--

CREATE TABLE `restaurant` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `food_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `delivery_time` time DEFAULT NULL,
  `meal_id` bigint DEFAULT NULL,
  `email_address` varchar(255) NOT NULL,
  `restaurant_img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `restaurant`
--

INSERT INTO `restaurant` (`id`, `name`, `password`, `food_type`, `description`, `delivery_time`, `meal_id`, `email_address`, `restaurant_img`) VALUES
(1, 'zzz', '$2a$10$kAJ1v3nPHXIRtdkYNFn9ge/tk322XHUGfcBOy9GcuCKVGgltDGk/m', 'Kebab', 'Halal kebab', NULL, NULL, 'zzz@zzz.com', NULL),
(2, 'quick', '$2a$10$i87g56SuD4mQajpY0vlOk.K3VuyV8FpGIVNKm4UsVnelpHiyOk03q', NULL, NULL, NULL, NULL, 'quick@quick.quick', '/uploads/1725867627944.png');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `meal`
--
ALTER TABLE `meal`
  ADD PRIMARY KEY (`meal_id`),
  ADD KEY `fk_restaurant` (`restaurant_id`);

--
-- Index pour la table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `restaurant_id` (`restaurant_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `meal`
--
ALTER TABLE `meal`
  MODIFY `meal_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `rating`
--
ALTER TABLE `rating`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `meal`
--
ALTER TABLE `meal`
  ADD CONSTRAINT `fk_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`id`);

--
-- Contraintes pour la table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`id`),
  ADD CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `client` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
