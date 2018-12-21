<?php
header('Access-Control-Allow-Origin: *'); //allow everybody
require_once 'bl.php';

/**
 * l'utilisateur reçoit la liste de ses co'disciples
 * @param string id: id du codisciple
 * @return JSon la liste des co'disciples, rien sinon
 */

session_start();
if(!isset($_SESSION['uid'])) return;
$id=$_SESSION['uid'];
$ret = fetchCoDisciples($id);//dans bl.php

echo $ret;



// Ancienne version
//$rows = fetchCoDisciples();
//
//echo ("Liste des utilisateurs");
//echo ('<hr/>');
//if (!$rows) echo ("Il n'y a pas d'utilisateur dans la DB");
//else foreach ($rows as $row) echo ($row[0].'<br/>');

