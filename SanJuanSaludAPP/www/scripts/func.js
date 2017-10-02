var server = "gedoc.sanjuan.gov.ar";
var ErrorAjax = "Ups! Hubo un problema con su conexión a internet.";
var NoticiasURL = "http://"+server+"/AresApi/Api/Portal/Noticias";
var DepartamentosURL = "http://"+server+"/AresApi/Api/Departamento";
var CapsURL = "http://"+server+"/AresApi/Api/CentroDeSalud";
var proturURL = "http://"+ server + "/AresApi/Api/Protur/Solicitud";
var csListURL = "http://"+ server + "/AresApi/Api/CentroDeSalud";
//var proturURL = "http://10.64.64.218:1941/api/Protur/Solicitud";
var comentarioURL = "http://"+ server + "/AresApi/Api/Contacto";
var DptoID = 0;
var CapsID = 0;
var sinConexion = 'El conenido online no esta disponible momentaneamente.';
var myLat = -31.536395;
var myLong = -68.536976;

//-31.536395, -68.536976
//PARAMETROS DE CONFIGURACION PARA EL GPS
var optionsGPS = {
    enableHighAccuracy: true,
    timeout: 150000,
    maximumAge: 0
};

//FUNCION QUE DEVOLVERA LA POSICION ACTUAL DEL GPS
function successGPS(pos) {
    var crd = pos.coords;
    myLat = crd.latitude;
    myLong = crd.longitude;

}


function csBuscarList()
{

    $.ajax({

        url: CapsURL,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            console.dir(response);
            for(i=0;i<response.length;i++)
            {
                var tmp = '<li class="item-content" data-id="'+ response[i].ID +'">'+
                            '<div class="item-inner">'+
                                '<div style="width: 100%;" id="item-title_cs"+i class="item-title"><b>'+response[i].Nombre+
                                '</b> <div class="chip">' +
                                '<div  class="chip-label"><u> Teléfono:</u> '+
                                    response[i].Telefono +
                                '</div>' +
                                '</div>' +
                                '<div  ><u>Dirección:</u> '+ response[i].Direccion+'</div>'+
                        '</div>'+
                            '</div>'+
                           '</li>';

                $("#csDatalist").append(tmp);
            }

            $(".item-content").click(function(){
                setCapsId($(this).data('id'),'capsDetail.html');
            });
        },
        error: function (error) {

            window.plugins.toast.show(ErrorAjax,"3000","bottom");
        }

    });
}

//FUNCION QUE BUSCA CENTROS DE SALUD EN UN RADIO DE 10KM
function GPS()
{
    var posx = {lat: myLat, lng: myLong};
    var mapPropx= {
        center:new google.maps.LatLng(posx),
        zoom:11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
            {
                "featureType": "administrative.neighborhood",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    };
    var map=new google.maps.Map(document.getElementById("googleMap"),mapPropx);
    var icon = {
        url: "images/device.png", // url
        /*
        scaledSize: new google.maps.Size(35, 55), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
        */
    };

    var icon2 = {
        url: "images/caps.png", // url
        /*
        scaledSize: new google.maps.Size(35, 55), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
        */
    };
    var markerx = new google.maps.Marker({position: posx,icon: icon});
    var infowindowx = new google.maps.InfoWindow({
        content: "Estas aquí",
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
            var markers = [];

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
                            icon: icon2,
                            title: response[i].Nombre,
                            map: map,
                            animation: google.maps.Animation.DROP
                        });

                        markers.push(marker);



                        google.maps.event.addListener(marker, 'click', (function (marker, i) {

                            return function () {
                                infowindow.setContent(response[i].Nombre + "<br><br>" + '<a style="color:blue; font-weight: bold; text-align: center;" onclick="javascript:setCapsId('+response[i].ID+',\'capsDetail.html\');" href="#">Información Detallada</a>' );
                                infowindow.open(map, marker);

                            }
                        })(marker, i));


                    }
                }
            }
            var markerCluster = new MarkerClusterer(map, markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});


            google.maps.event.addListener(markerCluster, "mouseover", function (c) {
                $(c.clusterIcon_.div_).effect( 'bounce', { times: 3 }, 'slow');
            });

            $("#googleMapt").html("<p style='font-weight: bold;'>Centros de Salud  cercanos en un radio de 10 KM aproximados.</p>");
            /**********************************************/
        },
        error: function () {
            //alert(ErrorAjax);
            window.plugins.toast.show(ErrorAjax,"3000","bottom");
        }
    });
}

//FUNCION QUE DEVOLVERA UN MENSAJE DE ERROR EN CASO DE NO RESPONDER O NO TENER PERMISOS EN GPS
function errorGPS(err) {

    window.plugins.toast.show("Disculpe, no pudimos obtener sus datos de ubicación.","3000","bottom");
}

//FUNCION QUE DETECTA EL LLAMADO Y RESPUESTA DE AJAX PARA MOSTRAR UN PRELOADER
$(document).ajaxStart(function() {
    myApp.showPreloader('Por favor espere...');
}).ajaxComplete(function() {
    myApp.hidePreloader();
});

