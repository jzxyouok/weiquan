/**
 * Created by Administrator on 2016/1/11.
 */
var map;
//航迹draw-tool,航线规划
   require(["esri/map",
        "esri/toolbars/draw",
        "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "dijit/registry","dojo/parser",
        "dojo/dom",
        "dojo/_base/lang",
        "dojo/json",
        "esri/config",
        "esri/geometry/Geometry",
        "esri/geometry/Extent",
        "esri/SpatialReference",
        "esri/tasks/GeometryService",
        "esri/tasks/DistanceParameters",
        "esri/symbols/TextSymbol",
         "esri/Color",
         "esri/symbols/Font",
         "esri/geometry/Point",
         "dojo/on"],function (Map,Draw,Graphic,SimpleMarkerSymbol,
           SimpleLineSymbol, SimpleFillSymbol,registry,parser,
           dom, lang, json, esriConfig,Geometry, Extent, SpatialReference, 
           GeometryService, DistanceParameters,TextSymbol,
           Color,Font,esriPoint,on) {
                    var totalDistance = 0, inputPoints = [], legDistance = [], enableMeasureLength = false, tb;
                      getpath();
                    function getpath() {
                        tb = new Draw(map);
                        tb.on("draw-end", lang.hitch(map, drawPolyline));
                        on(dom.byId("polyline"), "click", function () {
                        enableMeasureLength=true;
                        tb.activate(Draw.POLYLINE);
                        });
                        on(dom.byId("stop"), "click", function () {
                        enableMeasureLength=false;
                        tb.deactivate();
                        });
                        on(dom.byId("clear"), "click", function () {
                        enableMeasureLength=true;
                        map.graphics.clear();
                        });
                    };

                    map.on("click", mapClickHandler);

                    var geometryService = new GeometryService("http://128.1.1.12:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");

                    function drawPolyline(evtObj) {
                        var geometry = evtObj.geometry;
                        var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2);
                        var graphic = new Graphic(geometry, symbol);
                        map.graphics.clear();
                        map.graphics.add(graphic);
                        //控制风向、航向、浪高的显示
                        //document.getElementById("info").style.visibility="";
                        try {
                            getLabelPoints(geometry);
                            console.log(123)
                           
                        } catch (err) {
                            console.info("测距错误:", err);
                        } finally {
                            totalDistance = 0;
                            inputPoints = [];
                            legDistance = [];
                        }
                    }
                    //地图鼠标点击响应
                    function mapClickHandler(evtObj) {
                        if (!enableMeasureLength) {
                            return;
                        }
                        var point = new esriPoint(evtObj.mapPoint.x, evtObj.mapPoint.y, map.spatialReference);
                        inputPoints.push(point);
                        if (inputPoints.length >= 2) {
                            var distParams = new DistanceParameters();
                            distParams.distanceUnit = GeometryService.UNIT_METER;
                            distParams.geometry1 = inputPoints[inputPoints.length - 2];
                            distParams.geometry2 = inputPoints[inputPoints.length - 1];
                            distParams.geodesic = true;
                            geometryService.distance(distParams, function (distance) {
                                if (!isNaN(distance)) {
                                    legDistance.push(distance);
                                    totalDistance += distance;
                                }
                            });
                        }
                    }
                    function getLabelPoints(geometries) {
                        if (!geometries.paths) {
                            return;
                        }
                        var paths = geometries.paths[0];
                        var pathsLength = paths.length;
                        if (pathsLength >= 2) {
                            var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
                            var pointQD = new esriPoint(paths[0][0], paths[0][1]);
                            var pointZD = new esriPoint(paths[pathsLength - 1][0], paths[pathsLength - 1][1]);
                            var textSymbolQD = new TextSymbol(
                                    "起点",
                                    font, new Color([0, 0, 0]));
                            var textSymbolZD = new TextSymbol(
                                    "总长:" + (totalDistance / 1000).toFixed(2) + "," + "千米 ",
                                    font, new Color([0, 0, 0]));
                            var labelPointGraphicQD = new Graphic(pointQD, textSymbolQD);
                            var labelPointGraphicZD = new Graphic(pointZD, textSymbolZD);
                            map.graphics.add(labelPointGraphicQD);
                            map.graphics.add(labelPointGraphicZD);
                            for (var i = 1; i < pathsLength - 1; i++) {
                                var point = new esriPoint(paths[i][0], paths[i][1]);
                                var legTemp = 0;
                                for (var m = 0; m <= i - 1; m++) {
                                    legTemp += legDistance[m];
                                }
                                var textSymbol = new TextSymbol(
                                        (legTemp / 1000).toFixed(2) + "," + "千米 ",
                                        font, new Color([0, 0, 0]));
                                textSymbol.setAngle(15);
                                //textSymbol.setOffset(10, 10);
                                textSymbol.setDecoration("justify");

                                var labelPointGraphic = new Graphic(point, textSymbol);
                                map.graphics.add(labelPointGraphic);
                            }
                        }
                    }

                });
