<?php 

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); // always modified
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Pragma: no-cache"); // HTTP/1.0 

include 'connection.php';

$query = "SELECT * FROM `data`";
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
$rows = array();
while ($data = mysqli_fetch_assoc($result)) {
    $rows[] = $data;
}
// return db json
echo json_encode($rows);


?>

