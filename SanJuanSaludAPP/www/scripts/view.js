$$(document).on('DOMContentLoaded', function(){


    $("#btnAyuda").click(function(){

        $.ajax({
            url:"ayuda.html"

        }).done(function(data){
            myApp.popup(data);
        });


    });

    $("#btnCentros").click(function(){

        $.ajax({
            url:"opciones.html"

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


    });

});
