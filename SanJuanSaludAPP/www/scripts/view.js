$$(document).on('DOMContentLoaded', function(){


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


    });


    $$('#btnCentros').on('click',function(){

        var clickedLink = this;

        myApp.popover('.popover-links', clickedLink);
    });

/*
    $$('#btnDepto').on('click',function(){
        console.log("llega");
        mainView.router.loadPage("departamentos.html");

    });
*/

});
