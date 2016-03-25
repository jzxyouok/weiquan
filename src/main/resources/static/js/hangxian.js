$(function() {
    // Get start/end times
    var startTime = new Date(demoTracks[0].properties.time[0]);
    var endTime = new Date(demoTracks[0].properties.time[demoTracks[0].properties.time.length - 1]);

    // Create a DataSet with data
   // var timelineData = new vis.DataSet([{ start: startTime, end: endTime, content: '航线时间' }]);

    // Set timeline options
    var timelineOptions = {
        "width":  "100%",
        "height": "120px",
        "style": "box",
        "axisOnTop": true,
        "showCustomTime":true
    };

    // Setup timeline
   // var timeline = new vis.Timeline(document.getElementById('timeline'), timelineData, timelineOptions);

    // Set custom time marker (blue)
    //timeline.setCustomTime(startTime);

    // Setup leaflet map
   var map = new L.map('mapDiv');
  //  L.esri.basemapLayer('Topographic').addTo(map);
    map.setView([30.782, 121.5593], 5);
  //var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');
  // L.esri.basemapLayer('http://xxs.dhybzx.org:6082/arcgis/rest/services/OILBaseMap/MapServer').addTo(map);
    // Center map and default zoom level

   // map.setView([31.1, 122.793], 8);
    // Adds the background layer to the map
  //   map.addLayer(basemapLayer);
   /* L.esri.dynamicMapLayer({
        url: "http://xxs.dhybzx.org:6082/arcgis/rest/services/OILBaseMap/MapServer"
        //url:"http://101.231.140.173:6084/arcgis/rest/services/WIND/MapServer"
    }).addTo(map);*/

   /* L.esri.dynamicMapLayer({
        url: "http://101.231.140.173:6084/arcgis/rest/services/WIND/MapServer/0"
    }).setLayers().addTo(map);*/
    /*L.esri.dynamicMapLayer({
        url: 'http://101.231.140.173:6084/arcgis/rest/services/WIND/MapServer'
    }).addTo(map);*/
    // =====================================================
    // =============== Playback ============================
    // =====================================================

    // Playback options
    var playbackOptions = {
        playControl: true,
        dateControl: true,
        // layer and marker options
        layer : {
            pointToLayer : function(featureData, latlng) {
                var result = {};

                if (featureData && featureData.properties && featureData.properties.path_options) {
                    result = featureData.properties.path_options;
                }

                if (!result.radius){
                    result.radius = 5;
                }
                return new L.CircleMarker(latlng, result);
            }
        },

        marker: {
            getPopup: function(featureData) {
                var result = '';
                if (featureData && featureData.properties && featureData.properties.title) {
                    result = featureData.properties.title;
                }
                return result;
            }
        }
    };

    // Initialize playback
    var playback = new L.Playback(map, null, null, playbackOptions);
    playback.setData(demoTracks);
    playback.addData(blueMountain);
    // Uncomment to test data reset;
    //playback.setData(blueMountain);
    // Set timeline time change event, so cursor is set after moving custom time (blue)
    //timeline.on('timechange', onCustomTimeChange);

    // A callback so timeline is set after changing playback time
    /*function onPlaybackTimeChange (ms) {
        timeline.setCustomTime(new Date(ms));
    };*/
    //
    function onCustomTimeChange(properties) {
        if (!playback.isPlaying()) {
            playback.setCursor(properties.time.getTime());
        }
    };
    var pointA = new L.LatLng(30.12, 120.893);
    var pointB = new L.LatLng( 30.92, 120.793);
    var pointC = new L.LatLng(31.2, 121.693);
    var pointD = new L.LatLng( 30.982, 121.5593);
    var pointD1 = new L.LatLng( 30.782, 121.5593);
    var pointList = [pointA,pointB,pointC,pointD,pointD1];
    var firstpolyline = new L.Polyline(pointList, {
        color: 'blue',
        weight: 3,
        smoothFactor: 1
    });
    firstpolyline.addTo(map);

    var greenIcon = L.icon({
        iconUrl: '/img/boa1.png',
        iconSize:     [60, 122], // size of the icon
        iconAnchor:   [26, 94], // point of the icon which will correspond to marker's location
        shadowSize:   [60, 122],
        shadowAnchor: [22, 94],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    L.marker([30.782, 121.5593],{icon:greenIcon}).addTo(map);

    var service = L.esri.mapService('http://101.231.140.173:6084/arcgis/rest/services/WIND/MapServer');
    service.identify()
        .on(map)
        .at([30.782, 121.5593])
        .layers("visible:503")
        .run(function(error, featureCollection, response){
            console.log("UTC Offset: " + featureCollection.features[0].properties.ZONE);
        });
});