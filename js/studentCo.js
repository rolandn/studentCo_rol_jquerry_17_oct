/**
 * studentCo.v2
 */
//s
//login autorisé

const txtConnect="Se connecter";
const txtDisconnect="Se deconnecter";
const txtLegendConnect="Connecté";
const txtLegendDisconnect="Deconnecté";

//var global
var g_username;
var g_password;
var g_isConnected;



/**
 * Réinitialise les variables globales
 * Appelé à la fin du chargement de la page et quand nécessaire
 *  --> logUsername = "" --> logUsername est maintenant vide
 */
function initApp() {
    window.console.log("initApp() -start");
    g_isConnected=false;
    g_username="";
    g_password="";
    $('#logUsername').val("");
    $('#logPassword').val("");
    $("#boutonLogin").val(txtConnect);
    $("#connectBox").html(txtLegendDisconnect);

    pubs();
    //

    window.console.log("initApp() -end");

}

/**
 //  * Appelé quand click le bouton de la boîte de connexion
 //  * si g_isConnected = true : on est déjà connecté et l'utilisateur doit être déconnecté
 //  * si g_isConnected = false : authenticate(username, password) décide si connection ou non
 //  */
function doConnect() {
    window.console.log("il rentre dans DoConnect");
    var username= $('#logUsername').val();
    var password= $('#logPassword').val();
    var b = authenticate(username,password)

		if (b) {
				g_isConnected = true;
            window.console.log("il me retourne g_isConnected = true");
		}

		else {
			initApp();
			g_isConnected == false;
            window.console.log("Il me retourne g_isConnected = false");
		}

    window.console.log("Sortie de DoConnect avec g_isConnected = " + g_isConnected);
}



/**
 * authentifie un login = (username, password) par une requête Ajax vers le serveur
 * @param username : nom d'utilisateur
 * @param password : mot de passe
 * @returns authenticateCallback (response)
 */


function authenticate(username, password){
    window.console.log("Je rentre dans le nouvel authenticate avec username et password = " + " - " + username + "  - " + password);
    $.ajax({
        type:'GET',
        url:'bl/authenticate.php',
       // async: false,
        data: "username="+username+"&password="+password,
        dataType:'text',
        success: authenticateCallback
    });
    window.console.log("Je sors du nouvel authenticate");
}

function authenticateCallback(ret){
    window.console.log("Je renrte dans authenticateCallBAck ca j'ai  eu une sucess dans authenticate avec la valeur de ret = "+ret);
    if(ret=='1'){
        g_isConnected=true;
        connect();
        fetchCoDisciples();
    }
    else
    {
        initApp();
    }
    window.console.log("Sortie d'authenticateCallback et la valeur de ret est = " +ret);
}

function connect() {
    /** g_isConnected=true;   Dernière modif ici **/
    window.console.log("Entrée fct° connect()");
    var username = $('#logUsername').val();
    var password = $('#logPassword').val();


    if (g_isConnected == true) {
        window.console.log("La fct° authenticate dans connect est TRUE");
        /** le résultat d'authenticate nous renvoie via authenticatecallback "g_isConnected" qui peut être True/False  **/

        $('#connectBox').html(txtLegendConnect);
        $('#boutonLogin').val(txtDisconnect);
        $('#logUsername').val("");
        $('#logPassword').val("");
    }
    else {
        window.console.log("La fct° authenticate dans connect est FALSE");
        initApp();
    }
    pubs();
}

/**
 * Fait apparaître les publicités
 * @param g_isConnected = boolean
 * @param
 * @returns pubsCallback (response)
 */

function pubs() {
    window.console.log("Je rentre dans la fct° pubs() ");
    //
    if(g_isConnected==false)
    {
        $.ajax({
            type:'GET',
            url:'bl/pubs.php',
            success: pubsCallback
        })
    }
    else
    {
        $('#wall').html("");
    }
    window.console.log("Je sors dans la fct° pubs() ");
}

function pubsCallback(ret){
    window.console.log("Je rentre dans la fct° pubsCallback() ");
    $('#wall').html(ret);
    $('#page').html("");
    window.console.log("Je sors dans la fct° pubsCallback() ");
}

