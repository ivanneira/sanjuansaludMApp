// here initialize the app
var myApp = new Framework7();

// If your using custom DOM library, then save it to $$ variable
var $$ = Dom7;

// Add the view
var mainView = myApp.addView('.view-main', {
    main: true,
    material: true,
});


function requestPermissionGPS()
{
    if(typeof(cordova.plugins) != 'undefined') {
        //cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
            //if (canRequest) {
                cordova.plugins.locationAccuracy.request(function () {
                        //console.log("Request successful");
                        navigator.geolocation.getCurrentPosition(successGPS, errorGPS, optionsGPS);
                    }, function (error) {
                        //alert("Por favor habilite los permisos de ubicación para el correcto funcionamiento de la aplicación.");
                        window.plugins.toast.show("Por favor habilite los permisos de ubicación para el correcto funcionamiento de la aplicación.","3000","bottom");
                        if (error) {
                            // Android only
                            console.error("error code=" + error.code + "; error message=" + error.message);
                            if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                                if (window.confirm("Fallo al solicitar ubicación con alta presición. Desea abrir la configuración y hacerlo manualmente?")) {
                                    cordova.plugins.diagnostic.switchToLocationSettings();
                                }
                            }
                        }
                    }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
                );
            //}
        //});
    }

}
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );
    document.addEventListener("backbutton", onBackKeyDown, false);


    function onDeviceReady() {


        //FORZADO DE ACTIVACION DE GPS EN LAS PLATAFORMAS
        requestPermissionGPS();
        //createDatabase();
        //maps();

        // Controlar la pausa de Cordova y reanudar eventos
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );

        // TODO: Cordova se ha cargado. Haga aquí las inicializaciones que necesiten Cordova.
        //var parentElement = document.getElementById('deviceready');
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
    };

    function onPause() {
        // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
    };

    function onResume() {
        // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
    };

    // device APIs are available
    //


    // Handle the back button
    //
    function onBackKeyDown() {
        mainView.router.back();
    }



} )();