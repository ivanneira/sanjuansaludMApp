var map;
var ErrorAjax = "Ups! Hubo un problema con su conexión a internet.";
var NoticiasURL = "http://10.64.65.200/AresApi/Api/Portal/Noticias";
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

function maps() {

    var div = document.getElementById("map_canvas");

    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);
    //map = plugin.google.maps.Map.getMap(div);
    // Wait until the map is ready status.
    //map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
}


function onMapReady() {


        // Add a maker
        map.addMarker({
            position: {lat: 37.422359, lng: -122.084344},
            title: "Welecome to \n" +
            "Cordova GoogleMaps plugin for iOS and Android",
            snippet: "This plugin is awesome!",
            animation: plugin.google.maps.Animation.BOUNCE
        }, function (marker) {

            // Show the info window
            marker.showInfoWindow();

            // Catch the click event
            marker.on(plugin.google.maps.event.INFO_CLICK, function () {

                // To do something...
                alert("Hello world!");

            });

        });


}

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
            '</div>';
            '</div>'+
            '</div>';


        $(selector).append(temp);
    }

    $('.slide').slick({
    autoplay: 5000,
    slidesToShow: 1,
    adaptiveHeight: true,
    centerMode: false,
    centerPadding: '60px'

});

}
