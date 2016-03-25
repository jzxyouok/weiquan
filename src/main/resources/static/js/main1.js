var map;
require([
    "dojo/dom-construct",
    "esri/map",
    "esri/dijit/Popup",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/Color",
    "esri/dijit/Geocoder",

    "esri/InfoTemplate",
    "esri/dijit/Search",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol", "dojo/domReady!"
], function(
    domConstruct,Map,Popup,Tile,
    Color, Geocoder, InfoTemplate,Search,
    ArcGISDynamicMapServiceLayer, SimpleFillSymbol, SimpleLineSymbol
    ) {
   var sls = new SimpleLineSymbol("solid", new Color("#444444"), 3);
   var sfs = new SimpleFillSymbol("solid", sls, new Color([68, 68, 68, 0.25]));
    //center: [114.31,30.52], // long, lat
    var tile = new Tile("http://202.121.66.51:6688/arcgis/rest/services/南极全图tiles2/MapServer");
    var  map = new Map("ui-esri-map", {
        basemap:"topo",
        center:[-94.75290067627297, 39.034671990514816],
        zoom: 10,
        sliderStyle: "small",
        infoWindow: popup
    });

    var popup = new Popup({
        fillSymbol: sfs,
        lineSymbol: null,
        markerSymbol: null
    }, domConstruct.create("div"));
    var search = new Search({
        map: map
    }, "search");

   // map.addLayer(tile);
    var _countyCensusInfoTemplate = new InfoTemplate();
    _countyCensusInfoTemplate.setTitle("<b>布格重力信息</b>");

    var _blockGroupInfoTemplate = new InfoTemplate();
    _blockGroupInfoTemplate.setTitle("<b>数据信息</b>");

    var _censusInfoContent =
        "<div class=\"demographicInfoContent\">" +
        "<div class='demographicNumericPadding'>${AGE_5_17:formatNumber}</div><div class=\"demographicInnerSpacing\"></div>people ages 5 - 17<br>" +
        "<div class='demographicNumericPadding'>${AGE_40_49:formatNumber}</div><div class=\"demographicInnerSpacing\"></div>people ages 40 - 49<br>" +
        "<div class='demographicNumericPadding'>${AGE_65_UP:formatNumber}</div><div class=\"demographicInnerSpacing\"></div>people ages 65 and older" +
        "</div>";

    _countyCensusInfoTemplate.setContent("Demographics for:<br>${NAME} ${STATE_NAME:getCounty}, ${STATE_NAME}<br>" + _censusInfoContent);
    _blockGroupInfoTemplate.setContent("Demographics for:<br>Tract: ${TRACT:formatNumber} Blockgroup: ${BLKGRP}<br>" + _censusInfoContent);

    var _oilAndGasInfoTemplate = new InfoTemplate();
    _oilAndGasInfoTemplate.setTitle("<b>加载数据</b>");

    var _oilAndGasInfoContent =
        "<div class=\"demographicInfoContent\">" +
        "Gas production: ${PROD_GAS}<br>Oil production: ${PROD_OIL:formatNumber}" +
        "</div>";

    _oilAndGasInfoTemplate.setContent("${FIELD_NAME} production field<br>" +
        _oilAndGasInfoContent);

    var demographicsLayerURL = "http://10.200.21.32:6080/arcgis/rest/services/XU_New_南极底图/MapServer";
    var demographicsLayerOptions = {
        "id": "demographicsLayer",
        "opacity": 0.8,
        "showAttribution": false
    };
    var demographicsLayer = new ArcGISDynamicMapServiceLayer(demographicsLayerURL, demographicsLayerOptions);
    demographicsLayer.setInfoTemplates({
        1: { infoTemplate: _blockGroupInfoTemplate },
        2: { infoTemplate: _countyCensusInfoTemplate }
    });
    demographicsLayer.setVisibleLayers([1, 2]);
    map.addLayer(demographicsLayer);

    var oilAndGasLayer = new ArcGISDynamicMapServiceLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Petroleum/KGS_OilGasFields_Kansas/MapServer", {
        "id": "oilAndGasLayer",
        "opacity": 0.75
    });
    oilAndGasLayer.setInfoTemplates({
        0: { infoTemplate: _oilAndGasInfoTemplate }
    });
    map.addLayer(oilAndGasLayer);
});
var formatNumber = function(value, key, data) {
    var searchText = "" + value;
    var formattedString = searchText.replace(/(\d)(?=(\d\d\d)+(?!\d))/gm, "$1,");
    return formattedString;
};
var getCounty = function(value, key, data) {
    if (value.toUpperCase() !== "LOUISIANA") {
        return "County";
    } else {
        return "Parish";
    }
};
