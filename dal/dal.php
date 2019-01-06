<?php
/**
 * Created by PhpStorm.
 * User: rolan
 * Date: 07-11-18
 * Time: 18:56
 */


require_once 'connect.php';



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

/**
 * dbListOfCoDisciples : Lire la liste des coDicilples
 * @param int $id de l'utilisateur dont on veut lister les codiscilples
 * @param
 * @return
 */
function dbListOfCoDisciples($id){


    $sql="SELECT login.Id, login.username FROM approval, login WHERE ((approval.owner_id = '$id' AND login.Id = approval.guest_id)
OR (approval.guest_id = '$id' AND login.Id = approval.owner_id)) AND approval.status=1";

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

/**
 * dbListOfCoTweets : Lire les tweets des codisciples
 * @param int $id de l'utilisateur dont on veut lister les tweets codiscilples
 * @param
 * @return
 */
function dbListOfCoTweets($id){

    $sql="select table1.* from (
select login.username, tweet.* from tweet inner join login
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

/**
 * dbwriteTweet : Ecrire un tweet sur le mur d'un codiscilple
 * @param int $idReceiver de l'utilisateur qui va recevoir le tweet sur son mur
 * @param int $idWriter : id de l'écrivain du tweet
 * @param string $text : texte du tweet
 * @return
 */
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

/**
 * dbfetchTweetToDelete : Lister les tweets qu'on peut supprimer
 * @param int $id de l'utilisateur connecté
 * @param
 * @return
 */
function dbfetchTweetToDelete($id){
    $sql="select * from
	(select table1.*, (login.UserName) as Name_Receiver from 
	(select tweet.*, (login.UserName) as Name_Writer from tweet inner join login on tweet.id_writer=login.Id) as table1 inner join login on table1.id_receiver=login.Id) 
	as table2
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

/**
 * dbDeleteTweet : Suppression d'un tweet
 * @param int $id du tweet
 * @param
 * @return
 */
function dbDeleteTweet($id){
    $retVal=false;
    $sql="DELETE FROM `tweet` WHERE idTweet='$id'";

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

/**
 * dbDeleteCoDisciple : Supprimer un codisciple
 * @param int $id de l'utilisateur connecté
 * @param  int $id de l'utilisateur dont on ne veut plus être ami
 * @return
 */
function dbDeleteCoDisciple($id, $idToDelete){
    $retVal=false;
    $sql="UPDATE `approval` SET status=NULL WHERE (owner_id='$id' and guest_id='$idToDelete') or (owner_id='$idToDelete' and guest_id='$id')";

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

/**
 * dbAddCoDisciples : Ajouter un codisciple
 * @param int $id de l'utilisateur qu'on veut ajouter
 * @param
 * @return
 */
function dbAddCoDisciples($id)
{
    $sql="select login.Id, login.username from login where login.Id NOT IN (

			select table1.id from(
			
			SELECT login.id, login.username, new_table1.status FROM login
				INNER JOIN 
					(select * FROM approval WHERE approval.owner_id='$id') as new_table1
						on login.Id=new_table1.guest_id
			where status=0 or status=1 or status=2 or status=3
			UNION
			SELECT login.id, login.username, new_table2.status FROM login
				INNER JOIN 
					(select * FROM approval WHERE approval.guest_id='$id') as new_table2
						on login.Id=new_table2.owner_id where status=0 or status=1 or status=2 or status=3
			    )
			as table1) and login.Id!='$id'";
    try{
        $pdo=getPDO();
        $rows=$pdo->query($sql)->fetchAll();
        return $rows;
    }
    catch(PDOException $erreur){
        echo $erreur;
    }

}

/**
 * dbsendInvitation : Envoyer une invitation
 * @param int $id de l'utilisateur qu'on veut ajouter
 * @param int $idWriter id de l'utilisateur qui lance l'invitation
 * @return
 */
function dbsendInvitation($idWriter, $id){
    $retVal=false;
    $sql="INSERT INTO `approval`(`owner_id`, `guest_id`, `status`) VALUES ('$idWriter','$id',0)";

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

/**
 * dbinvitationSent : Lister les invitations lancées
 * @param int $id de l'utilisateur courant dont on cherche les invitations lancées
 * @param
 * @return
 */
function dbinvitationSent($id){
    $sql="select login.Id, login.username from 
	(select * from approval where owner_id='$id' and status=0) as table1 inner join login 
	on table1.guest_id=login.Id";
    try{
        $pdo=getPDO();
        $rows=$pdo->query($sql)->fetchAll();
        return $rows;
    }
    catch(PDOException $erreur){
        echo $erreur;
    }

}

/**
 * dbinvitationReceived : Lister les invitations reçues
 * @param int $id de l'utilisateur courant dont on cherche les invitations reçues
 * @param
 * @return
 */
function dbinvitationReceived($id){
    $sql="select login.Id, login.username from
	(select * from approval where guest_id='$id' and status=0) as table1 inner join login
	on table1.owner_id=login.Id";
    try{
        $pdo=getPDO();
        $rows=$pdo->query($sql)->fetchAll();
        return $rows;
    }
    catch(PDOException $erreur){
        echo $erreur;
    }

}

/**
 * dbAcceptInvitation : Accepter une invitation
 * @param int $id de l'invitation
 * @param int $idOwner id de l'utilisateur qui a lancé l'invitation
 * @return
 */
function dbAcceptInvitation($idOwner, $id){
    $retVal=false;
    $sql="UPDATE `approval` SET `status`=1 WHERE owner_id='$idOwner' and guest_id='$id'";

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

/**
 * dbRefuseInvitation : Refuser une invitation
 * @param int $id de l'invitation
 * @param int $idOwner id de l'utilisateur qui a lancé l'invitation
 * @return
 */
function dbRefuseInvitation($idOwner, $id){
    $retVal=false;
    $sql="UPDATE `approval` SET `status`=2 WHERE owner_id='$idOwner' and guest_id='$id'";

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

