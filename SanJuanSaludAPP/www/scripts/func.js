
var server = "gedoc.sanjuan.gov.ar";
var ErrorAjax = "Ups! Hubo un problema con su conexión a internet.";
var NoticiasURL = "http://"+server+"/AresApi/Api/Portal/Noticias";
var DepartamentosURL = "http://"+server+"/AresApi/Api/Departamento";
var CapsURL = "http://"+server+"/AresApi/Api/CentroDeSalud";
//var portalUrl = "http://200.0.236.210/AresApi/Api/Portal/Noticias";
var DptoID = 0;
var CapsID = 0;

function setCapsId(id,page)
{
    CapsID=id;
    openPage(page);
}

function setDptoId(id,page)
{
    DptoID=id;
    openPage(page);
}

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

            fillSlider($("#slide"), response);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

/*FUNCION QUE VUELCA LOS DATOS EN EL SLIDER UNA VEZ CREADA LA ESTRUCTURA*/
function fillSlider(selector,json)
{
    $(selector).empty();

    for(var i=0; i<json.length;i++)
    {
        var temp ='<div id="'+json[i].nid+'" class="swiper-slide" style="background: url(http://sanjuan.gov.ar/'+json[i].nf+') no-repeat center top;background-size:cover;">'+
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

    //inicialización de swiper
    var mySwiper = myApp.swiper('.swiper-container', {
        speed: 600,
        spaceBetween: 10,
        autoplay: 4000
    });

    mySwiper.on('onTap', function(data){
       abrirNoticia(data);

    });
}

function openPage(page){
    console.log("pepe");
    mainView.router.loadPage(page);
}

//función para abrir noticia
function abrirNoticia(slide){

    var imagenURL;

    $("#"+slide.clickedSlide.id).filter(function(){
        imagenURL = $(this).css("background-image");
    });

    var titulo = slide.clickedSlide.innerText;
    var letrasEnElTitulo = titulo.length;

    console.log(letrasEnElTitulo)

    var texto = slide.clickedSlide.textContent;

    texto = texto.substring(letrasEnElTitulo-2);

    var popupHTML =
        '<div class="popup tablet-fullscreen">'+
        '<div class="content-block backImage">'+
        '<h3>'+titulo+'</h3>'+
        '<p>'+texto+'</p>'+
        '<p><a href="#" class="close-popup">Volver</a></p>'+
        '</div>'+
        '</div>';

    //$(".backimage").css({'background-image':  imagenURL + " !important"  });

    myApp.popup(popupHTML);
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
            for(var i=0;i<response.length;i++) {
                $("#dptos-container").append('<a href="#"  onclick="javascript:setDptoId('+response[i].ID+',\'caps.html\')" class="button button-fill button-raised boton-chico">' + response[i].Nombre + ' </a><br>');
            }
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
            $("#caps-tittle").html(response.Nombre);
            $("#caps-basic").append("<p>Dirección: " + response.Direccion + "</p>");
            $("#caps-basic").append("<p>Teléfono: " + response.Telefono + "</p>");

            var pos = {lat: response.Latitud, lng: response.Longitud};
            var mapProp= {
                //-31.536395, -68.536976
                center:new google.maps.LatLng(pos),
                zoom:15,

            };
            var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
            var marker = new google.maps.Marker({position: pos});
            var infowindow = new google.maps.InfoWindow({
                content: response.Nombre
            });
            infowindow.open(map,marker);
            marker.setMap(map);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

function getCentroDeSaludxDpto(id)
{
    console.log(id);
    var tmp = [];
    var j=0;
    $.ajax({

        url: CapsURL,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            for(var i=0;i<response.length;i++) {
                if (response[i].DepartamentoID == id) {
                    tmp.push(response[i]);

                    $("#caps-container").append('<a href="#"  onclick="javascript:setCapsId('+response[i].ID+',\'capsDetail.html\')" class="button button-fill button-raised boton-chico">'+response[i].Nombre+' </a><br>');
                }
            }
            console.dir(tmp);
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

            if(response.length !=0) {
                for (var i = 0; i < response.length; i++) {
                    $("#caps-eyh").append("<p>Especialidad: " + response[i].Nombre + "</p>");
                    for(var j=0;j<response[i].Horarios.length;j++)
                    {
                        $("#caps-eyh").append("<p><li>"+response[i].Horarios[j].Dia+": " + response[i].Horarios[j].HorarioEntrada + "--" + response[i].Horarios[j].HorarioSalida +"</li></p>");

                    }
                }
            }
            else
            {
                $("#caps-eyh").append("<p>Sin información para mostrar</p>");
            }
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
            if(response.length !=0) {
                for (var i = 0; i < response.length; i++) {
                    $("#caps-lc").append("<p>Línea número: " + response[i].Numero + "</p>");
                }
            }
            else
            {
                $("#caps-lc").append("<p>Sin información para mostrar</p>");
            }

        },
        error: function (error) {

            alert(ErrorAjax);
        }

    });
}

