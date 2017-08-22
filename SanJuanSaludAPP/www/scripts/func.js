
var ErrorAjax = "Ups! Hubo un problema con su conexión a internet.";
var NoticiasURL = "http://10.64.65.200/AresApi/Api/Portal/Noticias";
var DepartamentosURL = "http://10.64.65.200/AresApi/Api/Departamento";
var CapsURL = "http://10.64.65.200/AresApi/Api/CentroDeSalud";
//var portalUrl = "http://200.0.236.210/AresApi/Api/Portal/Noticias";


function createDatabase()
{
    var db = null;
    db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});

    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS MyTable');
        tx.executeSql('CREATE TABLE MyTable (SampleColumn)');
        tx.executeSql('INSERT INTO MyTable VALUES (?)', ['test-value'], function(tx, resultSet) {
            console.log('resultSet.insertId: ' + resultSet.insertId);
            console.log('resultSet.rowsAffected: ' + resultSet.rowsAffected);
            alert(resultSet.insertId);
            alert(resultSet.rowsAffected);
        }, function(tx, error) {
            console.log('INSERT error: ' + error.message);
        });
    }, function(error) {
        console.log('transaction error: ' + error.message);
    }, function() {
        console.log('transaction ok');
        alert("OK");
    });

}

/*FUNCION QUE OBTIENE EL SLIDER ACTUAL DEL PORTAL DE GOBIERNO A TRAVES DE LA API DE PAULO*/
function getSlider()
{
    $.ajax({

        url: NoticiasURL,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            fillSlider($("#slider"), response);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

/*FUNCION QUE VUELCA LOS DATOS EN EL SLIDER UNA VEZ CREADA LA ESTRUCTURA*/
function fillSlider(selector,json)
{
    console.dir(json);
    $(selector).empty();


    for(var i=0; i<json.length;i++)
    {
        var temp ='<div id="'+json[i].nid+'" class="cover-card col-sm-12 img-thumbnail" style="background: url(http://sanjuan.gov.ar/'+json[i].nf+') no-repeat center top;background-size:cover;">'+
            '<div class="overlay">'+
            '<p>'+
            json[i].nt+
            '</p>'+
            '<div style="display:none" id="'+json[i].nid+'_full">' +
            '<p>'+json[i].nd+'</p>'+
            '</div>'+
            '</div>'+
            '</div>';


        $(selector).append(temp);
    }

    $('.slide').slick({
        autoplay: 5000,
        slidesToShow: 1,
        adaptiveHeight: true,
        centerMode: true,
        dots: true,
        arrows: false,
        centerPadding: '10px',
        mobileFirst: true

});

}

/*FUNCION PARA OBTENER DEPARTAMENTOS*/
function getDepartamento()
{
    $.ajax({

        url: DepartamentosURL,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            //fillSlider($("#slider"), response);
            console.dir(response);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}


/*FUNCION PARA OBTENER CENTROS DE SALUD*/
function getCentrosDeSalud()
{
    $.ajax({

        url: CapsURL,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            //fillSlider($("#slider"), response);
            console.dir(response);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

/*FUNCION PARA OBTENER UN CENTRO DE SALUD*/
function getCentroDeSalud(id)
{
    $.ajax({

        url: CapsURL + "/" + id,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            console.dir(response);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

/*FUNCION PARA OBTENER ESPECIALIDADES Y HORARIOS PARA UN CENTRO DE SALUD*/
function getCentroDeSaludEyH(id)
{
    $.ajax({

        url: CapsURL + "/" + id+ "/EspecialidadesYHorarios",
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            console.dir(response);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

/*FUNCION PARA OBTENER LINEAS DE COLECTIVOS QUE LLEGAN A UN CENTRO DE SALUD*/
function getCentroDeSaludLC(id)
{
    $.ajax({

        url: CapsURL + "/" + id+ "/LineasDeColectivos",
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            console.dir(response);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

$("#bntCSalud").click(function () {

    $.get("departamentos.html", function(data){

        $("#mainContainer").html(data)
    })
});