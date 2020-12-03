<?php


$user = 'root';
$password = 'root';
$db = 'Bonds_data';
$host = 'localhost';

$link = mysqli_connect($host, $user, $password, $db) 
    or die("Ошибка " . mysqli_error($link));



?>