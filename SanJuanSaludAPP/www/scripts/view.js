

myApp.onPageInit('departamentos', function (page) {
    getDepartamento();
});


myApp.onPageInit('caps', function (page) {

    getCentroDeSaludxDpto(DptoID);
    //navigator.geolocation.getCurrentPosition(successGPS, errorGPS, optionsGPS);

});

myApp.onPageInit('caps-detail', function (page) {

    requestPermissionGPS();
    getCentroDeSalud(CapsID);
    getCentroDeSaludEyH(CapsID);
    getCentroDeSaludLC(CapsID);

});

myApp.onPageInit('index', function (page) {
    //requestPermissionGPS();
    load();
});


myApp.onPageInit('mapa', function (page) {

    requestPermissionGPS();
    GPS();
});



function load()
{
    getSlider();
    /*
    $("#btnAyuda").click(function(){

        $.ajax({
            url:"ayuda.html"

        }).done(function(data){
            myApp.popup(data);
        });


    });

    $("#btnProtur").click(function(){

        $.ajax({
            url:"formularioProtur.html"

        }).done(function(data){
            myApp.popup(data);
        });


    });*/

    $("#btnAyuda").click(function(){

        mainView.router.loadPage("ayuda.html");
    });

    $("#btnProtur").click(function(){

        mainView.router.loadPage("formularioProtur.html");
        
    });


    //- Two groups
    $$('.ac-3').on('click', function () {
        var buttons = [
            {
                text: 'Elija de qué forma buscar Centros de Salud:',
                label: true
            },
            {
                text: 'Buscar con mi dispositivo móvil',
                bold: true,
                onClick: function(){
                    mainView.router.loadPage("GPS.html");
                }
            },
            {
                text: 'Buscar por departamento',
                bold: true,
                onClick: function(){
                    mainView.router.loadPage("departamentos.html");
                }
            }
        ];
        var buttons2 = [
            {
                text: 'Cancelar',
                color: 'red'
            }
        ];
        var groups = [buttons, buttons2];

        myApp.actions(groups);
    });

}

$$(document).on('DOMContentLoaded', function(){
    load();
});

function validacionProtur (){

    var campos = [];

    campos[0] = $("#nya");

    campos[1] = $("#mail");

    campos[2] = $("#tel1");

    campos[3] = $("#tel2");

    campos[4] = $("#depto");

    campos[5] = $("#dir");

    campos[6] = $("#coment");

    var mensajeVerificacion = verificar(campos);

    if( mensajeVerificacion === "ok"){

        console.log("ponele que se envía")
    }else {

        console.log("ponele que no se envía " + mensajeVerificacion)
    }


}

function verificar(dataArray){


    var patternName = /^[a-z ,.'-]+$/i;

    var flag = "ok";



        if(dataArray[0].val()==""){

            flag = "falla el nombre";

            dataArray[0]
                .parent()
                .addClass("bg-red");


        }else{



            console.log(patternName.test( dataArray[0].val()));

        }



    return flag;


}



