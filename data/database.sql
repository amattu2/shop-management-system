-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 08, 2019 at 09:29 AM
-- Server version: 5.7.28-0ubuntu0.18.04.4
-- PHP Version: 7.2.24-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_DB`
--

-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--

CREATE TABLE `Customers` (
  `CusID` int(4) NOT NULL DEFAULT '0',
  `isActive` int(1) NOT NULL DEFAULT '1',
  `CusLastName` varchar(28) DEFAULT NULL,
  `CusFirstName` varchar(20) DEFAULT NULL,
  `CusMI` varchar(10) DEFAULT NULL,
  `CusOldName` varchar(17) DEFAULT NULL,
  `CusStreet1` varchar(39) DEFAULT NULL,
  `CusStreet2` varchar(10) DEFAULT NULL,
  `CusCity` varchar(21) DEFAULT NULL,
  `CusState` varchar(2) DEFAULT NULL,
  `CusZip` varchar(10) DEFAULT NULL,
  `CusHome` varchar(14) DEFAULT NULL,
  `CusWork` varchar(14) DEFAULT NULL,
  `CusCell` varchar(14) DEFAULT NULL,
  `CusFax` varchar(14) DEFAULT NULL,
  `CusEmail_H` varchar(255) NOT NULL,
  `CusEmail_W` varchar(255) NOT NULL,
  `CusNotes` varchar(213) DEFAULT NULL,
  `CusLastVisit` varchar(10) DEFAULT NULL,
  `AE_CusId` int(4) DEFAULT NULL,
  `Mail` varchar(5) DEFAULT NULL,
  `Remind` int(1) DEFAULT NULL,
  `BalanceDue` int(1) DEFAULT NULL,
  `PreviousDue` int(1) DEFAULT NULL,
  `Contact` varchar(25) DEFAULT NULL,
  `NonTaxable` varchar(5) DEFAULT NULL,
  `Company` varchar(5) DEFAULT NULL,
  `MgrID` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` (`CusID`, `isActive`, `CusLastName`, `CusFirstName`, `CusMI`, `CusOldName`, `CusStreet1`, `CusStreet2`, `CusCity`, `CusState`, `CusZip`, `CusHome`, `CusWork`, `CusCell`, `CusFax`, `CusEmail_H`, `CusEmail_W`, `CusNotes`, `CusLastVisit`, `AE_CusId`, `Mail`, `Remind`, `BalanceDue`, `PreviousDue`, `Contact`, `NonTaxable`, `Company`, `MgrID`) VALUES
