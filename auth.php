<?php 
// mengaktifkan session php
session_start();
include 'koneksi.php';

$username = $_POST['username'];
$password = md5($_POST['password']);


$sql = mysqli_query($conn,"SELECT * FROM user WHERE username='$username' and password='$password'");

// menghitung jumlah data yang ditemukan
$check = mysqli_num_rows($sql);
if ($check > 0){

    // jika sesuai, maka buat session
        $_SESSION['username'] = $username;
        header("location:index.php");
}else{
	echo '<script>alert("Username atau Password salah, coba kembali");</script>';
	echo '<script>window.location="login.php";</script>';
}
?>