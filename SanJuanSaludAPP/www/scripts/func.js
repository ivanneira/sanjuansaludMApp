var server = "gedoc.sanjuan.gov.ar";
var ErrorAjax = "Ups! Hubo un problema con su conexión a internet.";
var NoticiasURL = "http://"+server+"/AresApi/Api/Portal/Noticias";
var DepartamentosURL = "http://"+server+"/AresApi/Api/Departamento";
var CapsURL = "http://"+server+"/AresApi/Api/CentroDeSalud";
//var portalUrl = "http://200.0.236.210/AresApi/Api/Portal/Noticias";
var DptoID = 0;
var CapsID = 0;
var sinConexion = 'El conenido online no esta disponible momentaneamente.';
var myLat = -31.536395;
var myLong = -68.536976;

//-31.536395, -68.536976
//PARAMETROS DE CONFIGURACION PARA EL GPS
var optionsGPS = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

//FUNCION QUE DEVOLVERA LA POSICION ACTUAL DEL GPS
function successGPS(pos) {
    var crd = pos.coords;

    /*
    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
    */

    myLat = crd.latitude;
    myLong = crd.longitude;

};


//FUNCION QUE BUSCA CENTROS DE SALUD EN UN RADIO DE 10KM
function GPS()
{
    var posx = {lat: myLat, lng: myLong};
    var mapPropx= {
        center:new google.maps.LatLng(posx),
        zoom:10,
    };
    var map=new google.maps.Map(document.getElementById("googleMap"),mapPropx);
    var markerx = new google.maps.Marker({position: posx,icon: 'images/device.png'});
    var infowindowx = new google.maps.InfoWindow({
        content: "Ubicación Actual"
    });

    infowindowx.open(map,markerx);
    markerx.setMap(map);


    //OBTENGO CAPS Y CALCULO DISTANCIAS EN UN RADIO DE 10KM
    $.ajax({

        url: CapsURL,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            /**********************************************/
            var infowindow = new google.maps.InfoWindow();
            for(var i=0;i<response.length; i++) {

                if(response[i].Latitud != "0" || response[i].Longitud != "0")
                {
                    if ((DistanciaKM(myLat, myLong, response[i].Latitud, response[i].Longitud)) <= 10)
                    {
                        var pos = {
                                    lat: response[i].Latitud,
                                    lng: response[i].Longitud
                        };

                         var marker = new google.maps.Marker({
                            position: pos,
                            icon: 'images/caps.png',
                            title: response[i].Nombre,
                            map:map,
                            animation: google.maps.Animation.DROP
                        });

                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent(response[i].Nombre + "<br><br>" + '<a style="color:blue; font-weight: bold; text-align: center;" onclick="javascript:setCapsId('+response[i].ID+',\'capsDetail.html\');" href="#">Detalles</a>' );
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                    }
                }
            }


            $("#googleMapt").html("<p style='font-weight: bold; color:#fff'>Centros de Salud  cercanos en un radio de 10 KM aproximados.</p>");
            /**********************************************/
        },
        error: function (error) {
            //alert(ErrorAjax);
            window.plugins.toast.show(ErrorAjax,"3000","bottom");
        }
    });
}

//FUNCION QUE DEVOLVERA UN MENSAJE DE ERROR EN CASO DE NO RESPONDER O NO TENER PERMISOS EN GPS
function errorGPS(err) {
    //alert("Disculpe, no pudimos obtener sus datos de ubicación.");
    window.plugins.toast.show("Disculpe, no pudimos obtener sus datos de ubicación.","3000","bottom");
};

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

    //console.log(letrasEnElTitulo)

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

                if(response[i].Zona !== titleFlag ){
                    titleFlag = response[i].Zona;

                    htmlTitle = '<div class="content-block-title blancaynegritag">Zona '+titleFlag+'</div>';

                }else{
                    htmlTitle = '';
                }

                var htmlString = htmlTitle+'<li class="item-content"> <div class="icon f7-icons" style="color:#fff; margin-right: 5px;">search_strong</div><div class="item-inner" onclick="javascript:setDptoId('+response[i].ID+',\'caps.html\')"><div class="item-title titluloListaBlanca">'+ response[i].Nombre + '</div></div></li>';
                $("#dptos-container").append(htmlString);
            }
        },
        error: function (error) {
            //alert(ErrorAjax);
            window.plugins.toast.show(ErrorAjax,"3000","bottom");
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
            //console.dir(response);
        },
        error: function (error) {
            //alert(ErrorAjax);
            window.plugins.toast.show(ErrorAjax,"3000","bottom");
        }

    });
}