/**
 * Fait apparaître les CoDisciples
 * @param
 * @param
 * @returns fetchCoDisciplesCallback (response)
 */

    function fetchCoDisciples() {
        window.console.log("Je rentre dans fetchCoDisciple");
        $.ajax({
            type: 'GET',
            url: 'bl/fetchCoDisciples.php',
            //   async: false,
            success: fetchCoDisciplesCallback
        });
        window.console.log("Je sors de fetchCoDisciple");
    }

function fetchCoDisciplesCallback(ret){
    window.console.log("J'ai eu un success dans fectchCoDisciple -> je rentre dans fetchCoDiCallBack");

    try
    {
        var affiche = "<p class='h3'><span style='color: #3b5998'>Liste de mes Co'Disciples</span></p><hr>";
        var jarray=$.parseJSON(ret);
        for(var i = 0; i<jarray.length; i++ ){
            var row=jarray[i];
            var id = row['Id'];
            var username = row['username'];
            var ligne="<p style='color: #3b5998'><span class='h5' id='co"+id + "' onclick='wallCoDisciple(this.id.substring(2),this.innerHTML);'" +
                " onmousemove='overElement(this);' onmouseout='outElement(this);'>";
            ligne = ligne + username + "</p></span><br/>";
            affiche = affiche + ligne;
        }
        $('#page').html(affiche);

    }
    catch(err){
        window.console.log("J'ai une erreur dans le PHP dans fetchCoDiscipleCallBacks = " + err);
    }
    window.console.log("Je sors fetchCoDisciplesCallback avec succès avec AFFICHE = " + affiche);
}

function overElement(e) {
    e.style.cursor="pointer";
}
function outElement(e) {
    e.style.cursor="default";
}

function wallCoDisciple(id, alias) {

    window.console.log("Je rentre dans wallCoDisciple avec id = "+id);
    //   alert("Tu as cliqué sur "+alias + "  qui a l'Id "+id);
    fetchTweet(id);
    window.console.log("Je sors de wallCoDisciple");

}

/**
 * Pour écrire un tweet
 * @param idReceiver : id de l'utilisateur qui reçoit un tweet sur son mur
 * @param
 * @returns writeTweetCallBack (response)
 */

function writeTweet(idReceiver){
    window.console.log("On rentre dans la méthode writeTweet");
    var text=$('#textBoxNewTweet').val();
    var id=$('#textBoxId').val();
    $.ajax({
        type:'GET',
        url:'bl/writeTweet.php',
        data: "id="+idReceiver+"&text="+text,
        dataType:'text',
        success: writeTweetCallBack
    });
    window.console.log("On SORT dans la méthode writeTweet");
}

function writeTweetCallBack(ret){
    window.console.log("On rentre dans la méthode writeTweetCallBack avec ret = "+ret);
    if(ret!="")
    {
        fetchTweet(ret);
    }
    window.console.log("On SORT dans la méthode writeTweetCallBack");
}

function fetchTweet(id){
    window.console.log("On rentre dans la méthode fetchTweet avec id = "+id);
    $.ajax({
        type:'GET',
        url:'bl/fetchTweet.php',
        async: false,
        data: "id="+id,
        dataType:'text',
        success: fetchTweetCallBack
    });
    window.console.log("On SORT dans la méthode fetchTweet");
}

function fetchTweetCallBack(ret){
    window.console.log("On rentre dans la méthode fetchTweetCallBack avec ret = "+ret);
    try
    {
        if(ret.length<=2){
            var affiche = "Ecrire un tweet:<br> " +
                "<p style='align-content: baseline'><input type=\"text\" id=\"textBoxNewTweet\" style=\"width:100px;color: #3b5998; \"></p>"
                +"<input class=\"btn btn-warning\" id=\"boutonTweet\" type=\"button\" value=\"Tweeter\" onclick=\"writeTweet("+ret+");\" style=\"margin-bottom:10px; background-color:rgb(228,229,231); border:0px; font-size:12px\"><br><br>Liste des tweets<hr><br>";
            $('#wall').html(affiche + "Il n'y a aucun tweet sur ce mur.");
        }
        else{
            var jarray=$.parseJSON(ret);
            var idReceiver=jarray[0]['id_receiver'];
            var affiche = "Liste des tweets<hr><p class='h3'>Ecrire un Tweet:</p><br> <p style='text-wrap: normal;100px;color: #3b5998;'><input type=\"text\" id=\"textBoxNewTweet\" style=\"width:350px;100px;color: #3b5998; \"><br></p>"
                +"<input class=\"btn btn-warning\" id=\"boutonTweet\" type=\"button\" value=\"Poster le Tweete\" onclick=\"writeTweet("+idReceiver+");\" style=\"margin-bottom:10px; background-color:rgb(228,229,231); border:0px; font-size:12px\"><br><br><p class='h3'>Liste des tweets</p><hr>";
            for(var i = 0; i<jarray.length; i++ ){
                var ligne="";
                var row=jarray[i];
                var WriterName = row['UserName'];
                var textTweet = row['text'];
                ligne = "Posté par " + WriterName + ": " + textTweet + "</span><br/>";
                affiche = affiche + ligne;
            }
            $('#wall').html(affiche);
        }

    }
    catch(err){
        window.console.log("Erreur dans fetchcodiscipleCallBack. Erreur = " + err);
    }
    window.console.log("On SORT de fetchTweetCallBack");
}

