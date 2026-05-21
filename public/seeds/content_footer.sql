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

-- Dumping data for table pecut.content_footer: ~16 rows (approximately)
DELETE FROM `content_footer`;
INSERT INTO `content_footer` (`id`, `content`, `parent`, `url`, `icon`, `image`, `idx_content`, `tab_content`, `statusenabled`, `created_at`, `updated_at`) VALUES
	(1, 'Hubungi Kami', 0, NULL, NULL, NULL, 0, 1, 1, NULL, NULL),
	(2, 'Apakah itu Pecut?', 0, NULL, NULL, NULL, 0, 2, 0, NULL, NULL),
	(3, 'Satu Pintu', 0, NULL, NULL, NULL, 0, 3, 0, NULL, NULL),
	(4, 'Kontak', 0, NULL, NULL, NULL, 0, 4, 1, NULL, NULL),
	(5, 'Syarat dan Ketentuan', 1, '/syarat-ketentuan', NULL, NULL, 0, NULL, 0, NULL, NULL),
	(7, 'Sang pecut, yang memiliki sifat keras dan lentur, mengajarkan sikap bijaksana dan beradab, terutama bagi setiap aparatur sipil negara baik sebagai pemimpin birokrasi sekaligus sebagai pelayan masyarakat. Kerasnya pecut mencerminkan keteguhan prinsip, sementara lenturnya melambangkan kemampuan bergaul dan membangun jaringan. Dalam kehidupan, pecut menjadi alat penting, seperti dalam pentas seni jaranan dan membajak sawah. Pecut bahkan bisa menjadi simbol bahwa seorang pemimpin birokrasi sekaligus sebagai pelayan masyarakat harus mampu mengatasi tantangan dengan sikap yang bijaksana untuk meraih keberhasilan dalam tugasnya dan pelayanan terbaik kepada masyarakat.', 2, NULL, NULL, NULL, 0, NULL, 1, NULL, NULL),
	(8, 'Kediri Smart Service adalah Balaikota Virtual atau Portal maya Pemerintah Kota Kediri dalam rangka memberikan layanan langsung kepada semua masyarakat di Kota Kediri.', 3, NULL, NULL, NULL, 0, NULL, 0, NULL, NULL),
	(9, 'Instagram', 4, 'https://www.instagram.com/pemkotkediri/', 'bi bi-instagram', NULL, 2, NULL, 1, NULL, NULL),
	(10, 'Twitter', 4, 'https://x.com/pemkot_kediri', 'bi bi-twitter', NULL, 3, NULL, 1, NULL, NULL),
	(11, 'Facebook', 4, 'https://www.facebook.com/pemkotkediri.nda/', 'bi bi-facebook', NULL, 4, NULL, 1, NULL, NULL),
	(12, 'Youtube', 4, 'https://www.youtube.com/@harmonitvkediri6889', 'bi bi-youtube', NULL, 5, NULL, 1, NULL, NULL),
	(13, '(0354) 682955', 4, '(0354) 682955', 'bi bi-telephone-fill', NULL, 0, NULL, 1, NULL, NULL),
	(14, 'Kediri Kota', 4, 'https://www.kedirikota.go.id/', 'bi bi-globe-central-south-asia', NULL, 1, NULL, 1, NULL, NULL),
	(19, 'Kebijakan Privasi Data', 1, '/privasi-data', NULL, NULL, 0, NULL, 0, NULL, NULL),
	(20, 'hhh', 1, NULL, NULL, NULL, 2, NULL, 0, NULL, NULL),
	(21, 'Telegram', 4, 'https://telegram.com/kedirikota', 'bi bi-telegram', NULL, 6, NULL, 0, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
