<?php
include 'koneksi.php';
$id = $_GET['id'];

// Hapus Data
mysqli_query($conn, "DELETE FROM jadwal WHERE id= '$id'");

echo "<script> location.replace ('index.php') </script>";

?>