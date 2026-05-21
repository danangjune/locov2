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

-- Dumping data for table pecut.urusan: ~40 rows (approximately)
DELETE FROM `urusan`;
INSERT INTO `urusan` (`id`, `title`, `description`, `icon_name`, `created_at`, `updated_at`) VALUES
	(1, 'Pendidikan', 'Semua Layanan Pendidikan', 'icon_pendidikan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(2, 'Kesehatan', 'Semua Layanan Kesehatan', 'icon-kesehatan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(3, 'Pekerjaan Umum dan Penataan Ruang', 'Semua Layanan Pekerjaan Umum dan Penataan Ruang', 'icon-pu.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(4, 'Perumahan Rakyat dan Kawasan Pemukiman', 'Semua Layanan Perumahan Rakyat dan Kawasan Pemukiman', 'icon-perumahan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(5, 'Ketentraman, Ketertiban Umum, dan Perlindungan Masyarakat', 'Semua Layanan Ketentraman, Ketertiban Umum, dan Perlindungan Masyarakat', 'icon-satpolpp.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(6, 'Sosial', 'Semua Layanan Sosial', 'icon_bantuan_sosial.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(7, 'Tenaga Kerja', 'Semua Layanan Tenaga Kerja', 'icon-naker.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(8, 'Pemberdayaan perempuan dan perlindungan anak', 'Semua Layanan Pemberdayaan perempuan dan perlindungan anak', 'icon-pemerintahan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(9, 'Pangan', 'Semua Layanan Pangan', 'icon-pemerintahan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(10, 'Pertanahan', 'Semua Layanan Pertanahan', 'icon_kearsipan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(11, 'Lingkungan Hidup', 'Semua Layanan Lingkungan Hidup', 'icon-linghup.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(12, 'Administrasi dan Pencatatan Sipil', 'Semua Layanan Administrasi dan Pencatatan Sipil', 'icon_kependudukan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(13, 'Pemberdayaan Masyarakat dan Desa', 'Semua Layanan Pemberdayaan Masyarakat dan Desa', 'icon-pemberdayaan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(14, 'Pengendalian Penduduk dan Keluarga Berencana', 'Semua Layanan Pengendalian Penduduk dan Keluarga Berencana', 'icon-pemerintahan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(15, 'Perhubungan', 'Semua Layanan Perhubungan', 'icon-perhubungan.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(16, 'Komunikasi dan Informatika', 'Semua Layanan Komunikasi dan Informatika', 'icon-kominfo.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(17, 'Koperasi, Usaha Kecil dan Menengah', 'Semua Layanan Koperasi, Usaha Kecil dan Menengah', 'icon-koperasi.png', '2024-08-07 13:55:39', '2024-08-07 13:55:43'),
	(18, 'Penanaman Modal', 'Semua Layanan Penanaman Modal', 'icon-penmodal.png', '2024-08-12 15:17:26', '2024-08-12 15:17:27'),
	(19, 'Kepemudaan dan Olahraga', 'Semua Layanan Kepemudaan dan Olahraga', 'icon-pemerintahan.png', '2024-08-20 09:33:43', '2024-08-20 09:33:45'),
	(20, 'Statistik', 'Semua Layanan Statistik', 'icon-statistik.png', '2024-07-23 13:39:51', '2024-07-23 13:39:51'),
	(21, 'Persandian', 'Semua Layanan Persandian', 'icon-persandian.png', NULL, NULL),
	(22, 'Kebudayaan', 'Semua Layanan Kebudayaan', 'icon-pemerintahan.png', NULL, NULL),
	(23, 'Perpustakaan', 'Semua Layanan Perpustakaan', 'icon-pemerintahan.png', NULL, NULL),
	(24, 'Kearsipan', 'Semua Layanan Kearsipan', 'icon_kearsipan.png', NULL, NULL),
	(25, 'Kelautan dan Perikanan', 'Semua Layanan Kelautan dan Perikanan', 'icon-pemerintahan.png', NULL, NULL),
	(26, 'Pariwisata', 'Semua Layanan Pariwisata', 'icon-pariwisata.png', NULL, NULL),
	(27, 'Pertanian', 'Semua Layanan Pertanian', 'icon-pemerintahan.png', NULL, NULL),
	(28, 'Kehutanan', 'Semua Layanan Kehutanan', 'icon-kehutanan.png', NULL, NULL),
	(29, 'Energi dan Sumber Daya Mineral', 'Semua Layanan Energi dan SUmber Daya Mineral', 'icon-pemerintahan.png', NULL, NULL),
	(30, 'Perdagangan', 'Semua Layanan Perdagangan', 'icon-perdagangan.png', NULL, NULL),
	(31, 'Perindustrian', 'Semua Layanan Perindustrian', 'icon-pemerintahan.png', NULL, NULL),
	(32, 'Transmigrasi', 'Semua Layanan Transmigrasi', 'icon-pemerintahan.png', NULL, NULL),
	(33, 'Keuangan', 'Semua Layanan Keuangan', 'icon_keuangan.png', NULL, NULL),
	(34, 'Pengadaan Barang & Jasa', 'Semua Layanan Pengadaan Barang & Jasa', 'icon_asset_pengadaan.png', NULL, NULL),
	(35, 'Pengaduan', 'Semua Layanan Pengaduan', 'icon-pelaporan.png', NULL, NULL),
	(36, 'Hukum', 'Semua Layanan Hukum', 'icon-hukum.png', NULL, NULL),
	(37, 'Kepegawaian', 'Semua Layanan Kepegawaian', 'icon-kepegawaian.png', NULL, NULL),
	(38, 'Web Profil OPD', 'Semua Layanan Web Profil OPD', 'icon-pemerintahan.png', NULL, NULL),
	(40, 'Perangkat Daerah', 'Semua Layanan Perangkat Daerah', 'icon_perangkat_daerah.png', NULL, NULL),
	(41, 'Pelayanan', 'Semua Layanan Pelayanan', 'icon-pemerintahan.png', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
