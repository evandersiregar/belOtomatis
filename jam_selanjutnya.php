<?php
include 'koneksi.php';

$date = date('H:i');
$res = mysqli_query($conn, "SELECT jam, sound, nama FROM jadwal
    where hari=$hari
    and jam>='$date' ORDER BY jam
");

$n = 0;
while ($row = mysqli_fetch_assoc($res))
 {
    if($n == 1) break;
    
    // echo substr($row['jam'], 0, 5);
    echo $row['jam'].','.$row['sound'].','.$row['nama'];
    
    $n++;
 }
?>