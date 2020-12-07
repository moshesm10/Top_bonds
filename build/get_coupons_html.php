<?php 

include 'connection.php';

mysqli_query($link, "DELETE FROM `html` WHERE 1") or die("Ошибка " . mysqli_error($link));

$html_text = '';
$counter_after_traps = 0;
$info = file_get_contents('https://iss.moex.com/iss/engines/stock/markets/bonds/boards/TQCB/securities.json?iss.meta=off&iss.only=securities,marketdata&securities.columns=SECID,SHORTNAME,MATDATE,LOTVALUE,PREVWAPRICE,LISTLEVEL,ACCRUEDINT&marketdata.columns=DURATION,YIELD');
$info = json_decode($info, true);

$counter_bonds = count($info['securities']['data']);

for ($i=0; $i < $counter_bonds; $i++) { 
	 $secid = $info['securities']['data'][$i][0];
  $shortname = $info['securities']['data'][$i][1];
  $matdate = $info['securities']['data'][$i][2];
  $lotvalue = $info['securities']['data'][$i][3];
  $duration = $info['marketdata']['data'][$i][0];
  $listlevel = $info['securities']['data'][$i][5];
  $accruedint = $info['securities']['data'][$i][6];
  $prevwaprice = $info['securities']['data'][$i][4];

  echo $i, " row<br>"; 

  if ($shortname!='' && $matdate!='' && $lotvalue <= 10000 && $duration <= 1000 && $listlevel!='' &&  $accruedint != '' && $prevwaprice != '' && $duration != 0 && $prevwaprice > 95) {
    

		echo $i."  ";
		echo $secid."   ";
	    $counter_after_traps += 1;
	    echo $counter_after_traps, " after traps<br>";


	    $html_text .= ", ('".get_html_coupons($secid)."')";

//mysqli_real_escape_string($link, $shortname)

  }
}
$html_text = stristr($html_text, '(');
echo $html_text;
$query = "INSERT INTO `html` (`bond_html`) VALUES $html_text;";
    $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
    if($result) {
      echo " :) ";
    }
    // закрываем подключение
    mysqli_close($link);

//file_put_contents("html_coupons.php", json_encode($html_text, JSON_UNESCAPED_UNICODE));





function get_html_coupons ($id) {

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://smart-lab.ru/q/bonds/'.$id);
curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15');
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($curl, CURLOPT_HEADER, 1);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLINFO_HTTP_CODE, 1);
$result = curl_exec($curl);
//Отлавливаем ошибки подключения
  if ($result === false) {
  echo "Ошибка CURL: " . curl_error($curl);
  } else {
    echo '<h4>успешный запрос CURL </h4>';
  }
  $result = stristr($result, 'Календарь выплаты купонов');
  curl_close();
  return stristr($result, 'right_column bond', true);

}

?>