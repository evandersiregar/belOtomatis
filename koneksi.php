<?php
$conn = mysqli_connect("localhost", "belotoma_root", "sgx16.dewaweb.com", "belotoma_bell2");
date_default_timezone_set("Asia/Jakarta");

$hari = date('N');

$arrayHari = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
];

?>