//FUNCION PARA OBTENER UN CENTRO DE SALUD
function getCentroDeSalud(id)
{
    var capsNombre = "";
    $.ajax({

        url: CapsURL + "/" + id,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {
            //console.dir(response);
            $("#caps-tittle").html(response.Nombre);
            $("#caps-basic").append(' <p><div class="icon f7-icons">home</div>' + "  " +response.Direccion + '</p>');
            $("#caps-basic").append('<p><div class="icon f7-icons">phone</div>' + "  " +response.Telefono + "</p>");
            if(response.URLImagenDelCentroDeSalud != "No Disponible") {
                $("#capsImg").append('<img src="' + response.URLImagenDelCentroDeSalud + '" height="250px">');
            }

            capsNombre = response.Nombre;


            if(response.Latitud != 0 || response.Longitud != 0) {
                var pos = {lat: response.Latitud, lng: response.Longitud};
                var mapProp = {
                    center: new google.maps.LatLng(pos),
                    zoom: 15,

                };
                var map = new google.maps.Map(document.getElementById("googleMapDetail"), mapProp);
                var marker = new google.maps.Marker({position: pos});
                var infowindow = new google.maps.InfoWindow({
                    content: response.Nombre
                });
                infowindow.open(map, marker);
                marker.setMap(map);

                var directionsDisplay = new google.maps.DirectionsRenderer();
                var directionsService = new google.maps.DirectionsService();

                var posActual = {lat: myLat, lng: myLong};
                var request = {
                    origin: posActual,
                    destination: pos,
                    travelMode: google.maps.DirectionsTravelMode['DRIVING'],
                    unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
                    provideRouteAlternatives: true
                };

                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setMap(map);
                        //directionsDisplay.setPanel($("#panel_ruta").get(0));
                        directionsDisplay.setDirections(response);
                        //alert(response.routes[0].legs[0].distance.value / 1000 + " KM");
                        $("#Distancia").html("<p>Segun tu ubicación te encuentras a: "+ (response.routes[0].legs[0].distance.value / 1000).toFixed() + " KM aproximados." + "</p>");
                    } else {
                        $("#Distancia").html("No existen rutas disponibles entre su ubicación actual y " + capsNombre +".");
                    }
                });
            }
            else {
                $("#googleMapDetail").html('<p><div class="icon f7-icons">close</div>  No hay datos de geolocalización disponibles.</p>');

            }
        },
        error: function (error) {
            //alert(ErrorAjax);
            window.plugins.toast.show(ErrorAjax,"3000","bottom");
        }

    });
}

//FUNCION QUE DEVUELVE LA LISTA DE CENTROS DE SALUD EN UN DEPTO SELECCIONADO
function getCentroDeSaludxDpto(id)
{
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

                    $("#caps-container").append('<li class="item-content"> <div class="icon f7-icons" style="color:#fff;margin-right: 5px;">info</div> <div class="item-inner" onclick="javascript:setCapsId('+response[i].ID+',\'capsDetail.html\')"><div class="item-title titluloListaBlanca">'+ response[i].Nombre +'</div></div></li>')
                }
            }
            //console.dir(tmp);
        },
        error: function (error) {
            //alert(ErrorAjax);
            window.plugins.toast.show(ErrorAjax,"3000","bottom");
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
            $("#caps-eyh").append('<h4 class="color-h3 ">Especialidades y Horarios:</h4>');

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

                        htmlStringEsp += '<div class="accordion-item-content"><div class="content-block"><p>'+response[i].Horarios[j].Dia+': ' + response[i].Horarios[j].HorarioEntrada + '--' + response[i].Horarios[j].HorarioSalida + '</p></div></div>'

                    }

                    htmlStringEsp += '</li>';
                }

                htmlStringEsp += '</ul>';


                $("#caps-eyh").append(htmlStringEsp);
            }
            else
            {
                $("#caps-eyh").append('<p><div class="icon f7-icons">close</div>  Sin información para mostrar.</p>');
            }
        },
        error: function (error) {
            //alert(ErrorAjax);
            window.plugins.toast.show(ErrorAjax,"3000","bottom");
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
            //console.dir(response);
            $("#caps-basic").append('<h3 class="color-h3">Líneas de Colectivo disponibles</h3><div id="caps-lc"></div> ');
            if(response.length !=0) {
                for (var i = 0; i < response.length; i++) {

                    $("#caps-basic").append('<p><div class="icon f7-icons">navigation</div>  Línea número ' + response[i].Numero + "</p>");
                }
            }
            else{

                $("#caps-lc").append('<p><div class="icon f7-icons">close</div>  Sin información para mostrar.</p>');
            }

        },
        error: function (error) {

            //alert(ErrorAjax);
            window.plugins.toast.show(ErrorAjax,"3000","bottom");

        }

    });
}

