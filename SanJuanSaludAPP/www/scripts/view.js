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

/*
    $$('#btnCentros').on('click',function(){
   var clickedLink = this;

        myApp.popover('.popover-links', clickedLink);



    });
*/

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



/*
    $$('#btnDepto').on('click',function(){
        console.log("llega");
        mainView.router.loadPage("departamentos.html");

    });
*/

});
