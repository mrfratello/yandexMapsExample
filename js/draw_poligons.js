var YaMapsHandler = {
    DEBUG: true,
    map: null,
    fromPoligons: [],
    toPoligons: [],

    initMap: function() {
        YaMapsHandler.map = new ymaps.Map("yandex_map", {
            center: [55.76, 37.64],
            zoom: 10,
            controls: [
                'fullscreenControl', 'zoomControl'
            ]
        });
        YaMapsHandler.initControls();
        if (YaMapsHandler.DEBUG) {
            YaMapsHandler.initDebugControls();
            YaMapsHandler.point1 = YaMapsHandler.addDebugBaloon(55.81, 37.50, '#ff0000');
            YaMapsHandler.point2 = YaMapsHandler.addDebugBaloon(55.81, 37, '#0000ff');
        }
    },

    initDebugControls: function() {
        var addExistPoligonButton = new ymaps.control.Button({
            data: {
                content: "Добавить тестовый полигон"
            },
            options: {
                position: {
                    bottom: 20,
                    right: 20,
                },
                maxWidth: 200,
                selectOnClick: false
            }
        });
        addExistPoligonButton.events.add('click', function() {
            YaMapsHandler.addDebugPoligon();
        });
        YaMapsHandler.map.controls.add(addExistPoligonButton);
    },

    addDebugPoligon: function() {
        var debugPolygon = new ymaps.Polygon([
            [
                [55.813393088613516,37.43881286621094],
                [55.663862393817844,37.484131469726535],
                [55.62036749912347,37.66952575683592],
                [55.709634916485385,37.7890020751953],
                [55.852810327447074,37.71484436035154],
                [55.88138204110359,37.54867614746093],
                [55.813393088613516,37.43881286621094]
            ]
        ], {}, {
            fillColor: 'rgba(0,0,255,.5)',
            strokeColor: '#0000FF',
            strokeWidth: 1
        });
        YaMapsHandler.map.geoObjects.add(debugPolygon);
        YaMapsHandler.debugCheckContain(debugPolygon, [55.81, 37.5], 'red');
        YaMapsHandler.debugCheckContain(debugPolygon, [55.81, 37], 'blue');
        debugPolygon.editor.startEditing();
    },

    addDebugBaloon: function(x, y, color) {
        var myPlacemark = new ymaps.Placemark([x, y], {
            hintContent: "Хинт метки: " + x + ', ' + y
        },{
            iconColor: color
        });
        YaMapsHandler.map.geoObjects.add(myPlacemark);
        return myPlacemark;
    },

    debugCheckContain: function(poligon, coords, color){
        if ( poligon.geometry.contains(coords) ) {
            console.log(color + ' is target');
        } else {
            console.log(color + ' is miss');
        }
    },

    initControls: function() {
        var addFromZoneButton = new ymaps.control.Button({
            data: {
                content: "Добавить зону \"Откуда\""
            },
            options: {
                float: 'right',
                maxWidth: 200,
                selectOnClick: false
            }
        });
        addFromZoneButton.events.add('click', function() {
            YaMapsHandler.addPoligonFrom();
        });

        var addToZoneButton = new ymaps.control.Button({
            data: {
                content: "Добавить зону \"Куда\""
            },
            options: {
                float: 'right',
                maxWidth: 200,
                selectOnClick: false
            }
        });
        addToZoneButton.events.add('click', function() {
            YaMapsHandler.addPoligonTo();
        });

        var savePoligonsButton = new ymaps.control.Button({
            data: {
                content: "Сохранить"
            },
            options: {
                float: 'left',
                maxWidth: 200,
                selectOnClick: false
            }
        });
        savePoligonsButton.events.add('click', function() {
            for (var i = 0; i < YaMapsHandler.fromPoligons.length; i++) {
                var poligon = YaMapsHandler.fromPoligons[i];
                console.log( poligon );
                console.log( JSON.stringify(poligon.geometry.getCoordinates()) );
            }
        });

        YaMapsHandler.map.controls.add(addFromZoneButton);
        YaMapsHandler.map.controls.add(addToZoneButton);
        YaMapsHandler.map.controls.add(savePoligonsButton);
    },

    addPoligonFrom: function() {
        var fromPolygon = new ymaps.Polygon([], {}, {
            editorDrawingCursor: "crosshair",
            fillColor: 'rgba(256,0,0,.5)',
            strokeColor: '#0000FF',
            strokeWidth: 1
        });
        YaMapsHandler.fromPoligons.push(fromPolygon);
        YaMapsHandler.map.geoObjects.add(fromPolygon);
        fromPolygon.editor.startDrawing();
    },

    addPoligonTo: function() {
        var myPolygon = new ymaps.Polygon([], {}, {
            editorDrawingCursor: "crosshair",
            fillColor: 'rgba(0,102,0,.5)',
            strokeColor: '#0000FF',
            strokeWidth: 1
        });
        YaMapsHandler.map.geoObjects.add(myPolygon);
        myPolygon.editor.startDrawing();
    }
};
ymaps.ready( YaMapsHandler.initMap );
