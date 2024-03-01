DROP DATABASE IF EXISTS smrpo;
CREATE DATABASE smrpo;
USE smrpo;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `users`;

CREATE TABLE IF NOT EXISTS `users` (
  `user` varchar(255) NOT NULL,
  `password` varchar(255) COLLATE utf8_slovenian_ci NOT NULL,
  `status` varchar(255) COLLATE utf8_slovenian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

INSERT INTO `users` (`user`, `password`, `status`) VALUES
('root', 'admin', 'PM'),
('janez', 'novak', 'MASTER'),
('jana', 'horvat', 'DEV');

ALTER TABLE `users`
  ADD PRIMARY KEY (`user`);