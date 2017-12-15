// here initialize the app
var myApp = new Framework7();

// If your using custom DOM library, then save it to $$ variable
var $$ = Dom7;

// Add the view
var mainView = myApp.addView('.view-main', {
    main: true,
    material: true,
    fastClicks: true,
    animateNavBackIcon:false,
});


var db = null;

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
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);

    function onOffline() {

        setTimeout(function(){

            $("#btnCartaMedica").unbind('click').click(function() {
            window.plugins.toast.show("Se requiere una conexión activa para usar este servicio.", "3000", "bottom");
        });
        $("#btnCartaMedica").css('background-color','lightgray');
        }, 3000);


    }

    function onOnline() {

        setTimeout(function(){

            $("#btnCartaMedica").unbind('click').click(function() {
                mainView.router.loadPage("cartaMedica.html");
            });
            $("#btnCartaMedica").css('background-color','white');


        }, 3000);

        sincronizarDB();
        getSlider();
        //myApp.alert("Has recuperado la conexión a internet, la aplicación sincronizará información ahora.","Salud San Juan.");

    }

    function onDeviceReady() {


        document.addEventListener("backbutton", onBackKeyDown, false);

        //FORZADO DE ACTIVACION DE GPS EN LAS PLATAFORMAS
        requestPermissionGPS();

        Database(db);


        // Controlar la pausa de Cordova y reanudar eventos
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );

        // TODO: Cordova se ha cargado. Haga aquí las inicializaciones que necesiten Cordova.

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
    /*function onBackKeyDown() {
        mainView.router.back();
    }*/
    //document.addEventListener("backbutton", onBackKeyDown, false);
    //document.addEventListener("deviceready", onDeviceReady2, false);

    function onBackKeyDown() {
        var page=myApp.getCurrentView().activePage;
        myApp.hidePreloader();
        if(page.name=="index"){
            myApp.confirm('¿Quiere salir de la aplicación?', 'Salir',function () {
                navigator.app.clearHistory(); navigator.app.exitApp();
            });
        }
        else{
            mainView.router.back();
        }


    }


} )();