//FUNCION PARA CALCULAR DISTANCIA ENTREW DOS PUNTOS
function DistanciaKM(lat1,lon1,lat2,lon2)
{
    rad = function(x) {return x*Math.PI/180};
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
    var temp =
        '<div id="err1" class="swiper-slide" style="background: url(../images/error.svg) no-repeat center top;background-size:cover;">'+
            '<div class="overlay">'+
                '<p>'+sinConexion+'</p>'+
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


    var db = sqlitePlugin.openDatabase('mydb.db', '1.0', '', 1);
    db.transaction(function (txn) {
        txn.executeSql('SELECT 42 AS `answer`', [], function (tx, res) {
            alert(res.rows.item(0).answer); // {"answer": 42}

        });
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
        error: function () {
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
        var temp =
            '<div id="'+json[i].nid+'" class="swiper-slide" style="background: url(http://sanjuan.gov.ar/'+json[i].nf+') no-repeat center top;background-size:cover;">'+
                '<div class="overlay">'+
                    '<p>'+json[i].nt+ '</p>'+
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
    var titulo = slide.clickedSlide.innerText;
    var letrasEnElTitulo = titulo.length;
    $("#"+slide.clickedSlide.id).filter(function(){
        imagenURL = $(this).css("background-image");
    });

    var texto = $(slide.clickedSlide).find(".overlay div");

    var pageHTML =

                '<div class="page" data-page="noticia">'+

                    '<div class="navbar">'+
                        '<div class="navbar-inner navbarMenu">'+
                            '<div class="left">'+
                                '<a href="#" class="link back">'+
                                    '<i class="icon icon-back"></i>'+
                                    '<span>Volver</span>'+
                                '</a>'+
                            '</div>'+

                            '<div class="right"><p>Noticia</p></div>'+
                        '</div>'+

                    '</div>'+

                    '<div class="page-content">'+
                        '<div class="content-block">'+
                            '<br>'+
                            '<br>'+

                            '<div class="card">'+
                                '<div class="card-content">'+
                                    '<div class="card-content-inner">'+
                                        '<div id="cardImageBackground" class="card-header"></div>'+
                                    '</div>'+
                                '</div>'+

                                '<div id="noticia" class="background-light">'+ texto[0].innerHTML +'</div>'+
                            '</div>'+
                            '<br><br>'+
                        '</div>'+
                    '</div>'+
                '</div>';



    mainView.router.loadContent(pageHTML);

    $("#cardImageBackground").css({"background-image": imagenURL});
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
                    var romano = "";

                    switch (response[i].Zona) {

                        case 1:
                            romano = 'I';
                            break;
                        case 2:
                            romano = "II";
                            break;
                        case 3:
                            romano = "III";
                            break;
                        case 4:
                            romano = "IV";
                            break;
                        case 5:
                            romano = "V";
                            break;
                    }

                    htmlTitle = '<li class="list-group-title">'+ "Zona Sanitaria " + romano +'</li>';

                }else{
                    htmlTitle = '';
                }

                var htmlString =
                '<div class="list-group">'+
                    '<ul>'+
                         htmlTitle +
                        '<li class="item-content">'+
                            //'<div class="icon f7-icons" style="color:#fff; margin-right: 5px;">search</div>'+
                            '<div class="item-inner background-light" onclick="javascript:setDptoId('+response[i].ID+',\'caps.html\')">'+
                                '<div id="Dpto_' + response[i].ID + '" class="item-title">'+
                                response[i].Nombre +
                                '</div>' +
                            '</div>' +
                        '</li>' +
                    '</ul>'+
                '</div>';


                $("#dptos-container").append(htmlString);
            }
        },
        error: function () {

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

        },
        error: function (error) {

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

            $("#caps-tittle").html(response.Nombre);
            $("#caps-basic").append(
                '<p>' +
                    '<h4 class="color-h4">Dirección</h4>'+
                    response.Direccion +
                '</p>'+
                '<p>' +
                    '<h4 class="color-h4">Teléfonos</h4>' +
                    '<div class="icon f7-icons color-red">phone_fill</div>' + "  " +
                    response.Telefono +
                "</p>"
            );

            if(response.URLImagenDelCentroDeSalud != "No Disponible") {
                $("#capsImg").append('<img src="' + response.URLImagenDelCentroDeSalud + '" height="250px">');
            }

            capsNombre = response.Nombre;


            if(response.Latitud != 0 || response.Longitud != 0) {
                var pos = {lat: response.Latitud, lng: response.Longitud};
                var mapProp = {
                    center: new google.maps.LatLng(pos),
                    zoom: 15,
                    scrollwheel: true,
                    navigationControl: true,
                    scaleControl: true,
                    //draggable: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    disableDefaultUI: false,
                    styles: [
                        {
                            "featureType": "administrative.neighborhood",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.business",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        }
                    ]

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
                        directionsDisplay.setDirections(response);



                        $("#Distancia").html(


                            "<p>Segun tu ubicación te encuentras a: "+
                                (response.routes[0].legs[0].distance.value / 1000).toFixed() +
                                " KM aproximados." +
                            "</p>" +
                            "<a class='button button-fill button-raised boton-navigation' href='javascript:navigate(["+myLat+","+myLong+"],["+pos.lat+","+pos.lng+"]);' >" +
                                  'Indicaciones para llegar' +
                            "</a>");


                    } else {
                        $("#Distancia").html("No existen rutas disponibles entre su ubicación actual y " + capsNombre +".");
                    }
                });
            }
            else {
                $("#googleMapDetail").html('<p><div class="icon f7-icons">close</div>  No hay datos de geolocalización disponibles.</p>');

            }
        },
        error: function () {

            window.plugins.toast.show(ErrorAjax,"3000","bottom");
        }

    });
}

