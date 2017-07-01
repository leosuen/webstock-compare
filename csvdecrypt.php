<?php
$stock1 = $_GET['s1'];
$stock2 = $_GET['s2'];

$stock1html = "http://chart.finance.yahoo.com/table.csv?s=" . $stock1 . ".TW&a=0&b=4&c=2010&d=11&e=30&f=2016&g=d&ignore=.csv";
$stock2html = "http://chart.finance.yahoo.com/table.csv?s=" . $stock2 . ".TW&a=0&b=4&c=2010&d=11&e=30&f=2016&g=d&ignore=.csv";
$result1 = array();
if (($handle = fopen($stock1html, "r")) !== FALSE) {
    $column_headers = fgetcsv($handle); // read the row.
    foreach($column_headers as $header) {
            $result1[$header] = array();
    }

    while (($data = fgetcsv($handle)) !== FALSE) {
        $i = 0;
        foreach($result1 as &$column) {

                $column[] = $data[$i++];
        }

    }
    fclose($handle);
}
$json1 = json_encode($result1);

$result2 = array();
if (($handle = fopen($stock2html, "r")) !== FALSE) {
    $column_headers = fgetcsv($handle);
    foreach($column_headers as $header) {
            $result2[$header] = array();
    }

    while (($data = fgetcsv($handle)) !== FALSE) {
        $i = 0;
        foreach($result2 as &$column) {

                $column[] = $data[$i++];
        }

    }
    fclose($handle);
}
$json2 = json_encode($result2);

$jsonarr = array("obj1" => $json1 , "obj2" => $json2);
echo json_encode($jsonarr);
?>