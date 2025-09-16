<?php

// check if $_GET method was used
if (isset($_GET['cmd']))
{
	$cmd = $_GET['cmd']; // 0 = get
}
else if (isset($_POST['cmd']))
{
	// grab post variables
	$cmd = $_POST['cmd']; // 1 = add; 2 = edit; 3 = delete
	$id = $_POST['id'];
	$time = $_POST['time'];
	$days = $_POST['days'];
	$msg = $_POST['msg'];

}

$cmd = (int)$cmd;

//error checking
if (($id && $time && $days && $msg) || $cmd == 0)
{
	// set up $txt variable with xml headers
	$txt = "<?xml version='1.0' encoding='ISO-8859-1'?><STORAGE>";

	// load the updates.xml document
	$doc = new DOMDocument();
	$doc->load( 'alarms.xml' );
	$alarms = $doc->getElementsByTagName( "alarm" );

	switch ($cmd)
	{
	case 0: // get ////////////////////////////////////////////////////////////////

	foreach( $alarms as $alarm )
	{
		$alarmId = $alarm->getElementsByTagName("alarmId")->item(0)->nodeValue;
		$alarmTime = $alarm->getElementsByTagName("time")->item(0)->nodeValue;
		$alarmDays = $alarm->getElementsByTagName("days")->item(0)->nodeValue;
		$message = $alarm->getElementsByTagName("message")->item(0)->nodeValue;
		
		$txt .= "<alarm>";
		$txt .= "<alarmId>" . $alarmId . "</alarmId>";
		$txt .= "<time>" . $alarmTime . "</time>";
		$txt .= "<days>" . $alarmDays . "</days>";
		$txt .= "<message><![CDATA[" . $message . "]]></message>";
		$txt .= "</alarm>";
	} // foreach

	break;
	case 1: // add ////////////////////////////////////////////////////////////////
	
	$currentIdNum = 1;
	
	foreach( $alarms as $alarm )
	{
		$alarmId = $alarm->getElementsByTagName("alarmId")->item(0)->nodeValue;
		$alarmTime = $alarm->getElementsByTagName("time")->item(0)->nodeValue;
		$alarmDays = $alarm->getElementsByTagName("days")->item(0)->nodeValue;
		$message = $alarm->getElementsByTagName("message")->item(0)->nodeValue;
		
		$txt .= "<alarm>";
		$txt .= "<alarmId>" . $alarmId . "</alarmId>";
		$txt .= "<time>" . $alarmTime . "</time>";
		$txt .= "<days>" . $alarmDays . "</days>";
		$txt .= "<message><![CDATA[" . $message . "]]></message>";
		$txt .= "</alarm>";
		
		$currentIdNum = (int)$alarmId;
	} // foreach
	
	$currentIdNum++;

	$txt .= "<alarm>";
	$txt .= "<alarmId>" . $currentIdNum . "</alarmId>";
	$txt .= "<time>" . $time . "</time>";
	$txt .= "<days>" . $days . "</days>";
	$txt .= "<message><![CDATA[" . $msg . "]]></message>";
	$txt .= "</alarm>";

	break;
	case 2: // edit ///////////////////////////////////////////////////////////////

	foreach( $alarms as $alarm )
	{
		$alarmId = $alarm->getElementsByTagName("alarmId")->item(0)->nodeValue;
		$alarmTime = $alarm->getElementsByTagName("time")->item(0)->nodeValue;
		$alarmDays = $alarm->getElementsByTagName("days")->item(0)->nodeValue;
		$message = $alarm->getElementsByTagName("message")->item(0)->nodeValue;
		
		if ($alarmId == $id) 
		{
			$txt .= "<alarm>";
			$txt .= "<alarmId>" . $id . "</alarmId>";
			$txt .= "<time>" . $time . "</time>";
			$txt .= "<days>" . $days . "</days>";
			$txt .= "<message><![CDATA[" . $msg . "]]></message>";
			$txt .= "</alarm>";
		}
		else
		{
			$txt .= "<alarm>";
			$txt .= "<alarmId>" . $alarmId . "</alarmId>";
			$txt .= "<time>" . $alarmTime . "</time>";
			$txt .= "<days>" . $alarmDays . "</days>";
			$txt .= "<message><![CDATA[" . $message . "]]></message>";
			$txt .= "</alarm>";
		} // else
	} // foreach

	break;
	case 3: // delete /////////////////////////////////////////////////////////////

	$currentId = "";
	foreach( $alarms as $alarm )
	{
		$alarmId = $alarm->getElementsByTagName("alarmId")->item(0)->nodeValue;
		$alarmTime = $alarm->getElementsByTagName("time")->item(0)->nodeValue;
		$alarmDays = $alarm->getElementsByTagName("days")->item(0)->nodeValue;
		$message = $alarm->getElementsByTagName("message")->item(0)->nodeValue;
		
		if (($alarmTime == $time) && ($alarmDays == $days) && ($message == $msg)) 
		{
			$currentId = $alarmId;
		}
		else
		{
			if ($currentId != "")
			{
				$temp = $currentId;
				$currentId = $alarmId;
				$alarmId = $temp;
			} // if
			
			$txt .= "<alarm>";
			$txt .= "<alarmId>" . $alarmId . "</alarmId>";
			$txt .= "<time>" . $alarmTime . "</time>";
			$txt .= "<days>" . $alarmDays . "</days>";
			$txt .= "<message><![CDATA[" . $message . "]]></message>";
			$txt .= "</alarm>";
		} // if
	} // for

	break;
	} // switch ////////////////////////////////////////////

	$txt .= "</STORAGE>";

	$f = fopen("alarms.xml", 'w') or die("Can\'t open file");
	fwrite($f, $txt);
	fclose($f);
	
	echo stripslashes($txt);
}
?>