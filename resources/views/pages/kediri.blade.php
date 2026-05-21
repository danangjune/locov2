@extends('layouts.app')

@section('content')
  <div class="container py-5">
    <h1 class="mb-5 text-center fw-bolder">Selayang Pandang</h1>

    <br>

    <div class="d-flex flex-wrap gap-5">
      <div>
        <img src="{{ asset('assets/img/kediri/harmoni.jpeg') }}" style="width: 300px; height: 300px;" class="rounded object-fit-cover shadow" alt="">
      </div>
      <div style="flex: 1;">
        <h4 class="fw-bold text-primary">Profil Wilayah</h4>
        <p class="text-muted">Kota Kediri ”berumah” nan jauh arah barat daya Ibu Kota Provinsi Jawa Timur, Surabaya. Jarak dari Kota Pahlawan sekitar 130 km. Untuk catatan jumlah penduduk, Kota Kediri adalah kota terbesar nomor 3 (tiga) di Jawa Timur. Kota nomor satu diduduki Surabaya. Disusul di nomor urut 2 (dua) Kota Malang. Menurut Badan Pusat Statistik (BPS) Jawa Timur, sampai 2018 penduduk Kota Kediri berjumlah 292.768 orang/jiwa. Seluruh wilayah kota ibarat dalam kepungan Kabupaten Kediri. Ini karena seluruh wilayahnya berbatasan dengan Kabupaten Kediri. Baik sebelah utara, barat, selatan, maupun timur berbatasan dengan Kabupaten Kediri. Kota Kediri juga terbelah oleh sungai tua dengan histori dan heroisme besar Kali Brantas.</p>
        <br>
        <h4 class="fw-bold text-primary">Posisi Geografis</h4>
        <p class="text-muted">Kota Kediri eksis pada posisi antara 111º05´ – 112º03´ Bujur Timur dan 7º45´ – 7º55´ Lintang Selatan. Adapun dari aspek topografi, Kota Kediri terletak pada ketinggian rata-rata 67 meter di atas permukaan laut. Tingkat kemiringannya 0-40 persen.</p>
        <br>
        <h4 class="fw-bold text-primary">Luas Kota</h4>
        <p class="text-muted">Luas wilayah Kota Kediri adalah 67,2 km2, secara administratif terbagi menjadi tiga Kecamatan, yaitu Kecamatan Mojoroto, Kecamatan Kota dan Kecamatan Pesantren, dan 46 Kelurahan. Kecamatan Mojoroto dengan luas wilayah 26,93 km2 terdiri dari 14 Kelurahan, Kecamatan Kota terdiri dari 17 Kelurahan dengan luas wilayah 15,95 km2, dan Kecamatan Pesantren dengan luas wilayah 24,32 km2  terdiri dari 15 Kelurahan.</p>
      </div>
    </div>

    <br>

    <div class="d-flex flex-wrap gap-5">
      <div style="flex: 1;">
        <h4 class="fw-bold text-primary">Sejarah Singkat</h4>
        <p class="text-muted">Artefak arkeologi yang ditemukan pada tahun 2007 menunjukkan bahwa daerah sekitar Kediri menjadi lokasi kerajaan Kediri, sebuah kerajaan Hindu pada abad ke-11. Awal mula Kediri sebagai pemukiman perkotaan dimulai ketika Airlangga memindahkan pusat pemerintahan kerajaannya dari Kahuripan ke Dahanapura, menurut Serat Calon Arang. Dahanapura (Kota Api) selanjutnya lebih dikenal sebagai Daha. Sepeninggal Raja Airlangga, wilayah Medang dibagi menjadi dua: Panjalu di barat dan Janggala di timur. Daha menjadi pusat pemerintahan Kerajaan Panjalu dan Kahuripan menjadi pusat pemerintahan Kerajaan Jenggala. Panjalu oleh penulis-penulis periode belakangan juga disebut sebagai Kerajaan Kadiri/Kediri.</p>
        <p class="text-muted">Semenjak Kerajaan Tumapel (Singasari) menguat, ibukota Daha diserang dan kota ini menjadi kedudukan raja vazal, yang terus berlanjut hingga Majapahit, Demak, dan Mataram. Kediri jatuh ke tangan VOC sebagai konsekuensi Geger Pecinan. Jawa Timur pada saat itu dikuasai Cakraningrat IV, adipati Madura yang memihak VOC dan menginginkan bebasnya Madura dari Kasunanan Kartasura. Karena Cakraningrat IV keinginannya ditolak oleh VOC, ia memberontak. Pemberontakannya ini dikalahkan VOC, dibantu Pakubuwana II, sunan Kartasura. Sebagai pembayaran, Kediri menjadi bagian yang dikuasai VOC. Kekuasaan Belanda atas Kediri terus berlangsung sampai Perang Kemerdekaan Indonesia.</p>
        <p class="text-muted">Perkembangan Kota Kediri menjadi swapraja dimulai ketika diresmikannya Gemeente Kediri pada tanggal 1 April 1906 berdasarkan Staasblad (Lembaran Negara) no. 148 tertanggal 1 Maret 1906. Gemeente ini menjadi tempat kedudukan Residen Kediri dengan sifat pemerintahan otonom terbatas dan mempunyai Gemeente Raad (Dewan Kota/DPRD) sebanyak 13 orang, yang terdiri dari delapan orang golongan Eropa dan yang disamakan (Europeanen), empat orang Pribumi (Inlanders) dan satu orang Bangsa Timur Asing. Sebagai tambahan, berdasarkan Staasblad No. 173 tertanggal 13 Maret 1906 ditetapkan anggaran keuangan sebesar f. 15.240 dalam satu tahun. Baru sejak tanggal 1 Nopember 1928 berdasarkan Stbl No. 498 tanggal 1 Januari 1928, Kota Kediri menjadi "Zelfstanding Gemeenteschap" ("kota swapraja" dengan menjadi otonomi penuh).</p>
      </div>
      <div>
        <img src="{{ asset('assets/img/kediri/gunung-klotok.jpg') }}" style="width: 300px; height: 300px;" class="mt-4 rounded object-fit-cover shadow" alt="">
      </div>
    </div>

    <br>

    <div class="d-flex flex-wrap gap-5">
      <div>
        <img src="{{ asset('assets/img/kediri/taman-sekartaji.jpg') }}" style="width: 300px; height: 300px;" class="rounded object-fit-cover shadow" alt="">
      </div>
      <div style="flex: 1;">
        <h4 class="fw-bold text-primary">Kediri, The Service City</h4>
        <p class="text-muted">Untuk Meningkatkan peluang investasi di Kota Kediri, pemerintah kota menerapkan berbagai layanan untuk memberikan kemudahan bagi calon investor. Salah satunya adalah pembentukan Badan Penanaman Modal (BPM) Kota Kediri yang mempunyai tugas melaksanakan sebagian urusan pemerintah daerah dibidang penanaman modal yang meliputi perencanaan, pelaksanaan dan pengendalian sesuai dengan kebijakan Walikota Kediri.</p>
        <p class="text-muted">Pemerintah Kota Kediri juga berbenah dalam penigkatan pelayanan prima kepada masyarakat. Agar pelayanan terhadap masyarakat lebih representatif, pemerintah melakukan perbaikan gedung pelayanan di seluruh kelurahan yang ada di Kota Kediri. Tidak hanya gedung pelayanannya saja namun sarana dan prasarana pendukung pelayanan juga diperbaiki. Diharapkan dengan gedung pelayanan yang baru, suasana baru bisa tumbuh, sehingga mendorong gairah dan semangat kerja yang produktif dalam melayani masyarakat.</p>
        <p class="text-muted">Keberadaan BPM ditujukan untuk membantu para investor menanamkan modalnya di Kota Kediri. BPM memberikan kemudahan layanan perijinan yang disyaratkan. Dari sekitar 153 item perjanjian, hanya 4 (empat) yang berbayar, sisanya gratis. Dengan berbagai kemudahan tersebut Pemkot Kediri mendapatkan penghargaan "Investmen Award" 2015 di bidang pelayanan penanaman modal oleh Gubernur Jawa Timur Soekarwo.</p>
      </div>
    </div>
  </div>
@endsection
