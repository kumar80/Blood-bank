<?php

$servername = "localhost";
$username = "root";
$password = "";
$database = "blood_bank_db";

$tableRequests = "requests";
$tableHosp = "user_hosp";
$tableRec = "user_rec";
$tableBloodInfo = "blood_info";
$con_db = "no";

$conn =   mysqli_connect(
    $servername,
    $username,
    $password,
    $database
);

mysqli_set_charset($conn, "utf8");
if ($conn) {
    $con_db = "ok";
} else {
    die("Error" . mysqli_connect_error());
}
