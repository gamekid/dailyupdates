<?php
$link = mysqli_connect('p3plzcpnl505624.prod.phx3.secureserver.net', 'dailyupdates2', 'tw#ntyHTC20');
mysqli_select_db($link, 'dailyupdates2');

// check if $_GET method was used
if ($_GET['cmd'])
{
	$cmd = 0; // 0 = get
}
else
{
	// grab post variables
	$cmd = $_POST['cmd']; // 1 = add; 2 = edit; 3 = delete
	$cmd = (int)$cmd;
	$id = $_POST['id'];
	$dt = $_POST['dt'];
	$tt = mysqli_real_escape_string($link, $_POST['tt']);
	$ct = mysqli_real_escape_string($link, $_POST['ct']);
	$fl = $_POST['fl'];
	$it = mysqli_real_escape_string($link, $_POST['it']);
}

//error checking
if (($id && $dt && $tt && $ct && $it) || $cmd == 0)
{
	// set up $txt variable with xml headers
	$txt = "<?xml version='1.0' encoding='ISO-8859-1'?><STORAGE>";

	switch ($cmd)
	{
	case 0: // get ////////////////////////////////////////////////////////////////

	$sql = "SELECT * FROM updates ORDER BY id ASC";
	$result = mysqli_query($link, $sql);
	while($record = mysqli_fetch_array($result))
	{
		$txt .= "<recUpdate>";
		$txt .= "<updateId>" . $record['id'] . "</updateId>";
		$txt .= "<dateTime>" . $record['dt'] . "</dateTime>";
		$txt .= "<title><![CDATA[" . $record['title'] . "]]></title>";
		$txt .= "<content><![CDATA[" . $record['content'] . "]]></content>";
		$txt .= "<file>" . $record['file'] . "</file>";
		$txt .= "<initials><![CDATA[" . $record['initials'] . "]]></initials>";
		$txt .= "</recUpdate>";
	} // foreach

	break;
	case 1: // add ////////////////////////////////////////////////////////////////

	$sql = "INSERT INTO updates (title, content, initials, file) VALUES ('$tt','$ct','$it','$fl')";
	mysqli_query($link, $sql);

	break;
	case 2: // edit ///////////////////////////////////////////////////////////////

	$sql = "UPDATE updates SET title='$tt', content='$ct', file='$fl' WHERE id='$id'";
	mysqli_query($link, $sql);
	
	break;
	case 3: // delete /////////////////////////////////////////////////////////////

	$sql = "DELETE FROM updates WHERE id='$id'";
	mysqli_query($link, $sql);

	break;
	case 4: // edit with move /////////////////////////////////////////////////////
	
	$sql = "DELETE FROM updates WHERE id='$id'";
	mysqli_query($link, $sql);
	
	$sql = "INSERT INTO updates (title, content, initials, file) VALUES ('$tt','$ct','$it','$fl')";
	mysqli_query($link, $sql);
		
	break;
	} // switch ////////////////////////////////////////////
	
	$txt .= "</STORAGE>";
	
	echo $txt;
}
?>