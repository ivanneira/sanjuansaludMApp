
var Apiurl = "http://10.64.65.200/AresApi/Api";
var portalUrl = "http://sanjuan.gov.ar/gen/gobierno/app/noticias/salud/c/index.json";

function getSlider()
{
    $.ajax({

        url: portalUrl,
        cache: false,
        type: 'get',
        dataType: "json",
        success: function (response) {

            console.dir(response);
        },
        error: function (error) {
            console.log("Error: " + error)
        }

    })
}