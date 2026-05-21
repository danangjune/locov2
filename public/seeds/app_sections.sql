-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.42-0ubuntu0.20.04.1 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             12.7.0.6850
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping data for table pecut.app_sections: ~8 rows (approximately)
DELETE FROM `app_sections`;
INSERT INTO `app_sections` (`id`, `title`, `description`, `created_at`, `updated_at`) VALUES
	(1, 'Pendidikan', NULL, NULL, NULL),
	(2, 'Kesehatan', NULL, NULL, NULL),
	(3, 'Kependudukan', NULL, NULL, NULL),
	(4, 'Keuangan', NULL, NULL, NULL),
	(5, 'Pemerintahan', NULL, NULL, NULL),
	(6, 'Satu Data', NULL, NULL, NULL),
	(7, 'Kepolisian', NULL, NULL, NULL),
	(8, 'Sosial', NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