//加载图层和船体
require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/dijit/Popup",
    "esri/InfoTemplate", 
    "dojo/dom"
    ], function (  Map,  ArcGISDynamicMapServiceLayer,PictureMarkerSymbol,Graphic,Point,Popup,InfoTemplate,dom ) {
    map = new Map("mapDiv", {
    });
    //数据源1
    var Layer = new ArcGISDynamicMapServiceLayer("http://128.1.1.12:6080/arcgis/rest/services/BaseMap/MapServer",{
        "id": "Layer",
        "opacity": 0.9
    });

  /*  var Layer1 = new ArcGISDynamicMapServiceLayer("http://128.1.1.12:6080/arcgis/rest/services/OceanArea/MapServer",{
        "id": "Layer1",
        "opacity": 0.9
    });
    //添加动态图层到底图上
    map.addLayers([Layer1]);*/
    map.addLayers([Layer]);
   /* for(var i=0;i<=3;i++){
       map.setZoom(0);
       console.log(i);
       var zoom = map.getZoom();
        console.log(zoom);
    };*/
    //PictureMarkerSymbol
    var popup = map.infoWindow;
    popup.highlight = false;
    popup.titleInBody = false;
    popup.domNode.className += " light";

     //map.on("click", addGraphics);
     map.on("load", function() {
          var evt = {};
          evt.mapPoint = map.extent.getCenter();
         //增加船体图片
          addGraphics(evt);
         //增加浮标点
         addPictureLayer();
        });
    function addPictureLayer(){
        var pointers =new kendo.data.dataSource({
           transport:{
               read:{
                   dataType: "json",
                   url:"/api/config/getFileList/"+picId+"/"+picName,
                   async:false
               }
           }
        });
    }
    function addGraphics(evt){
          // Get a point to place the marker
          var pt = evt.mapPoint;
          if (!pt) {
            pt = map.graphics.graphics[0].geometry;
          }
          // Clear graphics
          map.graphics.clear();

          // Create marker (picture) symbol
          symMarker = createPictureSymbol('/img/boat1.png', 0, 12, 30, 40);
          var infoTemplate = new InfoTemplate("航向/航速",pt.x + " " + pt.y);
          var pictureGraphic = new Graphic(pt, symMarker, null, infoTemplate);
          map.graphics.add(pictureGraphic);

          // Setup popup
          setPopup(map, "top", 0, -35);

          if (map.infoWindow.isShowing) {
            map.infoWindow.show(pt);
          }

          var graphic = new Graphic(pt, symSimple);
          map.graphics.add(graphic);
    };
    function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
          return new PictureMarkerSymbol(
          {
            "angle": 0,
            "xoffset": xOffset, "yoffset": yOffset, "type": "esriPMS",
            "url": url,  
            "contentType": "image/png",
            "width":xWidth, "height": yHeight
          });
        }
      function setPopup(map,anchorPos,xOffset,yOffset) {
          var popup  = map.infoWindow;
          popup.highlight = false;
          popup.set("anchor", anchorPos);
          popup.domNode.style.marginLeft = xOffset+"px";
          popup.domNode.style.marginTop = yOffset+"px";
        }   
});
//加载航线数据
     require(["esri/map",
      "esri/graphic",
      "esri/layers/FeatureLayer",
      "esri/InfoTemplate",
      "esri/graphicsUtils",
      "esri/Color",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/request",
      "esri/geometry/Point",
      "esri/geometry/Multipoint",
      "esri/geometry/Polyline",
      "esri/geometry/Polygon",
      "dojo/keys",
      "dojo/on",
      "dojo/dom",
      "esri/symbols/PictureMarkerSymbol",
      "dojo/domReady!"],
      function (Map, Graphic, FeatureLayer, InfoTemplate, graphicsUtils, Color, SimplePointSymbol, SimpleLineSymbol, SimpleFillSymbol, esriRequest, Point, MulitPoint, Polyline, Polygon, keys, on, dom,PictureMarkerSymbol) {

        // GeoJSON layer
        var featureLayer,
            simplePointSym = new SimplePointSymbol(),
            simpleLineSym = new SimpleLineSymbol("solid", new Color([255, 50, 50, 1]), 2),
            simplePolygonSym = new SimpleFillSymbol("solid", simpleLineSym, new Color([255, 0, 50, 2]));

        // Set popup
        var popup = map.infoWindow;
        popup.highlight = false;
        popup.titleInBody = false;
        //popup.domNode.style.marginTop = "-5px";
        popup.domNode.className += "light";

        // Wire UI events
        on(dom.byId("btnAddUsa"), "click", getGeoJSON);

        // Get the GeoJSON to add - file or endpoint will work
        function getGeoJSON(e) {
          var requestHandle,
                filePath = e.target.dataset.path;
            // xhr request to get data 
            requestHandle = esriRequest({
                url: filePath,
                handleAs: "json"
            });
            requestHandle.then(addGeoJSONLayer, errorLoadingGeoJSON);
        }

        // GeoJSON to ArcGIS geometry type
        function getEsriGeometryType(geometryGeoJson) {
          var type;
          switch (geometryGeoJson) {
            case "Point":
              type = "esriGeometryPoint";
              break;
            case "MultiPoint":
              type = "esriGeometryMultipoint";
              break;
            case "LineString":
              type = "esriGeometryPolyline";
              break;
            case "Polygon":
              type = "esriGeometryPolygon";
              break;
            case "MultiPolygon":
              type = "esriGeometryPolygon";
              break;
          }
          return type;
        }

        function getEsriSymbol(geometryType) {
          var sym;
          switch (geometryType) {
            case "esriGeometryPoint":
              sym = simplePointSym;
              break;
            case "esriGeometryMultipoint":
              sym = simplePointSym;
              break;
            case "esriGeometryPolyline":
              sym = simpleLineSym;
              break;
            case "esriGeometryPolygon":
              sym = simplePolygonSym;
              break;
            case "esriGeometryPolygon":
              sym = simplePolygonSym;
              break;
          }
          return sym;
        }

        function createFeatureCollection(geometryType) {
          // TODO - need to pull definition from GeoJSON attributes!
          var layerDefinition = {
            "geometryType": geometryType,
            "objectIdField": "ObjectID",
            "fields": [{
                "name": "ObjectID",
                "alias": "ObjectID",
                "type": "esriFieldTypeOID"
              }, {
                "name": "type",
                "alias": "Type",
                "type": "esriFieldTypeString"
              }]
          }; 
          var featureCollection = {
            layerDefinition: layerDefinition,
            featureSet: {
              features: [],
              geometryType: geometryType
            }
          };
          return featureCollection;
        }

        function createFeature(arcgis, sym) {
          var shape = new Graphic(arcgis).setSymbol(sym);
          // Do other things with shape...  
          return shape;
        }

        // Use Terraformer to convert geojson to arcgis json
        function createFeatureSet(geojson, geometryType){
          var featureSet = [];
          // convert the geojson object to a arcgis json representation
          var primitive = new Terraformer.FeatureCollection(geojson);
          var arcgis = Terraformer.ArcGIS.convert(primitive);
          // NOTE: Assumes same geojson geometry type for entire file!
          var sym = getEsriSymbol(geometryType);
          for (var i = 0; i < arcgis.length; i++){
            featureSet.push(createFeature(arcgis[i], sym));
          }
          return featureSet;
        }

        // Create a feature layer for the GeoJSON
        function addGeoJSONLayer(geojson) {
          if (!geojson.features.length) {
            return;
          }
          removeGeoJSONLayer();
          // Get geometry type - assume same geometry for entire file!
          var esriGeometryType = getEsriGeometryType(geojson.features[0].geometry.type);
          // Create an skeleton collection and popup definition
          var featureCollection = createFeatureCollection(esriGeometryType);
          var infoTemplate = new InfoTemplate("GeoJSON Data", "${*}");
          // Create feature layer   
          featureLayer = new FeatureLayer(featureCollection, {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"], 
            infoTemplate: infoTemplate
          });
          // Add it to the map
          map.addLayer(featureLayer);
          // Add graphics to the featurelayer
          var featureSet = createFeatureSet(geojson, esriGeometryType);
          featureLayer.applyEdits(featureSet, null, null);
        }
        // Remove existing layer
        function removeGeoJSONLayer() {
          if (featureLayer) {
            map.removeLayer(featureLayer);
            map.infoWindow.hide();
          }
        }

        // Error
        function errorLoadingGeoJSON(e) {
            console.log("Error loading GeoJSON. " + e);
        }
    });