function fetchTweetToDelete(){
    window.console.log("On rentre dans la méthode fetchTweetToDelete");
    if(g_isConnected==true)
    {
        $.ajax({
            type:'GET',
            url:'bl/fetchTweetToDelete.php',
            success: fetchTweetToDeleteCallBack
        });
    }
    window.console.log("On SORT de fetchTweetToDelete");
}

function fetchTweetToDeleteCallBack(ret)
{
    window.console.log("On rentre dans la méthode fetchTweetToDeleteCallBack avec ret = "+ret);
    try
    {
        var jarray=$.parseJSON(ret);
        var affiche = "Mes Tweets<hr>"
            +"<input class=\"btn btn-warning\" id=\"boutonDelete\" type=\"button\" value=\"Supprimer le Tweet\" style=\"margin-bottom:10px; background-color:rgb(128,229,231); border:0px; font-size:12px\"><br>";
        for(var i = 0; i<jarray.length; i++ ){
            var ligne="";
            var row=jarray[i];
            var WriterName = row['Name_Writer'];
            var ReceiverName = row['Name_Receiver'];
            var idTweet=row['id'];
            var textTweet = row['text'];
        //original
            ligne = "<span id=\"idTweet+\" onclick='updateDelButton(id);' onmouseover='overElement(this);' onmouseout='outElement(this);' style=\"border-width:1px; border-style:solid; border-color:black;\">Posté par " + WriterName + " à " + ReceiverName + ": " + textTweet + " id = "+ idTweet+"</span><br/>";
            affiche = affiche + ligne;

        // essai
        //    ligne = "<span id=\"idTweet\"  onclick='updateDelButton(this.idTweet);'  onmouse='overElement(this);' onmouseout='outElement(this);' style=border-width:1px; border-style:solid; border-color:black;>"
        //        + "Posté par " + WriterName + " à " + ReceiverName + ": " + textTweet + " id = "+ idTweet+"" +
        //        "</span><br/>";
            affiche = affiche + ligne;
        }
        $('#page').html(affiche);

    }
    catch(err){
        window.console.log("Erreur dans fetchTweetToDeleteCallBack. Erreur = " + err);
    }
    window.console.log("On SORT de fetchTweetToDeleteCallBack");
}

function updateDelButton(id){
    window.console.log("On rentre dans la méthode updateDelButton avec idTweet = "+ id);
    $("#boutonDelete").attr(onclick,deleteTweet(id));
    window.console.log("On SORT de updateDelButton");
}

function deleteTweet(id){
    window.console.log("On rentre dans la méthode deleteTweet avec idTweet = "+ id);
    $.ajax({
        type:'GET',
        url:'bl/deleteTweet.php',
        data: "idTweet="+id,
        dataType:'text',
        success: deleteTweetCallBack
    });

    window.console.log("On SORT de deleteTweet");
}

function deleteTweetCallBack(ret)
{
    window.console.log("On rentre dans deleteTweetCallBack avec ret = "+ret);
    if(ret=="1"){
        alert("Le tweet a été correctement supprimé avec ret = " +ret)
    }
    else{
        alert(ret);
    }
    fetchTweetToDelete();
    window.console.log("On SORT de deleteTweetCallBack");
}

function fetchCoDisciplesToDelete(){
    window.console.log("Je rentre dans fetchCoDisciplesToDelete()");
    $.ajax({
        type:'GET',
        url:'bl/fetchCoDisciples.php',
        async: false,
        success: fetchCoDisciplesToDeleteCallBack
    });
    window.console.log("Je SORS de fetchCoDisciplesToDelete()");
}


