var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude        + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');
};

myApp.onPageInit('departamentos', function (page) {
    getDepartamento();
});


myApp.onPageInit('caps', function (page) {

    getCentroDeSaludxDpto(DptoID);
});

myApp.onPageInit('caps-detail', function (page) {

    getCentroDeSalud(CapsID);
    getCentroDeSaludEyH(CapsID);
    getCentroDeSaludLC(CapsID);

});

myApp.onPageInit('index', function (page) {

  load();

});


myApp.onPageInit('mapa', function (page) {

    console.log("mapa");
    var pos = {lat: -31.536395, lng: -68.536976};
    var mapProp= {
        //-31.536395, -68.536976
        center:new google.maps.LatLng(pos),
        zoom:10,
        styles: [
            {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "lightness": -5
                    },
                    {
                        "color": "#b0b0b0"
                    },
                    {
                        "weight": 1.7
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#940f12"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#FFB3B3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#FFB3B3"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#FFB3B3"
                    },
                    {
                        "lightness": 66
                    }
                ]
            }
        ]

    };
    var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    var marker = new google.maps.Marker({position: pos});
    var infowindow = new google.maps.InfoWindow({
        content: "San Juan - Argentina"
    });
    infowindow.open(map,marker);
    marker.setMap(map);

    navigator.geolocation.getCurrentPosition(onSuccess,
        null,
        null);

});



function load()
{
    getSlider();

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
