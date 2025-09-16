<?php
if (isset($_POST['init']))
{
	// grab initials from POST
	$alarmId = $_POST['id'];
	$msg = $_POST['msg'];
	$init = $_POST['init'];
	
	$alarmId = (int)$alarmId;
	
	date_default_timezone_set("America/Chicago");
	
	// grab timestamp , not sure if this is accurate
	$dateTime = date("n-d-Y g:ia",time(null));
	
	// fill $txt variable 
	$txt = "\n";
	if ($alarmId < 10) $txt .= " ";
	$txt .= $alarmId . " " . $msg . " by " . $init . " @ " . $dateTime;

	$f = fopen("alarmReport.txt", 'a') or die("Can\'t open file");
	fwrite($f, $txt);
	fclose($f);
}
else if (isset($_GET['rand']))
{
	$f = fopen("alarmReport.txt", 'r') or die("Can\'t open file");
	
	while (!feof($f)) 
	{ 
		$line = fgets($f, 256);  
	} 
	
	fclose($f);
	
	$response = $line[0] . $line[1];
	
	echo $response;
}
?>