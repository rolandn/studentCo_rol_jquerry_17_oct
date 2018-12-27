<?php

define("ROOTSITE", $_SERVER["DOCUMENT_ROOT"]."/studentCo_rol_jquerry_17_oct/" );

define("DAL", ROOTSITE.'dal/dal.php');
//Les imports
require_once DAL;
//  ANCIENNE VERSION
////login autorisé
//const USER = "Jean";
//const PASS = "anje";
//
//
//function authenticate($username,$password) {
//    if ($username == USER && $password == PASS) {
//        return true;
//    }
//    else {
//        return false;
//    }
//}

/**
 * Authenticate: Authentifie un login (username, password)
 * @param string $username
 * @param string $password
 * @return boolean true si authentifié, false sinon
 */
function authenticate($username, $password){

    $id = dbReadLogin($username, $password);

    if($id!=null){
        session_start();
        $_SESSION['uid']=$id;
        $retVal=true;
    }
    else{
        session_start();
        session_destroy();
        $retVal=false;
    }

    return $retVal;
}



// Dans cette fonction, ne pas mettre la fonction dans une autre
//function fetchCoDisciples($id){
//
//
//    $rows=json_encode(dbListOfCoDisciples($id));
//
//    if (!$rows) echo("Il n'y a aucun utilisateur enregistré dans la DB");
//    else
//        return $rows;
//}


function fetchCoDisciples($id){

    $rows = dbListOfCoDisciples($id);

    $ret=json_encode($rows);


    if (!$ret) echo("Il n'y a aucun utilisateur enregistré dans la DB");
    else
        return $ret;
}

function fetchTweet($id){
    $rows=json_encode(dbListOfCoTweets($id));
    return $rows;
}

function writeTweet($idReceiver, $idWriter, $text){

    $ret=dbwriteTweet($idReceiver, $idWriter, $text);
    return $ret;
}

function fetchTweetToDelete($id){
    $rows=json_encode(dbfetchTweetToDelete($id));
    if (!$rows)
        echo("Il n'y a aucun utilisateur enregistré dans la DB");
    else
        return $rows;
}

function deleteTweet($id){
    $ret=dbDeleteTweet($id);
    return $ret;
}

function deleteCoDisciple($id, $idToDelete){
    $ret=dbDeleteCoDisciple($id, $idToDelete);
    return $ret;
}

function addCoDisciples($id){
    $rows=json_encode(dbAddCoDisciples($id));
    if (!$rows)
        echo("Il n'y a plus de co'disciples à ajouter.");
    else
        return $rows;
}

function sendInvitation($idWriter, $id){
    $ret=dbsendInvitation($idWriter, $id);
    return $ret;
}

function invitationSent($id){
    $rows=json_encode(dbinvitationSent($id));
    if (!$rows)
        echo("Il n'y aucune invitation envoyée en cours.");
    else
        return $rows;
}

function invitationReceived($id){
    $rows=json_encode(dbinvitationReceived($id));
    if (!$rows)
        echo("Il n'y aucune invitation reçue en cours.");
    else
        return $rows;
}

function AcceptInvitation($idOwner, $id){
    $ret=dbAcceptInvitation($idOwner, $id);
    return $ret;
}

function RefuseInvitation($idOwner, $id){
    $ret=dbRefuseInvitation($idOwner, $id);
    return $ret;
}


// ANCIENNE VERSION
//function fetchCoDisciples(){
//
//    $rows=dbListOfCoDisciples();
//
//    if (!$rows) echo("Il n'y a aucun utilisateur enregistré dans la DB");
//    else
//        return $rows;
//}