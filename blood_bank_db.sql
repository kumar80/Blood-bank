-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 03, 2020 at 11:00 AM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12



/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blood_bank_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `blood_info`
--

CREATE DATABASE IF NOT EXISTS `blood_bank_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `blood_bank_db`;


CREATE TABLE `blood_info` (
  `id` varchar(100) NOT NULL,
  `blood_type` varchar(100) NOT NULL,
  `collection_date` varchar(100) NOT NULL,
  `units` int(100) NOT NULL,
  `hospital_id` varchar(100) NOT NULL,
  `hospital_name` varchar(100) NOT NULL,
  `hospital_phone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blood_info`
--

INSERT INTO `blood_info` (`id`, `blood_type`, `collection_date`, `units`, `hospital_id`, `hospital_name`, `hospital_phone`) VALUES
('5fc8b6b2eeb72', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b725eb894', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b7275ca41', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b72784221', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b727a8100', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b727cc12c', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b727ece5c', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b7281c9b8', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b72841224', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b72871ad3', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b7288ddd0', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b728b7093', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b728e7244', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b72912917', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b7293b3c4', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b72966548', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b7298f030', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932'),
('5fc8b729b91a3', 'B+', '2020-12-17', 565, '5fc8b5ec70618', 'xadasdas', '9334262932');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` varchar(100) NOT NULL,
  `receiver_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `units` int(100) NOT NULL,
  `hospital_id` varchar(100) NOT NULL,
  `date` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `receiver_blood_type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_hosp`
--

CREATE TABLE `user_hosp` (
  `id` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hash` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_hosp`
--

INSERT INTO `user_hosp` (`id`, `email`, `hash`, `phone`, `address`, `name`) VALUES
('5fc82049917d8', 's@d.c', '$2y$15$ntx65XIhJg0IXSsCdyH/kejRQwroUnyFUQuOpVotrqojYbx6crZOe', '1234567890', '89', 'sda'),
('5fc8b483815fa', 'c@c.x', '$2y$15$PHk73HX4a7Lrq2SOs4HKGO2Ytpk0j35X7aLEgj6G9i8.QKKrzvM1C', '9334262932', '9898989', 'chandan'),
('5fc8b5ec70618', 'x@x.c', '$2y$15$FVfug1omPfhh7Mc4i5vp6OpeVkH7E0X.PM0W3yn3OjQ2P7UF0JDIq', '9334262932', '98sdada9ds4', 'xadasdas');

-- --------------------------------------------------------

--
-- Table structure for table `user_rec`
--

CREATE TABLE `user_rec` (
  `id` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hash` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `blood_type` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_rec`
--

INSERT INTO `user_rec` (`id`, `name`, `hash`, `phone`, `blood_type`, `email`) VALUES
('5fc8b5d75a940', 'cjajia', '$2y$15$/vXT87ly0QpZTdTnlAH.EOQlMd.Uebkp1dDaeDJL4dSA93o96EBrG', '9334262932', 'B+', 'x@x.x'),
('5fc8b6314874d', 'caskl', '$2y$15$1/LLq9aic1b6EdNZiPraYeh9IxUNq8NGLZOcRL3noU4KYMCSscgv2', '9334262932', 'B+', 'x@x.c');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blood_info`
--
ALTER TABLE `blood_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_hosp`
--
ALTER TABLE `user_hosp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_rec`
--
ALTER TABLE `user_rec`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
