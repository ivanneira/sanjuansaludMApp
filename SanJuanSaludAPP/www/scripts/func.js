var server = "gedoc.sanjuan.gov.ar";
var ErrorAjax = "Ups! Hubo un problema con su conexión a internet.";
var NoticiasURL = "http://"+server+"/AresApi/Api/Portal/Noticias";
var DepartamentosURL = "http://"+server+"/AresApi/Api/Departamento";
var CapsURL = "http://"+server+"/AresApi/Api/CentroDeSalud";
//var portalUrl = "http://200.0.236.210/AresApi/Api/Portal/Noticias";
var DptoID = 0;
var CapsID = 0;
var sinConexion = 'El conenido online no esta disponible momentaneamente.';

//FUNCION QUE DETECTA EL LLAMADO Y RESPUESTA DE AJAX PARA MOSTRAR UN PRELOADER
$(document).ajaxStart(function() {
    myApp.showPreloader('Por favor espere...');
}).ajaxComplete(function() {
    myApp.hidePreloader();
});

//FUNCION PARA CALCULAR DISTANCIA ENTREW DOS PUNTOS
function DistanciaKM(lat1,lon1,lat2,lon2)
{
    rad = function(x) {return x*Math.PI/180;}
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad( lat2 - lat1 );
    var dLong = rad( lon2 - lon1 );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
}

//FUNCION USADA PARA EL ORDENAMIENTO DE ARRAYS POR CLAVES
function keysrt(key,desc) {
    return function(a,b){
        return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
    }
}

//FUNCION ALTERNATIVA A CUANDO LOS DATOS O CONECTIVIDAD DESDE EL DISPOSITIVO NO ESTAN DISPONIBLES
function errorSlider(selector)
{
    var temp ='<div id="err1" class="swiper-slide" style="background: url(images/error.jpg) no-repeat center top;background-size:cover;">'+
        '<div class="overlay">'+
        '<p>'+
        sinConexion+
        '</p>'+
        '</div>'+
        '</div>';


    $(selector).append(temp);
}

//FUNCION PARA SETEAR EL VALOR DE LA VARIABLE GOBAL CapsID
function setCapsId(id,page)
{
    CapsID=id;
    openPage(page);
}

//FUNCION PARA SETEAR EL VALOR DE LA VARIABLE GOBAL DptoID
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

//FUNCION QUE OBTIENE EL SLIDER ACTUAL DEL PORTAL DE GOBIERNO A TRAVES DE LA API DE PAULO
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
            //alert(ErrorAjax);
            errorSlider($("#slide"));
        }

    });
}

//FUNCION QUE VUELCA LOS DATOS EN EL SLIDER UNA VEZ CREADA LA ESTRUCTURA
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

//FUNCION PARA EL REDIRECCIONAMIENTO DE PAGINAS
function openPage(page){
    console.log("pepe");
    mainView.router.loadPage(page);
}

//FUNCION PARA VER NOTICIA COMPLETA
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