function fetchCoDisciplesToDeleteCallBack(ret){
    window.console.log("Je rentre dans fetchCoDisciplesToDeleteCallBack() avec ret = " +ret);
    try
    {
        var affiche = "Liste des co'disciples<hr>"+
            "<!-- <input class=\"btn btn-warning\" id=\"boutonDeleteCoDisciple\" value=\"Cliquez pour supprimer\" style=\"margin-bottom:10px; margin-right:10px; background-color:rgb(228,229,231); border:0px; font-size:12px\"> --> <br/>";
        var jarray=$.parseJSON(ret);
        for(var i = 0; i<jarray.length; i++ ){
            var row=jarray[i];
            var id = row['Id'];
            var username = row['username'];
            var ligne="<span id='co"+id +"'; onclick='deleteCoDiscipleButton(this.id.substring(2),this.innerHTML);' onmousemove='overElement(this);' onmouseout='outElement(this);'>";
            ligne = ligne + username + "</span><br/>";
            affiche = affiche + ligne;
        }
        $('#page').html(affiche);

    }
    catch(err){
        window.console.log("ERREUR dans fetchCoDisciplesToDeleteCallBack = " + err);
    }
    window.console.log("Je SORS defetchCoDisciplesToDeleteCallBack avec Id = " +id);
}


function deleteCoDiscipleButton(id){
    window.console.log("Je rentre dans deleteCoDiscipleButton avec id = "+id);
    $("#boutonDeleteCoDisciple").attr(onclick,deleteCoDisciples(id));
    window.console.log("Je SORS deleteCoDiscipleButton avec id = "+id);
}

function deleteCoDisciples(id){
    window.console.log("Je rentre dans deleteCoDisciples avec id = "+id);
    $.ajax({
        type:'GET',
        url:'bl/deleteCoDisciples.php',
        data: "id="+id,
        dataType:'text',
        success: deleteCoDisciplesCallBack
    });

    window.console.log("Je SORS de deleteCoDisciples");

}

function deleteCoDisciplesCallBack(ret){
    window.console.log("Je rentre dans deleteCoDisciples avec ret = "+ret);
    if(ret==1)
    {
        alert("Le codisciple a bien été supprimé.");
    }
    else{
        alert(ret);
    }
    fetchCoDisciplesToDelete();
    window.console.log("je SORS de deleteCoDisciples");
}

function addCoDisciple(){
    window.console.log("addCoDisciple() -start");
    $.ajax({
        type:'GET',
        url:'bl/addCoDisciple.php',
        success: addCoDiscipleCallBack
    });
    window.console.log("addCoDisciple() -end");
}

function addCoDiscipleCallBack(ret){
    window.console.log("addCoDiscipleCallBack() -start");
    try
    {
        var jarray=$.parseJSON(ret);
        var affiche = "Liste des co'disciples que vous pouvez inviter<hr>"
            +"<input class=\"btn btn-warning\" id=\"boutonInvitation\" type=\"button\" value=\"Inviter\" style=\"margin-bottom:10px; background-color:rgb(228,229,231); border:0px; font-size:12px\"><br>";
        for(var i = 0; i<jarray.length; i++ ){
            var ligne="";
            var row=jarray[i];
            var IdUser = row['Id'];
            var UserName = row['username'];
            ligne = "<span id="+IdUser+"; onclick='updateInvitationButton("+IdUser+");' onmouse='overElement(this);' onmouseout=outElement(this) style=\"border-width:2px; border-style:solid; border-color:black;\">"+UserName+"</span><br/>";
            affiche = affiche + ligne;
        }
        $('#page').html(affiche);

    }
    catch(err){
        window.console.log("fetchcodiscipleCallBack -err = " + err);
    }


    window.console.log("addCoDiscipleCallBack() -end");
}


function updateInvitationButton(id){
    window.console.log("updateInvitationButton() -start");
    $("#boutonInvitation").attr(onclick,sendInvitation(id));
    window.console.log("updateInvitationButton() -end");
}

function sendInvitation(id){
    window.console.log("sendInvitation() -start");
    $.ajax({
        type:'GET',
        url:'bl/sendInvitation.php',
        data: "id="+id,
        dataType:'text',
        success: sendInvitationCallBack
    });

    window.console.log("sendInvitation() -end");
}

