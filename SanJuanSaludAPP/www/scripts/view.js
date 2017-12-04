

myApp.onPageInit('departamentos', function (page) {
    getDepartamento();
});



myApp.onPageInit('buscar' , function(page){

    // Now you can use it
    //mySearchbar.search('Hello aworld');
    //csBuscarList();
});

myApp.onPageInit('caps', function (page) {

    getCentroDeSaludxDpto(DptoID);
});

myApp.onPageInit('caps-detail', function (page) {

    requestPermissionGPS();
    getCentroDeSaludDB(CapsID);
    getCentroDeSaludEyHDB(CapsID);
    getCentroDeSaludLCDB(CapsID);

});

myApp.onPageInit('index', function (page) {

    load();
});


myApp.onPageInit('mapa', function (page) {

    requestPermissionGPS();
    GPS();
});



function load()
{
    getSlider();



    $("#btnAyuda").click(function(){

        mainView.router.loadPage("ayuda.html");
    });

    $("#btnProtur").click(function(){

        mainView.router.loadPage("formularioProtur.html");
        
    });

    $("#btn1000dias").click(function(){

        mainView.router.loadPage("1000dias.html");

    });


    $("#btn1000dias").click(function(){

        mainView.router.loadPage("formulario1000dias.html");
    });




    //- Two groups
    $$('.ac-3').on('click', function () {
        var buttons = [
            {
                text: 'Elija de qué forma buscar Centros de Salud:',
                label: true
            },
            {
                text: 'Centros de Salud Cercanos (a tu posición actual)',
                bold: true,
                onClick: function(){
                    mainView.router.loadPage("GPS.html");
                }
            },
            {
                text: 'Por Nombre',
                bold: true,
                onClick: function(){
                    mainView.router.loadPage("buscar.html");
                }
            },
            {
                text: 'Por Departamento',
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
        
        window.plugins.toast.show(mensajeVerificacion,"3000","bottom");
    }


}

function verificar(dataArray){

    for(var index in dataArray){

        dataArray[index]
            .parent()
            .removeClass("campoErroneo");
    }

    /*nombre sin números*/
    var patternName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
    /*teléfono entre 6 y 10 caracteres*/
    var patternPhone = /\b\d{6,10}/;
    /*mail*/
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

/*Muestra un popup informativo antes de confirmar el envío de la solicitud*/
function confirmarEnvio(){

    myApp.confirm(
        '<ul>' +
            '<li>' +
                '<div>Debe esperar que un PROTUR se contacte con usted para que le asigne un turno.</div>'+
            '</li>'+
            '<li>' +
                '<div>Si solicita una especialidad debe contar con la derivación de un profesional.</div>'+
            '</li>'+
            '<li>' +
                '<div>Para su rápida atención, escriba en el comentario cualquier duda o particularidad.</div>'+
            '</li>'+
        '</ul> ',
        'Tenga en cuenta:',function () {
        
            enviarDatos();
    });
}

/*Envía los datos a la API*/
function enviarDatos(){

   // var timestamp = new Date();

    var data =  {

        "Nombre": $("#nya").val(),
        "DepId": $("#depto").val(),
        "Telefono1": $("#tel1").val(),
        "Telefono2": $("#tel2").val(),
        "Email": $("#mail").val(),
        "Comentarios": $("#coment").val(),
        //"Fecha": timestamp,
        "Direccion": $("#dir").val()

    };

    $.ajax({
        type: "POST",
        url: proturURL,
        data: data ,
        success: function(response){

            console.dir(response)

            if(response.ok == 0){

                myApp.alert("Se produjo un error, intente nuevamente mas tarde","Error");
            }else{


                var htmlAlert = '<p>Se enviaron los datos</p><p>Anote y guarde el siguiente número para referencias:</p><h4>'+ response.NuevoID +'</h4>';
                myApp.alert(htmlAlert ,"Correcto!");

                $("#nya").val("");

                $("#depto").val("");
                $("#tel1").val("");
                $("#tel2").val("");
                $("#mail").val("");
                $("#coment").val("");
                $("#dir").val("");
            }
        },
        error: function(response){


            myApp.alert("Se produjo un error, intente nuevamente mas tarde","Error");
        },
        dataType: "json"
    });
    
    
}

/*Envía los comentarios de la página de preguntas o sugerencias*/
function enviarComentario(){

    var comentario = $("#textareaComentario").val();
    /*regex de email*/
    var patternMail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;

    /*Para evitar que boludeen pongo que al menos tenga 10 caracteres el comentario*/
    if(comentario.length < 10){

        myApp.alert("Escriba un comentario mas completo por favor","Atención!");

    }else if($("#cemail").val() !== "" && ! patternMail.test($("#cemail").val())){


        myApp.alert("El mail está mal ingresado","Error");

    }else {

        $.ajax({
            type: "POST",
            url: comentarioURL,
            data: {
                'mail': $('#cemail').val(),
                'comentario': comentario
            },
            success: function (response) {

                myApp.alert("Se envió su comentario correctamente","Excelente!");
            },
            error: function (response) {

                myApp.alert("Se produjo un error, intente nuevamente mas tarde","Ups!");
            },
            dataType: "json"
        });
    }

}