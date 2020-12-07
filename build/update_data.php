<?php 

echo '<html lang="ru"><head><meta charset="utf-8"></head>';

include 'connection.php';

mysqli_query($link, "DELETE FROM `data` WHERE 1") or die("Ошибка " . mysqli_error($link));

/*
Забираем html купонов
*/

$query = "SELECT * FROM `html`";
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
$html_coupons = array();
while ($data = mysqli_fetch_assoc($result)) {
    $html_coupons[] = $data;
}

$test_list='';
$result = array();
$sql = 0;
$info = file_get_contents('https://iss.moex.com/iss/engines/stock/markets/bonds/boards/TQCB/securities.json?iss.meta=off&iss.only=securities,marketdata&securities.columns=SECID,SHORTNAME,MATDATE,LOTVALUE,PREVWAPRICE,LISTLEVEL,ACCRUEDINT&marketdata.columns=DURATION,YIELD');
$info = json_decode($info, true);

$counter_bonds = count($info['securities']['data']);

for ($row = 0; $row < $counter_bonds; $row++) {

  $secid = $info['securities']['data'][$row][0];
  $shortname = $info['securities']['data'][$row][1];
  $matdate = $info['securities']['data'][$row][2];
  $lotvalue = $info['securities']['data'][$row][3];
  $duration = $info['marketdata']['data'][$row][0];
  $listlevel = $info['securities']['data'][$row][5];
  $accruedint = $info['securities']['data'][$row][6];
  $prevwaprice = $info['securities']['data'][$row][4];
  $yield = $info['marketdata']['data'][$row][1];
  $purchase = ($prevwaprice * $lotvalue)/100;

 echo $row, " row<br>";   

  if ($shortname!='' && $matdate!='' && $lotvalue <= 10000 && $duration <= 1000 && $listlevel!='' &&  $accruedint != '' && $prevwaprice != '' && $duration != 0 && $prevwaprice > 95) {

    $sum_volume_trade_value = sum_volume_trade($secid);
    $coupons_sum_value = sum_coupons($html_coupons[$sql]['bond_html']);
    $yield_to_mat_value = yield_to_mat($matdate, $lotvalue, $purchase, $coupons_sum_value, $accruedint);
    $sql += 1;

    if ($coupons_sum_value > 0 && $sum_volume_trade_value > 0 && $yield > 0 && $yield_to_mat_value > 0) {

      $test_list .= ", ('$secid', '".mysqli_real_escape_string($link, $shortname)."', '$matdate', '$lotvalue', '$duration', '$listlevel', '$accruedint', '$prevwaprice', '$coupons_sum_value', '$sum_volume_trade_value', '$yield', '$yield_to_mat_value', '$purchase')";
    }
  }
}
$test_list = stristr($test_list, '(');
echo $test_list;
$query = "INSERT INTO `data` (`SECID`, `SHORTNAME`, `MATDATE`, `LOTVALUE`, `DURATION`, `LISTLEVEL`, `ACCRUEDINT`, `PREVWAPRICE`, `COUPONS_SUM`, `SUM_VOLUME_TRADE`, `YIELD`, `YIELD_TO_MAT`, `PURCHASE`) VALUES $test_list;";
    $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
    if($result) {
      echo " :) ";
    }
    // закрываем подключение
    mysqli_close($link);

function sum_coupons ($html_text) {
  $dom = new DomDocument;
  $dom->loadHTML($html_text);
  $data = $dom->getElementsByTagName('td');
  foreach ($data as $value) {
      $text[] = $value->textContent;
  }
  for ($i=2; $i < count($text); $i+=6) { 
    if ($text[$i] != '—') {
      $sum_coupon += $text[$i];
    } else {
      $sum_coupon = 0;
    }
  }  
return $sum_coupon;
}
 


function sum_volume_trade($id) {
	$prev_date = date('Y-m-d', strtotime($Date. ' - 30 days'));
	$json = file_get_contents('https://iss.moex.com/iss/history/engines/stock/markets/bonds/boards/TQCB/securities/'.$id.'.json?iss.meta=off&iss.only=history&history.columns=SECID,TRADEDATE,VOLUME,NUMTRADES&limit=30&from='.$prev_date);
	$json = json_decode($json, true);
	$sum_volume_trade = 0;
	for ($i = 0; $i < count($json['history']['data']); $i++) {
			$sum_volume_trade += $json['history']['data'][$i][2];
		}
    return $sum_volume_trade;
}

//echo sum_volume_trade('RU000A0JS5M2');

function yield_to_mat($matdate, $lotvalue, $purchase, $coupon_sum, $nkd) {
	$now_date = date('Y-m-d');
	$delta_days=(((strtotime($matdate)-strtotime($now_date))/24)/60)/60;
	$yield_to_mat = (($lotvalue - $purchase + ($coupon_sum - $nkd)) / $purchase) * (365 / $delta_days * 100);

	return $yield_to_mat;
}

//echo yield_to_mat('2022-10-27', 1000, 1055, 258, 5);


?>