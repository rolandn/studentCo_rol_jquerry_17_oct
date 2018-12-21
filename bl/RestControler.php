<?php 
/** 
*	Controller - RESTful Test 
*	Point d’entrée pour les webservices du projet StudentCo 
*	@param method la méthode appelée dans bl.php 
*	@param les autres paramètres nécessaires suivant l’appel 
 */ 
require_once('StudentcoRestHandler.class.php'); 
   
$method = ""; 
if(isset($_GET["method"])) $method = $_GET["method"];  
	switch($method){
	case "authenticate":
//controls the RESTful services - URL mapping switch($method){  case "authenticate": 
  // to handle REST Url login/<username>/<password>/ 
  $studentcoRestHandler = new StudentcoRestHandler(); 
  $username = $_GET["username"]; 
  $password = $_GET["password"]; 
  $studentcoRestHandler->restAuthenticate($username , $password);
  break;

     case "fetchCoDisciples":
//controls the RESTful services - URL mapping switch($method){  case "fetchCoDisciples":
// to handle REST Url fetchco/<id>/
  $studentcoRestHandler = new StudentcoRestHandler();
  $id = $_GET["Id"];
  $studentcoRestHandler->restFetchCoDisciples($id);
            break;
  
  case "" : 
  //404 - not found; 
  break;
}