function navigate(desde,hasta)
{

    launchnavigator.navigate([hasta[0], hasta[1]], {
        start: ""+desde[0]+","+desde[1]+""
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

            $("#caps-container").append('<div class="list-group"><ul><li class="list-group-title">'+ $("#Dpto_" + id).text() +'</li></ul></div>');
            for(var i=0;i<response.length;i++) {
                if (response[i].DepartamentoID == id) {
                    tmp.push(response[i]);

                    $("#caps-container").append(


                        '<li class="item-content"> ' +
                            '<div class="item-inner background-light" onclick="javascript:setCapsId('+response[i].ID+',\'capsDetail.html\')">' +
                                '<div class="item-title">'+
                                    response[i].Nombre +
                                '</div>' +
                            '</div>' +
                        '</li>');
                }
            }

        },
        error: function () {

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


            $("#caps-eyh").append('<h3 class="color-h3 ">Especialidades y Horarios</h3>');

            response  = response.sort(keysrt('Nombre'));

            if(response.length !=0) {

                //inicio
                var htmlStringEsp = '<ul>';


                for (var i = 0; i < response.length; i++) {


                    //agrega título
                    htmlStringEsp += '<li class="accordion-item">'+
                        '<a href="#" class="item-content item-link">'+
                        '<div class="item-inner">'+
                        ' <div class="item-title">'+
                        response[i].Nombre +
                        '</div></div></a>';


                    var HorariosDia = [];
                    var Horarios = [];
                    var IndexDia = 0;
                    var IndexHorario = 0;
                    for(var j=0;j<response[i].Horarios.length;j++)
                    {
                        IndexHorario = HorariosDia.indexOf(response[i].Horarios[j].Dia);
                        if ( IndexHorario == -1){
                            HorariosDia[IndexDia] = response[i].Horarios[j].Dia;
                            Horarios[IndexDia] = response[i].Horarios[j].HorarioEntrada + ' hs. - ' + response[i].Horarios[j].HorarioSalida + ' hs.';
                            IndexDia = IndexDia + 1;
                        }
                        else{
                            Horarios[IndexHorario] += ' <br/> ' + response[i].Horarios[j].HorarioEntrada + ' hs. - ' + response[i].Horarios[j].HorarioSalida+ ' hs.';
                        }
                    }
                    for(var k=0;k<HorariosDia.length;k++){
                        htmlStringEsp += '<div class="accordion-item-content"><div class="content-block"><p>'+HorariosDia[k]+': <br/>' + Horarios[k] + '</p></div></div>';
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

            $("#caps-basic").append(
                '<h4 class="color-h4">Líneas de Colectivo disponibles</h4><div id="caps-lc"></div> ');



            if(response.length !=0) {
                for (var i = 0; i < response.length; i++) {

                    $("#caps-basic").append('<p><span class="icono-bus"> </span>  Línea número ' + response[i].Numero + "</p>");
                }
            }
            else{

                $("#caps-lc").append('<p><div class="icon f7-icons">close</div>  Sin información para mostrar.</p>');
            }

        },
        error: function (error) {

            window.plugins.toast.show(ErrorAjax,"3000","bottom");

        }

    });
}


$(document).on("click","input[type='text']", function() {

    $$('.page-content').scrollTop($(this).offset().top-20, 600);
    $(this).focus();
});

$(document).on("click","input[type='email']", function() {

    $$('.page-content').scrollTop($(this).offset().top-20, 600);
    $(this).focus();
});

$(document).on("click","textarea", function() {

    setTimeout(function(){
    $$('.page-content').scrollTop($(document).height(), 600);
},800);
    $(this).focus();
});


function ShareOnFB()
{
    navigator.app.loadUrl('https://www.facebook.com/sharer/sharer.php?u=www.salud.sanjuan.gob.ar', { openExternal:true } );
}

function ShareOnTW()
{
    navigator.app.loadUrl('https://twitter.com/home?status=www.salud.sanjuan.gob.ar', { openExternal:true } );
}