(1, 1, 'Ben', 'Mourside', 'K', NULL, '1001 North Penn Ave.', NULL, 'Rockworld', 'RA', '20001', '4108009000', '4118001900', '4018002900', NULL, 'benmourside@example.com', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FALSE', 'FALSE', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `InvoiceItems`
--

CREATE TABLE `InvoiceItems` (
  `EstItemNum` int(11) NOT NULL,
  `EstNum` int(15) DEFAULT NULL,
  `PartNo` varchar(25) DEFAULT NULL,
  `JobDesc` varchar(255) DEFAULT NULL,
  `Quantity` varchar(3) DEFAULT NULL,
  `Price` float NOT NULL,
  `ShopTime` float DEFAULT NULL,
  `Total` float DEFAULT NULL,
  `IsTaxable` int(1) DEFAULT NULL,
  `InvType` varchar(20) DEFAULT NULL,
  `Tech1` varchar(10) DEFAULT NULL,
  `Tech2` varchar(10) DEFAULT NULL,
  `TechSplit` int(10) DEFAULT NULL,
  `Cost` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `InvoiceMisc`
--

CREATE TABLE `InvoiceMisc` (
  `MiscItemID` int(11) NOT NULL,
  `EstNum` int(11) NOT NULL,
  `EstItemNum` int(11) NOT NULL,
  `isChecked` int(11) NOT NULL,
  `ShortDesc` int(11) NOT NULL,
  `Amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Invoices`
--

CREATE TABLE `Invoices` (
  `EstNum` int(5) NOT NULL DEFAULT '0',
  `EstDesc` varchar(50) DEFAULT NULL,
  `EstDate` varchar(16) DEFAULT NULL,
  `Make` varchar(17) DEFAULT NULL,
  `Model` varchar(26) DEFAULT NULL,
  `ModId` varchar(5) DEFAULT NULL,
  `ModYear` int(4) DEFAULT NULL,
  `PayType` varchar(3) DEFAULT NULL,
  `SalesTaxAmt` decimal(5,2) DEFAULT NULL,
  `SalesTaxTypeId` int(1) DEFAULT NULL,
  `CarDesc` varchar(64) DEFAULT NULL,
  `CarNotInSys` int(2) DEFAULT NULL,
  `EngDesc` varchar(37) DEFAULT NULL,
  `EngCode` varchar(6) DEFAULT NULL,
  `Tag` varchar(20) DEFAULT NULL,
  `Mileage` int(6) DEFAULT NULL,
  `VIN` varchar(20) DEFAULT NULL,
  `Truck` varchar(10) DEFAULT NULL,
  `MgrID` int(1) DEFAULT NULL,
  `CusID` int(4) DEFAULT NULL,
  `TaxExempt` int(2) DEFAULT NULL,
  `Total` decimal(8,4) DEFAULT NULL,
  `PartsTotal` decimal(8,4) DEFAULT NULL,
  `LaborTotal` decimal(9,4) DEFAULT NULL,
  `MiscTotal` decimal(6,2) DEFAULT NULL,
  `TaxMisc` decimal(3,2) DEFAULT NULL,
  `CarId` int(4) DEFAULT NULL,
  `UserDesc` varchar(50) DEFAULT NULL,
  `LastName` varchar(25) DEFAULT NULL,
  `FirstName` varchar(20) DEFAULT NULL,
  `MI` varchar(10) DEFAULT NULL,
  `Street1` varchar(36) DEFAULT NULL,
  `Street2` varchar(10) DEFAULT NULL,
  `City` varchar(28) DEFAULT NULL,
  `State` varchar(2) DEFAULT NULL,
  `Zip` varchar(10) DEFAULT NULL,
  `Home` varchar(14) DEFAULT NULL,
  `Work` varchar(14) DEFAULT NULL,
  `Cell` varchar(14) DEFAULT NULL,
  `Fax` varchar(14) DEFAULT NULL,
  `PrintedEstNum` int(4) DEFAULT NULL,
  `UseFLFooter` int(1) DEFAULT NULL,
  `TicketType` varchar(8) DEFAULT NULL,
  `AE_CarId` int(1) DEFAULT NULL,
  `AE_CusId` int(1) DEFAULT NULL,
  `Notes` varchar(722) DEFAULT NULL,
  `Extra` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Invoices`
--

INSERT INTO `Invoices` (`EstNum`, `EstDesc`, `EstDate`, `Make`, `Model`, `ModId`, `ModYear`, `PayType`, `SalesTaxAmt`, `SalesTaxTypeId`, `CarDesc`, `CarNotInSys`, `EngDesc`, `EngCode`, `Tag`, `Mileage`, `VIN`, `Truck`, `MgrID`, `CusID`, `TaxExempt`, `Total`, `PartsTotal`, `LaborTotal`, `MiscTotal`, `TaxMisc`, `CarId`, `UserDesc`, `LastName`, `FirstName`, `MI`, `Street1`, `Street2`, `City`, `State`, `Zip`, `Home`, `Work`, `Cell`, `Fax`, `PrintedEstNum`, `UseFLFooter`, `TicketType`, `AE_CarId`, `AE_CusId`, `Notes`, `Extra`) VALUES
(1, 'TEST INVOICE', '12/08/2019 09:09', 'BMW', '335i', NULL, 2018, NULL, '0.00', 0, '2018 BMW 335I M-SPORT 3.0L N54', 0, '3.0L N54B30A', '0', 'HTML TEST ', 0, 'NONE', NULL, NULL, 1, 0, '0.0000', '0.0000', '0.0000', '0.00', '0.00', 1, 'TEST INVOICE', 'Mourside', 'Ben', NULL, ' ', '', '', '', '', '', '', '', '', 1, 0, 'Invoice', NULL, NULL, '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Logs`
--

CREATE TABLE `Logs` (
  `id` int(6) UNSIGNED NOT NULL,
  `Action` varchar(15) NOT NULL,
  `CusID` varchar(9) DEFAULT NULL,
  `Column` varchar(255) DEFAULT NULL,
  `Data` varchar(1000) DEFAULT NULL,
  `User` varchar(20) DEFAULT NULL,
  `Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Memos`
--

CREATE TABLE `Memos` (
  `id` int(11) NOT NULL,
  `attn` varchar(20) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `author` varchar(20) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PackageItems`
--

CREATE TABLE `PackageItems` (
  `ItemID` int(11) NOT NULL,
  `PkgID` int(3) DEFAULT NULL,
  `PartNo` varchar(13) DEFAULT NULL,
  `JobDesc` varchar(58) DEFAULT NULL,
  `Hours` decimal(3,2) DEFAULT NULL,
  `Price` decimal(6,2) DEFAULT NULL,
  `Total` decimal(6,3) DEFAULT NULL,
  `CostEach` varchar(3) DEFAULT NULL,
  `InvType` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Packages`
--

CREATE TABLE `Packages` (
  `ID` int(11) NOT NULL,
  `ShortDesc` varchar(15) DEFAULT NULL,
  `LongDesc` varchar(39) DEFAULT NULL,
  `AddDate` varchar(22) DEFAULT NULL,
  `Count` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Packages`
--

INSERT INTO `Packages` (`ID`, `ShortDesc`, `LongDesc`, `AddDate`, `Count`) VALUES
(133, 'Test Pkg', 'Test Pkg Description', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Schedule_Appts`
--

CREATE TABLE `Schedule_Appts` (
  `AppID` int(11) NOT NULL,
  `AppCusID` int(4) DEFAULT NULL,
  `AppDate` varchar(11) DEFAULT NULL,
  `AppTimeBegin` varchar(8) DEFAULT NULL,
  `AppTimeLengthMin` int(2) DEFAULT NULL,
  `AppStatus` varchar(9) DEFAULT NULL,
  `AppLabel` varchar(8) DEFAULT NULL,
  `AppNotes` varchar(113) DEFAULT NULL,
  `AppService` varchar(22) DEFAULT NULL,
  `AppEstimate` decimal(4,2) DEFAULT NULL,
  `AppProviderID` int(1) DEFAULT NULL,
  `AppVehicle` varchar(12) DEFAULT NULL,
  `AppReminder` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Schedule_Services`
--

CREATE TABLE `Schedule_Services` (
  `id` int(11) NOT NULL,
  `LengthMin` int(11) NOT NULL DEFAULT '60',
  `Label` varchar(20) DEFAULT NULL,
  `Description` varchar(60) DEFAULT NULL,
  `Private` int(1) NOT NULL DEFAULT '1',
  `Reminder` int(1) NOT NULL DEFAULT '0',
  `Sort` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_Accounts`
--

CREATE TABLE `user_Accounts` (
  `id` int(11) NOT NULL,
  `IP` varchar(20) DEFAULT NULL,
  `username` varchar(65) NOT NULL DEFAULT '',
  `name` varchar(30) NOT NULL,
  `initials` varchar(3) DEFAULT NULL,
  `AuthLevel` int(1) NOT NULL DEFAULT '0',
  `password` varchar(65) NOT NULL DEFAULT '',
  `email` varchar(65) NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `mod_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `memo` varchar(1024) NOT NULL DEFAULT ' '
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_Accounts`
--

INSERT INTO `user_Accounts` (`id`, `IP`, `username`, `name`, `initials`, `AuthLevel`, `password`, `email`, `verified`, `mod_timestamp`, `memo`) VALUES
(6, NULL, 'test', 'Test Tester', 'TT', 2, '$2y$10$GaKqdTlBXq1Bnq0IsX5eWO9q5qfOyr6Q7eVQ5C28iFJXiPIIg2VEu', 'test@example.com', 1, '2019-12-08 14:03:24', ' Test memo');

-- --------------------------------------------------------

--
-- Table structure for table `user_Attempts`
--

CREATE TABLE `user_Attempts` (
  `IP` varchar(20) NOT NULL,
  `Attempts` int(11) NOT NULL,
  `LastLogin` datetime NOT NULL,
  `Username` varchar(65) DEFAULT NULL,
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_Attempts`
--

INSERT INTO `user_Attempts` (`IP`, `Attempts`, `LastLogin`, `Username`, `ID`) VALUES
('::1', 1, '2019-12-08 09:29:01', 'root', 21),
('::1', 1, '2019-12-08 09:03:35', 'test', 22);

-- --------------------------------------------------------

--
-- Table structure for table `Vehicles`
--

CREATE TABLE `Vehicles` (
  `CarId` int(4) NOT NULL DEFAULT '0',
  `CusId` int(4) DEFAULT NULL,
  `ModId` varchar(4) DEFAULT NULL,
  `ModYear` varchar(4) DEFAULT NULL,
  `Tag` varchar(20) DEFAULT NULL,
  `Mileage` int(7) DEFAULT NULL,
  `VIN` varchar(22) DEFAULT NULL,
  `Truck` varchar(14) DEFAULT NULL,
  `CarDesc` varchar(64) DEFAULT NULL,
  `EngDesc` varchar(37) DEFAULT NULL,
  `EngCode` varchar(6) DEFAULT NULL,
  `CarNotInSys` int(2) DEFAULT NULL,
  `Make` varchar(23) DEFAULT NULL,
  `Model` varchar(26) DEFAULT NULL,
  `AE_CusId` int(1) DEFAULT NULL,
  `AE_CarId` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Vehicles`
--

INSERT INTO `Vehicles` (`CarId`, `CusId`, `ModId`, `ModYear`, `Tag`, `Mileage`, `VIN`, `Truck`, `CarDesc`, `EngDesc`, `EngCode`, `CarNotInSys`, `Make`, `Model`, `AE_CusId`, `AE_CarId`) VALUES
(1, 1, '0', '2017', 'HTML TEST ', 0, 'NONE', '', '2017 BMW 335I M-SPORT 3.0L N54', '3.0L N54B30A', '0', 0, 'BMW', '335i', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`CusID`);

--
-- Indexes for table `InvoiceItems`
--
ALTER TABLE `InvoiceItems`
  ADD PRIMARY KEY (`EstItemNum`),
  ADD KEY `EstNum` (`EstNum`);

--
-- Indexes for table `InvoiceMisc`
--
ALTER TABLE `InvoiceMisc`
  ADD PRIMARY KEY (`MiscItemID`);

--
-- Indexes for table `Invoices`
--
ALTER TABLE `Invoices`
  ADD PRIMARY KEY (`EstNum`);

--
-- Indexes for table `Logs`
--
ALTER TABLE `Logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Memos`
--
ALTER TABLE `Memos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `PackageItems`
--
ALTER TABLE `PackageItems`
  ADD UNIQUE KEY `PJItemID` (`ItemID`);

--
-- Indexes for table `Packages`
--
ALTER TABLE `Packages`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Schedule_Appts`
--
ALTER TABLE `Schedule_Appts`
  ADD PRIMARY KEY (`AppID`);

--
-- Indexes for table `Schedule_Services`
--
ALTER TABLE `Schedule_Services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_Accounts`
--
ALTER TABLE `user_Accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- Indexes for table `user_Attempts`
--
ALTER TABLE `user_Attempts`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Vehicles`
--
ALTER TABLE `Vehicles`
  ADD PRIMARY KEY (`CarId`),
  ADD KEY `CarId` (`CarId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `InvoiceItems`
--
ALTER TABLE `InvoiceItems`
  MODIFY `EstItemNum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=383572;
--
-- AUTO_INCREMENT for table `Logs`
--
ALTER TABLE `Logs`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `PackageItems`
--
ALTER TABLE `PackageItems`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=810;
--
-- AUTO_INCREMENT for table `Packages`
--
ALTER TABLE `Packages`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;
--
-- AUTO_INCREMENT for table `Schedule_Appts`
--
ALTER TABLE `Schedule_Appts`
  MODIFY `AppID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `Schedule_Services`
--
ALTER TABLE `Schedule_Services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `user_Accounts`
--
ALTER TABLE `user_Accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `user_Attempts`
--
ALTER TABLE `user_Attempts`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