//FUNCION PARA OBTENER DEPARTAMENTOS
function getDepartamento()
{
    $.ajax({

        url: DepartamentosURL,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {
            //fillSlider($("#slider"), response);

            var titleFlag = "";
            var htmlTitle= "";

            for(var i=0;i<response.length;i++) {
                response = response.sort(keysrt('Zona'));

                if(response[i].Zona !== titleFlag ){
                    titleFlag = response[i].Zona;

                    htmlTitle = '<div class="content-block-title">Zona '+titleFlag+'</div>';

                    //htmlTitle = '<div class="list-block-label">Zona' + titleFlag + '</div>';
                }else{
                    htmlTitle = '';
                }

                //htmlTitle = '<div class="content-block-title">Zona '+titleFlag+'</div>';
               // $("#dptos-container").append('<a href="#"  onclick="javascript:setDptoId('+response[i].ID+',\'caps.html\')" class="button button-fill button-raised boton-chico">' + response[i].Nombre + ' </a><br>');
                //$("#dptos-container").append('<li class="item-content"> <div class="item-inner" onclick="javascript:setDptoId('+response[i].ID+',\'caps.html\')"><div class="item-title titluloListaBlanca">'+ response[i].Nombre + " - Zona : " +response[i].Zona +'</div></div></li>')
                var htmlString = htmlTitle+'<li class="item-content"> <div class="item-inner" onclick="javascript:setDptoId('+response[i].ID+',\'caps.html\')"><div class="item-title titluloListaBlanca">'+ response[i].Nombre + '</div></div></li>';
                $("#dptos-container").append(htmlString);
            }
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

//FUNCION PARA OBTENER CENTROS DE SALUD
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

//FUNCION PARA OBTENER UN CENTRO DE SALUD
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
            $("#caps-basic").append(' <p><div class="icon f7-icons">home</div>' + "  " +response.Direccion + '</p>');
            $("#caps-basic").append('<p><div class="icon f7-icons">phone</div>' + "  " +response.Telefono + "</p>");



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

            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();

            var pos2 = {lat: -31.536395, lng: -68.536976};
            var request = {
                origin: pos,
                destination: pos2,
                travelMode: google.maps.DirectionsTravelMode['DRIVING'],
                unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
                provideRouteAlternatives: true
            };

            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                    directionsDisplay.setPanel($("#panel_ruta").get(0));
                    directionsDisplay.setDirections(response);
                    alert(response.routes[0].legs[0].distance.value / 1000  + " KM");
                } else {
                    alert("No existen rutas entre ambos puntos");
                }
            });

        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

//FUNCION QUE DEVUELVE LA LISTA DE CENTROS DE SALUD EN UN DEPTO SELECCIONADO
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
            response = response.sort(keysrt('Nombre'));
            for(var i=0;i<response.length;i++) {
                if (response[i].DepartamentoID == id) {
                    tmp.push(response[i]);

                    //$("#caps-container").append('<a href="#"  class="button button-fill button-raised boton-chico">'+response[i].Nombre+' </a><br>');
                    $("#caps-container").append('<li class="item-content"> <div class="item-inner" onclick="javascript:setCapsId('+response[i].ID+',\'capsDetail.html\')"><div class="item-title titluloListaBlanca">'+ response[i].Nombre +'</div></div></li>')
                }
            }
            console.dir(tmp);
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

//FUNCION PARA OBTENER ESPECIALIDADES Y HORARIOS PARA UN CENTRO DE SALUD
function getCentroDeSaludEyH(id)
{
    $.ajax({

        url: CapsURL + "/" + id+ "/EspecialidadesYHorarios",
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            //console.dir(response);
            response  = response.sort(keysrt('Nombre'));

            if(response.length !=0) {

                //inicio
                var htmlStringEsp = '<ul>';


                for (var i = 0; i < response.length; i++) {
                    //$("#caps-eyh").append("<p>Especialidad: " + response[i].Nombre + "</p>");

                    //agrega título
                    htmlStringEsp += '<li class="accordion-item "><a href="#" class="item-content item-link"><div class="item-inner"> <div class="item-title"><div class="icon f7-icons iconList">more_vertical</div>' +response[i].Nombre +'</div></div></a>';



                    for(var j=0;j<response[i].Horarios.length;j++)
                    {
                        //$("#caps-eyh").append("<p><li>"+response[i].Horarios[j].Dia+": " + response[i].Horarios[j].HorarioEntrada + "--" + response[i].Horarios[j].HorarioSalida +"</li></p>");

                        htmlStringEsp += '<div class="accordion-item-content"><div class="content-block"><p>'+response[i].Horarios[j].Dia+': ' + response[i].Horarios[j].HorarioEntrada + '--' + response[i].Horarios[j].HorarioSalida + '</p></div></div>'

                    }

                    htmlStringEsp += '</li>';
                }

                htmlStringEsp += '</ul>';


                $("#caps-eyh").append(htmlStringEsp);
            }
            else
            {
                $("#caps-eyh").append('<p><div class="icon f7-icons">close</div>  Sin información para mostrar</p>');
            }
        },
        error: function (error) {
            alert(ErrorAjax);
        }

    });
}

//FUNCION PARA OBTENER LINEAS DE COLECTIVOS QUE LLEGAN A UN CENTRO DE SALUD
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
                    $("#caps-lc").append('<p><div class="icon f7-icons">navigation</div>  Línea número ' + response[i].Numero + "</p>");
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

