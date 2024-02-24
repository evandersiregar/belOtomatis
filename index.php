<?php 
include 'koneksi.php';

session_start();
if( !isset($_SESSION['username']) ){
    echo '<script>alert("Silahkan login terlebih dahulu");</script>';
    echo '<script>window.location="login.php";</script>';
}
$pilihanHari = $hari;

if(isset($_GET['pilihanHari'])){
  if($pilihanHari != "semua"){
    $pilihanHari = $_GET['pilihanHari'];
  }
}


function isSelected($value){
  global $pilihanHari;
  if($pilihanHari == $value){
    return "selected";
  }
}

function isHariIni($value){
  global $hari;
  if($hari == $value){
    return "-- Hari ini --";
  }
}

function isSemua(){
    if(isset($_GET['pilihanHari'])){
        if($_GET['pilihanHari'] == 'semua'){
            return true;
        }
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Jadwal Bel sekolah</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light only" />

    <link rel="canonical" href="index.html" />
    <link
        href="https://fonts.googleapis.com/css2?display=swap&amp;family=Raleway:ital,wght@0,600;0,900;1,600;1,900&amp;family=Source+Sans+Pro:ital,wght@0,300;0,400;1,300;1,400"
        rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="styling/jadwalStyling.css" />
    <link rel="stylesheet" href="styling/buttons.css" />

    <noscript>
        <style>
        body {
            overflow: auto !important;
        }

        body:after {
            display: none !important;
        }

        #main>.inner {
            opacity: 1 !important;
        }

        #main {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            filter: none !important;
        }

        #main>.inner>section {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            filter: none !important;
        }
        </style>
    </noscript>
</head>

<body class="is-loading">
    <div id="wrapper">
        <div id="main">
            <div class="inner">
                <div id="columns01" class="container default">
                    <div class="wrapper">
                        <div class="inner">
                            <h1 id="text04">Jadwal bel</h1>
                            <p id="text05">Bel akan dibunyikan pada jadwal berikut</p><br>
                            <a href="tambah_jadwal.php" data-role="button" class="buttons" data-inline="true">
                                <button type="button" class="buttons">Tambah Jadwal</button>
                            </a>

                            <a href="logout.php" class="buttons" data-role="button" data-inline="true">
                                <button type="button" class="buttons"
                                    onclick="return confirm('Apakah anda yakin untuk keluar')">Logout</button>
                            </a>
                        </div>
                    </div>
                </div>
                <form enctype="multipart/form-data" id="form01" method="post">
                    <div class="inner">
                        <div class="field">
                            <select name="Hari" id="form01-Hari" required
                                onchange="if (this.value) window.location.href=this.value">
                                <option value="?pilihanHari=semua" <?= isSelected(1)?>>Semua <?= isHariIni('semua')?>
                                </option>
                                <option value="?pilihanHari=1" <?= isSelected(1)?>>Senin <?= isHariIni(1)?></option>
                                <option value="?pilihanHari=2" <?= isSelected(2)?>>Selasa <?= isHariIni(2)?></option>
                                <option value="?pilihanHari=3" <?= isSelected(3)?>>Rabu <?= isHariIni(3)?></option>
                                <option value="?pilihanHari=4" <?= isSelected(4)?>>Kamis <?= isHariIni(4)?></option>
                                <option value="?pilihanHari=5" <?= isSelected(5)?>>Jumat <?= isHariIni(5)?></option>
                                <option value="?pilihanHari=6" <?= isSelected(6)?>>Sabtu <?= isHariIni(6)?></option>
                                <option value="?pilihanHari=7" <?= isSelected(7)?>>Minggu <?= isHariIni(7)?></option>
                            </select>
                        </div>
                    </div>
                </form>
                <div id="table01" class="table-wrapper">
                    <div class="table-inner">
                        <table>
                            <thead>
                                <tr>
                                    <th>Jam</th>
                                    <th>Nama</th>
                                    <th>Sound</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>

                                <!-- Menampilkan pada hari pilihan saja -->
                                <?php if( !isSemua() ) { ?>
                                <?php
                                // Isi table db
                                    $sql = mysqli_query($conn, "SELECT * FROM jadwal 
                                        WHERE hari=$pilihanHari ORDER BY jam asc");
                                    while($data = mysqli_fetch_array($sql))
                                    {
                                ?>
                                <tr>
                                    <td> <?php echo $data['jam'];?></td>
                                    <td><?php echo $data['nama'];?></td>
                                    <td><?php echo $data['sound'];?></td>
                                    <td>
                                        <a onclick="return confirm('Apakah anda yakin untuk menghapus jadwal ini')"
                                            href="hapus.php?id=<?php echo $data['id'] ?>">
                                            Hapus
                                        </a>
                                    </td>
                                </tr>
                                <?php   
                                    }
                                ?>
                                <?php }?>

                                <!-- menampilkan semua hari -->
                                <?php if( isSemua() ) { ?>
                                <?php for ($i=1; $i < 8; $i++) { ?>

                                <?php
                                // Isi table db
                                    $sql = mysqli_query($conn, "SELECT * FROM jadwal 
                                        WHERE hari=$i ORDER BY jam asc");
                                    while($data = mysqli_fetch_array($sql))
                                    {
                                ?>
                                <tr>
                                    <td><?= $arrayHari[$i-1] ?>, <?php echo $data['jam'];?></td>
                                    <td><?php echo $data['nama'];?></td>
                                    <td><?php echo $data['sound'];?></td>
                                    <td>
                                        <a href="hapus.php?id=<?php echo $data['id'] ?>">
                                            Hapus
                                        </a>
                                    </td>
                                </tr>
                                <?php   
                                    }
                                ?>

                                <?php } ?>
                                <?php }?>

                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="columns02" class="container default">
                    <div class="wrapper">
                        <div class="inner">
                            <p id="text02">© Project TA. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="styling/jadwalJS.js"></script>
</body>

</html>