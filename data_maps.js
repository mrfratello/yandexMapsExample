function getXmlHttp(){
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}



var YaMapsHandler = {
    map: null,

    carPlaceMarkers: [],

    initMap: function() {
        YaMapsHandler.map = new ymaps.Map("yandex_map", {
            center: [55.76, 37.64],
            zoom: 10
        });
        YaMapsHandler.requestCarData();
    },

    requestCarData: function() {
        var ajax = getXmlHttp();
        ajax.open('GET', '/data.json', true);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4) {
                if(ajax.status == 200) {
                    YaMapsHandler.successRequestCarData( JSON.parse( ajax.responseText ) );
                } else {
                    alert('Ошибка связи с сервером');
                }
            }
        };
        ajax.send(null);
    },

    successRequestCarData: function(responseCarData) {
        if ( responseCarData[0].errcode === 0 ) {
            YaMapsHandler.setupCarDataOnMap( responseCarData[0].data.arrCar );
        } else {
            alert( responseCarData[0].errmsg );
        }
    },

    setupCarDataOnMap: function(car_data) {
        for (var i = 0; i < car_data.length; i++) {
            var car = car_data[i],
                carCoordinateX = parseFloat( car.latitude ),
                carCoordinateY = parseFloat( car.longitude ),
                balloonContentBody,
                carPlaceMarker;
            balloonContentBody = "<img src='" + car.preview + "' alt='Изображение машины' />";
            balloonContentBody += "<div>" + car.name + "</div>";
            carPlaceMarker = new ymaps.Placemark([carCoordinateX, carCoordinateY], {
                hintContent: car.name,
                balloonContent: balloonContentBody
            });
            this.carPlaceMarkers.push(carPlaceMarker);
        }
        var clusterer = new ymaps.Clusterer();
        clusterer.add( this.carPlaceMarkers );
        this.map.geoObjects.add(clusterer);
    }
};

ymaps.ready( YaMapsHandler.initMap );