function sendInvitationCallBack(ret){
    window.console.log("sendInvitation() -start");
    if(ret==1)
    {
        alert("L'invitation a bien été envoyée.");
    }
    else{
        alert(ret);
    }
    addCoDisciple();
    window.console.log("sendInvitation() -end");
}

function invitationSent(){
    window.console.log("invitationSent() -start");
    $.ajax({
        type:'GET',
        url:'bl/invitationSent.php',
        success: invitationSentCallBack
    });

    window.console.log("invitationSent() -end");
}

function invitationSentCallBack(ret){
    window.console.log("invitationSentCallBack() -start");
    try
    {
        var jarray=$.parseJSON(ret);
        var affiche = "Liste des co'disciples à qui vous avez envoyé une invitation<hr><br/>"
        for(var i = 0; i<jarray.length; i++ ){
            var ligne="";
            var row=jarray[i];
            var UserName = row['username'];
            ligne = UserName+": en attente d'une réponse de sa part<br/>";
            affiche = affiche + ligne;
        }
        $('#page').html(affiche);

    }
    catch(err){
        window.console.log("invitationSentCallBack -err = " + err);
    }

    window.console.log("invitationSentCallBack() -end");
}

function invitationReceived(){
    window.console.log("invitationReceived() -start");
    $.ajax({
        type:'GET',
        url:'bl/invitationReceived.php',
        success: invitationReceivedCallBack
    });

    window.console.log("invitationReceived() -end");
}

function invitationReceivedCallBack(ret){
    window.console.log("invitationReceivedCallBack DEBUT avec ret = "+ret);
    try
    {
        var jarray=$.parseJSON(ret);
        var affiche = "Co'disciples attendant une réponse à leur invitation<hr><br/>"+
            "<input class=\"btn btn-warning\" id=\"boutonAccept\" type=\"button\" value=\"Accepter\" style=\"margin-bottom:10px; margin-right:10px; background-color:rgb(228,229,231); border:0px; font-size:12px\">"
            +"<input class=\"btn btn-warning\" id=\"boutonRefuse\" type=\"button\" value=\"Refuser\" style=\"margin-bottom:10px; background-color:rgb(228,229,231); border:0px; font-size:12px\"><br>";
        for(var i = 0; i<jarray.length; i++ ){
            var ligne="";
            var row=jarray[i];
            var Id = row['Id'];
            var username = row['username'];
            ligne = "<span id="+Id+"; onclick=choiceInvitationButtons("+Id+"); onmouse='overElement(this);' onmouseout=outElement(this); style=\"border-width:2px; border-style:"+
                "solid; border-color:black;\">Invitation de: "+username+" en attente d'une réponse de votre part<br/>";
            affiche = affiche + ligne;
        }
        $('#page').html(affiche);

    }
    catch(err){
        window.console.log("invitationReceivedCallBack -err = " + err);
    }

    window.console.log("invitationReceivedCallBack SORTIE avec Id = "+Id);
}

function choiceInvitationButtons(id){
    window.console.log("choiceInvitationButtons() -start");
    $("#boutonAccept").attr("onclick","AcceptInvitation("+id+")");
    $("#boutonRefuse").attr("onclick","RefuseInvitation("+id+")");
    window.console.log("choiceInvitationButtons() -end");
}

function AcceptInvitation(id){
    window.console.log("AcceptInvitation() -start");
    $.ajax({
        type:'GET',
        url:'bl/AcceptInvitation.php',
        data: "id="+id,
        dataType:'text',
        success: AcceptInvitationCallBack
    });
    window.console.log("AcceptInvitation() -end");
}

function AcceptInvitationCallBack(ret){
    window.console.log("AcceptInvitationCallBack() -start");
    if(ret==1)
    {
        alert("L'invitation a bien été acceptée.");
    }
    else{
        alert(ret);
    }
    invitationReceived();
    window.console.log("AcceptInvitationCallBack() -end");
}

function RefuseInvitation(id){
    window.console.log("RefuseInvitation() -start");
    $.ajax({
        type:'GET',
        url:'bl/RefuseInvitation.php',
        data: "id="+id,
        dataType:'text',
        success: RefuseInvitationCallBack
    });
    window.console.log("RefuseInvitation() -end");
}

function RefuseInvitationCallBack(ret){
    window.console.log("RefuseInvitationCallBack() -start");
    if(ret==1)
    {
        alert("L'invitation a bien été refusée.");
    }
    else{
        alert(ret);
    }
    invitationReceived();
    window.console.log("RefuseInvitationCallBack() -end");
}


