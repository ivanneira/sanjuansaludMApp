

myApp.onPageInit('departamentos', function (page) {
    getDepartamento();
});


myApp.onPageInit('caps', function (page) {

    getCentroDeSaludxDpto(DptoID);
});

myApp.onPageInit('caps-detail', function (page) {

    getCentroDeSalud(CapsID);
    getCentroDeSaludEyH(CapsID);
    getCentroDeSaludLC(CapsID);

});

myApp.onPageInit('index', function (page) {

  load();

});


myApp.onPageInit('mapa', function (page) {

    navigator.geolocation.getCurrentPosition(successGPS, errorGPS, optionsGPS);

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
