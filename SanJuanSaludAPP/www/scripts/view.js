

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

        confirmarEnvio();
    }else {

        //console.log("NO se envía " + mensajeVerificacion)
        window.plugins.toast.show(mensajeVerificacion,"3000","bottom");
    }


}

function verificar(dataArray){

    for(var index in dataArray){

        dataArray[index]
            .parent()
            .removeClass("campoErroneo");
    }


    var patternName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
    var patternPhone = /\b\d{6,10}/;
    var patternMail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;


    if(! patternName.test( dataArray[0].val())){

        dataArray[0]
            .parent()
            .addClass("campoErroneo");

        return "El nombre es obligatorio, use solo letras";

    }else if(! patternPhone.test(dataArray[2].val())){

        dataArray[2]
            .parent()
            .addClass("campoErroneo");

        return "El teléfono es obligatorio, use solo números";
    }

    if(dataArray[1].val() !== "" && ! patternMail.test(dataArray[1].val())){

        dataArray[1]
            .parent()
            .addClass("campoErroneo");

        return "El mail NO es obligatorio, pero está mal ingresado";
    }

    if(dataArray[3].val() !== "" && ! patternPhone.test(dataArray[3].val())){

        dataArray[3]
            .parent()
            .addClass("campoErroneo");

        return "NO es obligatorio poner el segundo teléfono, pero está mal ingresado";
    }
    
    return "ok";
}


function confirmarEnvio(){

    myApp.confirm(
        '<ul>' +
            '<li>' +
                '<div>Para programar el turno tiene que esperar la llamada de un PROTUR.</div>'+
            '</li>'+
            '<li>' +
                '<div>Si solicita una especialidad necesita una derivación.</div>'+
            '</li>'+
        '</ul> ',
        'Tenga en cuenta:',function () {
        
            enviarDatos();
    });
}

function enviarDatos(){

    var timestamp = new Date();

    var data =  {

        "Nombre": $("#nya").val(),

        "DepId": $("#depto").val(),
        "Telefono1": $("#tel1").val(),
        "Telefono2": $("#tel2").val(),
        "Email": $("#mail").val(),
        "Comentarios": $("#coment").val(),
        "Fecha": timestamp,
        "Direccion": $("#dir").val()

    };

    $.ajax({
        type: "POST",
        url: proturURL,
        data: data,
        success: function(response){

            console.log(response);
            myApp.alert("Se enviaron los datos correctamente");
        },
        error: function(response){

            console.log(response);
            myApp.alert("Se produjo un error, intente nuevamente mas tarde");
        },
        dataType: "json"
    });
    
    
}