// ************************************ ANCIEN CODE *******************************************

    // function fetchCoDisciplesCallback(ret) {
    //     window.console.log("J'ai eu un success dans fectchCoDisciple -> je rentre dans fetchCoDiCallBack");
    //     $('#page').html(ret);
    //     try {
    //         var affiche = "Liste des co'disciples<hr>";
    //         var jarray=fetchCoDisciples(ret);
    //         for (var i = 0; i < fetchCoDisciples.length; i++) {
    //             var row =jarray[i];
    //             var id = row['Id'];
    //             var username = row['username'];
    //
    //             ligne =  username +"</span><br/>";
    //             affiche = affiche + ligne;
    //         }
    //         document.getElementById("page").innerHTML = affiche;
    //         $('#page').html(affiche);
    //
    //     }
    //     catch (err) {
    //         window.console.log("J'ai une erreur dans le PHP dans fetchCoDiscipleCallBacks = " + err);
    //    }
    //     window.console.log("Je sors fetchCoDisciplesCallback avec succès avec AFFICHE = " + affiche);
    // }







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// /**
//  * Anciennes version et test de code
//  */
//
// /**
//  * Appelé quand click le bouton de la boîte de connexion
//  * si g_isConnected = true : on est déjà connecté et l'utilisateur doit être déconnecté
//  *     --> puis il appelle alors fetchCoDisciple pour charger les CoDisciples
//  * si g_isConnected = false : authenticate(username, password) décide si connection ou non
//  */
// function doConnect() {
//     window.console.log("doConnect() -start");
//
//     authenticate($("#logUsername").val(),$("#logPassword").val());  /** Appelle la fct° authenticate  **/
//     if(g_isConnected==true){										/** le résultat d'authenticate nous renvoie via authenticatecallback "g_isConnected" qui peut être True/False  **/
//     fetchCoDisciples();
//         $('#connectBox').html(txtLegendConnect);
//         $('#boutonLogin').val(txtDisconnect);
//         $('#logUsername').val("");
//         $('#logPassword').val("");
//     }
//     else{
//         initApp();
//     }
//     pubs();
//
//
//     window.console.log("doConnect() -end");
// }
//
// function pubs() {
//         window.console.log("pubs() -start");
//         //
//         var publicite = "1|Concombre->Le meilleur#1|Tomate->La plus rouge#0|Carotte->La plus longue#1|salade->La plus légère#1|Choux->La fleur#1|Radis->Le noir#0|Asperge->La plus grande";
//         var pubs = publicite.split("#");
//         var pubHTML;
//         //#page
//         pubHTML = '<div id="vegetables">';
//         var k = pubs[0].indexOf('-');
//         pubHTML += pubs[0].substring(2, k);
//         for (i = 1; i < pubs.length; i++) {
//             k = pubs[i].indexOf('-');
//             pubHTML += "<br/>" + pubs[i].substring(2, k);
//         }
//         pubHTML += "</div>"
//         document.getElementById("page").innerHTML = pubHTML;
//         //#wall
//         pubHTML = '<div id="pubs">';
//         for (i = 0; i < pubs.length; i++) {
//             if (pubs[i].charAt(0) == "1") pubHTML += "<br/>" + pubs[i].substring(2);
//         }
//         pubHTML += "</div>"
//         document.getElementById("wall").innerHTML = pubHTML;
//         //
//         window.console.log("pubs() -end");
//     }
//
// const txtConnect="Se connecter";
// const txtDisconnect="Se deconnecter";
// const txtLegendConnect="Connecté";
// const txtLegendDisconnect="Deconnecté";
//
// //var global
// var g_username;
// var g_password;
// var g_isConnected;
//
//
// /**
//  * Réinitialise les variables globales
//  * Appelé à la fin du chargement de la page et quand nécessaire
//  */
// function initApp() {
// 	window.console.log("initApp() -start");
// 	g_isConnected=false;
//     window.console.log("Entrée dans initApp avec g_isConected = "+g_isConnected);
//     g_username="";
//     g_password="";
//     $('#logUsername').val("");
//     $('#logPassword').val("");
//     $("#boutonLogin").val(txtConnect);
//     $("#connectBox").html(txtLegendDisconnect);
// 	//
// 	window.console.log("sortie d'initApp avec g_isConnected = "+ g_isConnected);
//
// }
//
// /**
//  * Appelé quand click le bouton de la boîte de connexion
//  * si g_isConnected = true : on est déjà connecté et l'utilisateur doit être déconnecté
//  * si g_isConnected = false : authenticate(username, password) décide si connection ou non
//  */
// function doConnect() {
//     window.console.log("il rentre dans DoConnect");
//     var username= $('#logUsername').val();
//     var password= $('#logPassword').val();
//     var b = authenticate(username,password)
//
// 		if (b) {
// 				g_isConnected = true;
//             window.console.log("il me retourne g_isConnected = true");
// 		}
//
// 		else {
// 			initApp();
// 			g_isConnected == false;
//             window.console.log("Il me retourne g_isConnected = false");
// 		}
//
//     window.console.log("Sortie de DoConnect avec g_isConnected = " + g_isConnected);
// }
//
//
//
// /**
//  * authentifie un login = (username, password)
//  * @param username : nom d'utilisateur
//  * @param password : mot de passe
//  * @returns true si login identifié, false sinon
// */
// function authenticate(username,password) {
//     window.console.log("Entrée fct° authenticate" + " - " + username + "  - " + password);
// 	$.ajax({
// 					type : 'GET',
// 					url: 'bl/authenticate.php',
// 					data: "username="+username+"&password="+password,
// 					dataType: 'text',
// 					success : authenticateCallBack
// 					});
//     window.console.log("Sortie fct° authenticate, il va vers authenticateCallBack");
// }
//
// /**
// * @param response = true si authentifié, false sinon
// * @returns connect() si login identifié, aucune action sinon initApp
// */
// function authenticateCallBack(ret) {
//     window.console.log("Entrée fct° authenticateCallBack avec la response = " + ret);
//                     if(ret)
//                     {
//                         g_isConnected = true;
//                         connect();
//                     }
//
//                     else
//                     {
//                         initApp();
//                         window.console.log("N est pas authentifié et s arrete en initApp");
//
//                     };
//     window.console.log("Sortie fct° authenticateCallBack avec g_isConnected = " + g_isConnected);
// }
//
// function connect() {
//     /** g_isConnected=true;   Dernière modif ici **/
//     window.console.log("Entrée fct° connect()");
//     var username= $('#logUsername').val();
//     var password= $('#logPassword').val();
//
//
//     if (g_isConnected == true) {
//         window.console.log("La fct° authenticate dans connect est TRUE");
//         /** le résultat d'authenticate nous renvoie via authenticatecallback "g_isConnected" qui peut être True/False  **/
//
//         $('#connectBox').html(txtLegendConnect);
//         $('#boutonLogin').val(txtDisconnect);
//         $('#logUsername').val("");
//         $('#logPassword').val("");
//     }
//     else {
//         window.console.log("La fct° authenticate dans connect est FALSE");
//         initApp();
//     }
//     pubs();
// }
//
//
//     /**
//      * Affiche la publicité sur le mur
//      * Une pub est affichée seulement si 1er caractère est 1
//      * Appelé par initApp à la fin du chargement de la page
//      * Conseil utilisation :
//      * Disparait quand connecté et réapparait quand déconnecté
//      */
//     function pubs() {
//         window.console.log("pubs() -start");
//         //
//         var publicite = "1|Concombre->Le meilleur#1|Tomate->La plus rouge#0|Carotte->La plus longue#1|salade->La plus légère#1|Choux->La fleur#1|Radis->Le noir#0|Asperge->La plus grande";
//         var pubs = publicite.split("#");
//         var pubHTML;
//         //#page
//         pubHTML = '<div id="vegetables">';
//         var k = pubs[0].indexOf('-');
//         pubHTML += pubs[0].substring(2, k);
//         for (i = 1; i < pubs.length; i++) {
//             k = pubs[i].indexOf('-');
//             pubHTML += "<br/>" + pubs[i].substring(2, k);
//         }
//         pubHTML += "</div>"
//         document.getElementById("page").innerHTML = pubHTML;
//         //#wall
//         pubHTML = '<div id="pubs">';
//         for (i = 0; i < pubs.length; i++) {
//             if (pubs[i].charAt(0) == "1") pubHTML += "<br/>" + pubs[i].substring(2);
//         }
//         pubHTML += "</div>"
//         document.getElementById("wall").innerHTML = pubHTML;
//         //
//         window.console.log("pubs() -end");
//     }
//
//
