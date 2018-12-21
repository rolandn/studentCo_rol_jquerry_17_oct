<?php
/**
 * Created by PhpStorm.
 * User: rolan
 * Date: 07-11-18
 * Time: 18:56
 */


require_once 'connect.php';

/**Pour les commentaires, voir page php relative**/

/**
 * dbReadLogin : Lire un login de la DB
 * @param string $username
 * @param string $password
 * @return null si Exceception ou pas trouvé | id si ok
 */

function dbReadLogin($username, $password){
    //query
    $sql="SELECT Id FROM login WHERE username='$username' AND password='$password'";
    try {
        $pdo=getPDO();
        $row=$pdo->query($sql)->fetch();
        //fermer la connexion
        $pdo=null;
        //return
        if(!$row) return null;
        $id = $row['Id'];
        return $id;
    }
    catch(Exception $error){
        return null;
    }
}

function dbListOfCoDisciples($id){


    $sql="SELECT login.Id, login.username FROM approval, login WHERE ((approval.owner_id = '$id' AND login.Id = approval.guest_id)
OR (approval.guest_id = '$id' AND login.Id = approval.owner_id)) AND approval.status=0";

    try{
        $pdo=getPDO();
        $rows=$pdo->query($sql)->fetchAll();
        $pdo=null;
        return $rows;
    }
    catch(PDOException $error){
        return null;
    }
}

function dbListOfCoTweets($id){

    $sql="select table1.* from (
select login.UserName, tweet.* from tweet inner join login
 on login.Id=tweet.id_writer) as table1
 where table1.id_receiver='$id'";

    try{
        $pdo=getPDO();
        $rows=$pdo->query($sql)->fetchAll();
        return $rows;
    }
    catch(PDOException $erreur){
        return null;
    }

}

function dbwriteTweet($idReceiver, $idWriter, $text){
    $retVal=false;

    $sql="INSERT INTO `tweet`(`id_writer`, `id_receiver`, `text`) VALUES ('$idWriter','$idReceiver','$text')";

    try{
        $pdo=getPDO();
        $pdo->query($sql);
        //fermer la connexion
        $pdo=null;
        $retVal=true;
    }
    catch (PDOException $erreur)
    {
        echo $erreur;
    }
    return $retVal;
}


function dbfetchTweetToDelete($id){
    $sql="select * from
	(select table1.*, (login.UserName) as Name_Receiver from 
	(select tweet.*, (login.UserName) as Name_Writer from tweet inner join login on tweet.id_writer=login.Id) as table1 inner join login on table1.id_receiver=login.Id) as table2
	where id_writer='$id' or id_receiver='$id'";

    try{
        $pdo=getPDO();
        $rows=$pdo->query($sql)->fetchAll();
        return $rows;
    }
    catch(PDOException $erreur){
        echo $erreur;
    }
}

function dbDeleteTweet($id){
    $retVal=false;
    $sql="DELETE FROM `tweet` WHERE id='$id'";

    try{
        $pdo=getPDO();
        $pdo->query($sql);
        //fermer la connexion
        $pdo=null;
        $retVal=true;
    }
    catch (PDOException $erreur)
    {
        echo $erreur;
    }
    return $retVal;
}


//function dbListOfCoDisciples(){
//
//    $sql="SELECT login.Id, login.username FROM login ";
//
//    try{
//        $pdo=getPDO();
//        $rows=$pdo->query($sql)->fetchAll();
//        $pdo=null;
//        return $rows;
//    }
//    catch(PDOException $error){
//        return null;
//    }
//}

