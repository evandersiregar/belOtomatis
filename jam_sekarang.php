<?php
date_default_timezone_set("Asia/Jakarta");
include 'koneksi.php';
$date = date("H:i");

$arrayHarii = ["Sen.", "Sel.", "Rab.", "Kam.", "Jum.", "Sab.", "Min."];

echo $arrayHarii[$hari-1];
if (isset($_GET['parameter'])){
    echo date("H:i:s");
} echo date("H:i").',';


$sql = mysqli_query($conn,"SELECT nama FROM jadwal where hari=$hari
    and jam<='$date' ORDER BY jam DESC LIMIT 1");

while ($row = mysqli_fetch_assoc($sql))
 {
    echo $row['nama'];
 }