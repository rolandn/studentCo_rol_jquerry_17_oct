<?php 
/** 
*	studentCo.v097 - RESTful Test 
*	Tests de webservices de type RESTful (ServiceRestHandler) pour le projet 
*	StudentCo 
 */ 
//Les imports 
require_once("SimpleRestHandler.class.php");
require_once 'bl.php';
define ("TEXT_HTML", "text/html"); 
   
class StudentcoRestHandler extends SimpleRestHandler { 
  
 /** 
*	Réalise l'authentification d'un login 
*	@param String $username 
*	@param String $password 
*	@return JSON l'id du login ou 0 si pas trouvé 
  */ 
     public function restAuthenticate($username, $password) {
      $id = authenticate($username, $password);
      $statusCode = 200;
      $this ->setHttpHeaders(TEXT_HTML, $statusCode);
      $response = $this->encodeJson($id);
      echo $response;
     }

     public function restFetchCoDisciples($id) {
         $rows = fetchCoDisciples($id);
         $statusCode = 200;
         $this ->setHttpHeaders(TEXT_HTML, $statusCode);
         $response = $this->encodeJson($rows);
         echo $response;

     }
} 	 