//timeSlider
require([
        "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/TimeExtent", "esri/dijit/TimeSlider",
        "dojo/_base/array", "dojo/dom", "dojo/domReady!"
    ], function (Map, ArcGISDynamicMapServiceLayer,
                 TimeExtent, TimeSlider,
                 arrayUtils, dom) {

        //数据源1
        var opLayer = new ArcGISDynamicMapServiceLayer("http://128.1.1.12:6080/arcgis/rest/services/WaveUp/MapServer",{
          "id": "opLayer",
           "opacity": 0.9
        });
        /*var opLayer1 = new ArcGISDynamicMapServiceLayer("http://128.1.1.12:6080/arcgis/rest/services/WaveDown/MapServer",{
            "id": "opLayer1",
            "opacity": 0.9
        });*/
        map.addLayers([opLayer]);
        for(var i=0;i<=4;i++){
           map.setZoom(i);
           console.log(map.getZoom());
        }
        map.on("layers-add-result", initSlider);
        function initSlider() {

            var layInfo=opLayer.layerInfos.length-7;
            opLayer.setVisibleLayers([layInfo]);//数据源数据类别
            //添加动态图层到底图上

            var timeSlider = new TimeSlider({
                style: "width: 100%;"
            }, dom.byId("timeSliderDiv"));

            self.map.setTimeSlider(timeSlider);

            var timeExtent = new TimeExtent();
            var startDay=new Date("12/27/2015");
            var endDay=new Date("12/30/2015");
            timeExtent.startTime = startDay;
            timeExtent.endTime =endDay;

            timeSlider.setThumbCount(1);
            timeSlider.createTimeStopsByTimeInterval(timeExtent, 1, "esriTimeUnitsHours");
            timeSlider.setThumbIndexes([0, 1]);
            timeSlider.setThumbMovingRate(2000);
            timeSlider.startup();

            timeSlider.setLoop(true);


            //add labels for every other time stop
            var labels = arrayUtils.map(timeSlider.timeStops, function (timeStop, i) {
                if (i % 6 === 0) {
                    var timeStr;
                    if(i % 24 ===0){
                        timeStr=timeStop.getDate()+"日";
                    }
                    else timeStr=timeStop.getHours()+"时";
                    return timeStr;
                } else {
                    return "";
                }
            });

            timeSlider.setLabels(labels);
            var input = opLayer.layerInfos;
            var loopIII=opLayer.layerInfos.length-7;
            //图层随着进度条改变而改变
            timeSlider.on("time-extent-change", function (evt) {

                var endValString = evt.endTime.getFullYear()+"年"+ evt.endTime.getMonth()+"月"+ evt.endTime.getDate()+"日"+evt.endTime.getHours()+"时";
                dom.byId("daterange").innerHTML = "<i>" + " of " + endValString + "<\/i>";

                var minoTime=evt.endTime-evt.startTime;//进度条时间差
                var minosBar=minoTime/3600000;//123表示进度条第几个bar
                var loopI=loopIII-minosBar*7;

                var visible=new Array();
                visible.push(input[loopI].id);
                opLayer.setVisibleLayers(visible);
                console.log(loopIII);//总层数
                console.log(loopI);//当前层 360 0000*1*7+483=490     360 0000*2*7+476=490
            });

        }
    });
var flag =false;
function changeView(){
    var cha =document.getElementById("mapDiv");
    if(flag){
        cha.className="map";
        flag=false;
    }else{
        cha.className="map1";
        flag=true;
    }
}
