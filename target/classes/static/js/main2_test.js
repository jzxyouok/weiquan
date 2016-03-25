/**
 * Created by Administrator on 2016/1/11.
 */

var map,opLayer;
//预报预警
var drawLine = {
    "id":32,
    "name":"",
    "X":139.470083,
    "Y":13.943192,
    endPt:[{"id":1,"name":"船1预警信息","text":"距离台风眼还有300海里","X":122.178,"Y": 30.48791},
        {"id":2,"name":"船2预警信息","text":"距离台风眼还有520海里","X":122.178,"Y":31.48791},
        {"id":3,"name":"船3预警信息","text":"距离台风眼还有460海里","X":122.278,"Y":32.48791},
        {"id":4,"name":"船4预警信息","text":"距离台风眼还有380海里","X":122.378,"Y":32.78791}/*,
         {"id":5,"name":"成都","X":104.035508,"Y":30.714179},
         {"id":6,"name":"重庆","X":106.519115,"Y":29.478925},
         {"id":7,"name":"贵阳","X":106.668071,"Y":26.457312},
         {"id":8,"name":"昆明","X":102.726775,"Y":24.969385},
         {"id":9,"name":"银川","X":106.167225,"Y":38.598524},
         {"id":10,"name":"西安","X":108.967128,"Y":34.276112},
         {"id":11,"name":"南宁","X":108.233931,"Y":22.748296},
         {"id":12,"name":"海口","X":110.346181,"Y":19.96992},
         {"id":13,"name":"广州","X":113.226683,"Y":23.18307},
         {"id":14,"name":"长沙","X":112.947928,"Y":28.169916},
         {"id":15,"name":"南昌","X":115.893715,"Y":28.652363},
         {"id":16,"name":"福州","X":119.246768,"Y":26.070765},
         {"id":17,"name":"台北","X":121.503567,"Y":25.008274},
         {"id":18,"name":"杭州","X":120.183046,"Y":30.330584},
         {"id":19,"name":"上海","X":121.449707,"Y":31.253361},
         {"id":20,"name":"武汉","X":114.216597,"Y":30.579253},
         {"id":21,"name":"合肥","X":117.262302,"Y":31.838353},
         {"id":22,"name":"南京","X":118.805692,"Y":32.085022},
         {"id":23,"name":"郑州","X":113.6511,"Y":34.746308},
         {"id":24,"name":"济南","X":117.048331,"Y":36.60841},
         {"id":25,"name":"石家","X":114.478215,"Y":38.033276},
         {"id":26,"name":"太原","X":112.483066,"Y":37.798404},
         {"id":27,"name":"呼和浩特","X":111.842806,"Y":40.895751},
         {"id":28,"name":"天津","X":117.351094,"Y":38.925719},
         {"id":29,"name":"沈阳","X":123.296299,"Y":41.801604},
         {"id":30,"name":"长春","X":125.26142,"Y":43.981984},
         {"id":31,"name":"哈尔","X":126.567138,"Y":45.69381},
         {"id":33,"name":"香港","X":114.093117,"Y":22.427852},
         {"id":34,"name":"澳门","X":113.552482,"Y":22.184495}*/
    ]
};
var path = [
    {"id":1,  "x":127.49357,  "y":34.883323, "radius":0},
    {"id":2,  "x":127.9872,   "y":32.350326, "radius":0},
    {"id":3,  "x":125.545833, "y":29.79259,  "radius":0},
    {"id":4,  "x":123.508521, "y":28.274465, "radius":0},
    {"id":5,  "x":124.551524, "y":27.151942, "radius":0},
    {"id":6,  "x":128.67448,  "y":26.30474,  "radius":0},
    {"id":7,  "x":129.491804, "y":26.264706, "radius":0},
    {"id":8,  "x":132.495929 ,"y":27.07025,  "radius":0},
    {"id":9,  "x":138.093644,  "y":28.784154, "radius":0},
    {"id":10, "x":132.545122,  "y":24.951701, "radius":0},
    {"id":11, "x":133.309324,  "y":23.32037,  "radius":0},
    {"id":12, "x":134.411982,  "y":21.777678, "radius":0},
    {"id":13, "x":135.224212,  "y":20.395442, "radius":0},
    {"id":14, "x":136.630326, "y":19.013206, "radius":0},
    {"id":15, "x":137.171328, "y":17.058946, "radius":0},
    {"id":16, "x":138.454919, "y":15.907586, "radius":0},
    {"id":17, "x":138.053446, "y":16.965449, "radius":0},
    {"id":18, "x":139.019257, "y":18.194103, "radius":0},
    {"id":19, "x":139.535467, "y":16.871059, "radius":0},
    {"id":20, "x":139.470083, "y":13.943192, "radius":200000}];
var  clickLayer,sr,pictureLayer;
var index = 0,t=0;
require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/GraphicsLayer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleLineSymbol", //简单线符号
        "dojo/_base/Color",
        "esri/geometry/Circle",
        "dojo/on",
        "dojo/dom",
        "dojo/domReady!"],
    function(Map,
             ArcGISDynamicMapServiceLayer,
             GraphicsLayer,
             PictureMarkerSymbol,
             SimpleLineSymbol,
             Color,
             Circle,
             on,
             dom
        ) {
        map = new Map("mapDiv",{logo:false});
        /* var tiled = new Tiled("http://localhost:6080/arcgis/rest/services/image/MapServer",{"id":"tiled"});
         map.addLayer(tiled, 0);*/
        var Layer = new ArcGISDynamicMapServiceLayer("http://xxs.dhybzx.org:6082/arcgis/rest/services/OILBaseMap/MapServer",{
            "id": "Layer",
            "opacity": 0.9,
            "zoom":5
        });
        map.addLayer(Layer);
        sr = map.spatialReference;
        clickLayer = new GraphicsLayer({"id":"clickLayer"});
        map.addLayer(clickLayer);
        var popupLayer = new GraphicsLayer({"id":"popupLayer"});
        map.addLayer(popupLayer,2);
        pictureLayer = new GraphicsLayer({"id":"pictureLayer"});
        map.addLayer(pictureLayer,3);
        /* map.on("load",function(){
         addReadPopup(drawLine);
         });*/
        //addReadPopup(drawLine);
        function addReadPopup(data){
            console.log("addreadpopup");
            var pms = new PictureMarkerSymbol('/img/typhoon.jpg', 30, 30);
            var pt = new esri.geometry.Point(data.X,data.Y,sr);
            var graphic = new esri.Graphic(pt, pms,data);
            popupLayer.add(graphic);
        };
       // pictureLayer.on("click",popupLayerClick);
     //   pictureLayer.on("mouse-over",popupLayerOver);
      //  pictureLayer.on("mouse-out",popupLayerOut);
        function popupLayerClick(evt){
            //clickLayer.clear();
           // map.graphics.clear();
            var graphic = evt.graphic;
            console.log("evt.graphic",graphic);
            map.infoWindow.setTitle("台风信息");
            map.infoWindow.setContent("台风");
            map.infoWindow.show(graphic.geometry);

           // var endPts = graphic.attributes.endPt;
           // var lines = new Array();
            //for(var i= 0;i<endPts.length;i++){
              //  var endPt = endPts[i];
                var pms = new PictureMarkerSymbol('/img/boat1.png', 30, 30);
                var pt=new esri.geometry.Point(120.37873783419734 ,31.26844426655507,sr);
                var ptGraphic = new esri.Graphic(pt, pms);
                popupLayer.add(ptGraphic);
             //   lines.push([graphic.attributes.X,graphic.attributes.Y],[endPt.X,endPt.Y]);
            //}
            var lineJson={
                "paths":[lines],
                "spatialReference":{"wkid":4326}
            };
            var line = new esri.geometry.Polyline(lineJson);
            var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 255, 0]),
                2
            );
            var lineGraphic = new esri.Graphic(line, sls );
            clickLayer.add(lineGraphic);
            map.setExtent(line.getExtent().expand(1));
        }
        function popupLayerOver(e){
            map.setMapCursor("pointer");
            console.log(e.graphic.attributes);
            var scrPt = map.toScreen(e.graphic.geometry);
            var textDiv = dojo.doc.createElement("div");
            dojo.attr(textDiv,{
                "id":"text"
            });
            dojo.style(textDiv, {
                "left": scrPt.x+10 + "px",
                "top": scrPt.y+10 + "px",
                "position": "absolute",
                "z-index":99,
                "background":"#fcffd1",
                "font-size":"10px",
                "border":"1px solid #0096ff",
                "padding": "0.1em 0.3em 0.1em",
                "font-size": "11px",
                "border-radius": "3px",
                "box-shadow": "0 0 0.75em #777777"
            });
            textDiv.innerHTML =e.graphic.attributes.name+"台风信息";
            dojo.byId("mapDiv").appendChild(textDiv);
        };
        function popupLayerOut(e){
            map.setMapCursor("default");
            dojo.byId("mapDiv").removeChild(dojo.byId("text"));
        };

       /* on(dom.byId("data5"), "click", function(){
            if($("#data5").is(":checked")){
            console.log(path);
            addPath();
            console.log(index);
            }else{
                index=0;
                console.log("clear is over");
                clickLayer.clear();
                pictureLayer.clear();
            }
            addReadPopup(drawLine);
        });*/
        map.on("load",function(){
            if($("#data5").is(":checked")){
                console.log(path);
                addPath();
                console.log(index);
            }else{
                index=0;
                console.log("clear is over");
                clickLayer.clear();
                pictureLayer.clear();
            }
        })
    });
    function addPath(){
        console.log(123);
        require([
                "esri/geometry/Circle",
                "esri/symbols/PictureMarkerSymbol"
            ], function(Circle,PictureMarkerSymbol){
                console.log(index);
                var sms =  new esri.symbol.SimpleMarkerSymbol({
                    "color": [255,255,0,255],
                    "size": 8,
                    "angle": -30,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSCircle",
                    "outline": {
                        "color": [255,0,0,255],
                        "width": 1,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    }
                });
                var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([255, 0, 0]),
                    2
                );
                var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                        new esri.Color([0,0,255,0.2]), 2),new esri.Color([0,0,255,0.2])
                );
                var ptStart = new esri.geometry.Point(path[index].x, path[index].y, sr);
                var ptEnd   = new esri.geometry.Point(path[index+1].x, path[index+1].y, sr);
                var gPtStart = new esri.Graphic(
                    ptStart,
                    sms
                );
                var gCircleStart = new esri.Graphic(
                    new Circle(ptStart, {"radius":200000}),
                    sfs
                );
                var gPtEnd = new esri.Graphic(
                    ptEnd,
                    sms
                );
                var gCircleEnd = new esri.Graphic(
                    new Circle(ptEnd, {"radius":200000}),
                    sfs
                );
                //画pictureLayer 和风圈
                var pms = new PictureMarkerSymbol('/img/typhoon.jpg', 30, 30);
                var graphic = new esri.Graphic(ptStart,pms);
                var graphic2 = new esri.Graphic(ptEnd,pms);
                var polylineJson = {
                    "paths":[[[path[index].x,path[index].y], [path[index+1].x,path[index+1].y]]],
                    "spatialReference":{"wkid":4326}
                };
                var gLine = new esri.Graphic(
                    new esri.geometry.Polyline(polylineJson),
                    sls
                );
                clickLayer.add(gLine);
                if(index<path.length-1){
                 //clickLayer.add(gCircleEnd);
                //map.centerAndZoom(ptStart);
                    pictureLayer.clear();
                    pictureLayer.add(graphic);
                    pictureLayer.add(gCircleStart);
                    clickLayer.add(gPtEnd);
                 }
                if(index === 0)
                {
                // clickLayer.add(gCircleStart);
                // map.centerAndZoom(ptStart);
                    pictureLayer.add(gCircleStart);
                    pictureLayer.add(graphic);
                    clickLayer.add(gPtStart);
                }
                if(index===18){
                   // map.centerAndZoom(ptEnd);
                    pictureLayer.clear();
                    pictureLayer.add(graphic2);
                    pictureLayer.add(gCircleEnd);
                }
                if(index<path.length-2){
                    t = setTimeout('addPath()',100);
                    index++;
                }
                else{
                    clearInterval(t);
                }
            });
    }

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

                    var geometryService = new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");

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
   /* map = new Map("mapDiv", {
    });
    //数据源1
    var Layer = new ArcGISDynamicMapServiceLayer("http://xxs.dhybzx.org:6082/arcgis/rest/services/OILBaseMap/MapServer",{
        "id": "Layer",
        "opacity": 0.9
    });*/

  /*  var Layer1 = new ArcGISDynamicMapServiceLayer("http://128.1.1.12:6080/arcgis/rest/services/OceanArea/MapServer",{
        "id": "Layer1",
        "opacity": 0.9
    });
    //添加动态图层到底图上
    map.addLayers([Layer1]);*/
   // map.addLayer(Layer);

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
        // addPictureLayer();
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
          var infoTemplate = new InfoTemplate("航行预警","航速: 20km/h<br>航向: 东南<br>大风预警：距离3级大风还有100海里，预计当前船速3分钟内到达风圈<br>" +
              "大浪预警：距离3级大浪还有200海里，预警当前航速5分钟到达浪圈<br>" +
              "台风预警：距离台风风眼还有400海里");
          var pictureGraphic = new Graphic(pt, symMarker, null, infoTemplate);
          map.graphics.add(pictureGraphic);

          // Setup popup
          setPopup(map, "top", 0, -35);

          if (map.infoWindow.isShowing) {
            map.infoWindow.show(pt);
          }
          var graphic = new Graphic(pt,symSimple);
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
$("input[type='checkbox']").click(function(){
    if($("#data1").prop("checked")){
        $("#data2").attr("disabled","disabled");
        console.log("checked1");
        // $("#data2").attr("disabled","disabled");
        require([ "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/TimeExtent", "esri/dijit/TimeSlider",
            "dojo/_base/array", "dojo/dom", "dojo/domReady!"],function(Map, ArcGISDynamicMapServiceLayer, TimeExtent, TimeSlider, arrayUtils, dom){
            //数据源1
            opLayer = new ArcGISDynamicMapServiceLayer("http://101.231.140.173:6084/arcgis/rest/services/WAVE/MapServer", {
                "id": "opLayer",
                "opacity": 0.9
            });
            map.addLayers([opLayer]);
           /* for(var i=0;i<=4;i++){
                map.setZoom(i);
                console.log(map.getZoom());
            }*/
            map.on("layers-add-result", initSlider);
            function initSlider() {

                var layInfo = opLayer.layerInfos.length - 7;
                opLayer.setVisibleLayers([layInfo]);//数据源数据类别
                //添加动态图层到底图上

                var timeSlider = new TimeSlider({
                    style: "width: 100%;"
                }, dom.byId("timeSliderDiv"));

                self.map.setTimeSlider(timeSlider);

                var timeExtent = new TimeExtent();
                var startDay = new Date("12/27/2015");
                var endDay = new Date("12/30/2015");
                timeExtent.startTime = startDay;
                timeExtent.endTime = endDay;

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
                        if (i % 24 === 0) {
                            timeStr = timeStop.getDate() + "日";
                        }
                        else timeStr = timeStop.getHours() + "时";
                        return timeStr;
                    } else {
                        return "";
                    }
                });

                timeSlider.setLabels(labels);
                var input = opLayer.layerInfos;
                var loopIII = opLayer.layerInfos.length - 7;
                //图层随着进度条改变而改变
                timeSlider.on("time-extent-change", function (evt) {

                    var endValString = evt.endTime.getFullYear() + "年" + evt.endTime.getMonth() + "月" + evt.endTime.getDate() + "日" + evt.endTime.getHours() + "时";
                    dom.byId("daterange").innerHTML = "<i>" + " of " + endValString + "<\/i>";

                    var minoTime = evt.endTime - evt.startTime;//进度条时间差
                    var minosBar = minoTime / 3600000;//123表示进度条第几个bar
                    var loopI = loopIII - minosBar * 7;

                    var visible = new Array();
                    visible.push(input[loopI].id);
                    opLayer.setVisibleLayers(visible);
                    console.log(loopIII);//总层数
                    console.log(loopI);//当前层 360 0000*1*7+483=490     360 0000*2*7+476=490
                });
            }
        });
        //  $("#data3").attr("disabled","disabled");
    }else{
       // $("#data2").attr("disabled","disabled");
        $("#data2").attr("disabled",false);
        require(["esri/map"],function(Map){
            map.removeLayer(opLayer);
        });
        //   $("#data3").removeAttr("disabled");
    }
    if($("#data2").prop("checked")){
        $("#data1").attr("disabled","disabled");
        console.log("checked2");
        // $("#data1").attr("disabled","disabled");
        // alert("载入大浪数据");
        //   $("#data3").attr("disabled","disabled");
        require([
            "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/TimeExtent", "esri/dijit/TimeSlider",
            "dojo/_base/array", "dojo/dom", "dojo/domReady!"
        ], function (Map, ArcGISDynamicMapServiceLayer, TimeExtent, TimeSlider, arrayUtils, dom) {

            //数据源1
             opLayer = new ArcGISDynamicMapServiceLayer("http://202.121.66.51:808/arcgis/rest/services/WaveDown/MapServer", {
                "id": "opLayer",
                "opacity": 0.9
            });
            /*var opLayer1 = new ArcGISDynamicMapServiceLayer("http://128.1.1.12:6080/arcgis/rest/services/WaveDown/MapServer",{
             "id": "opLayer1",
             "opacity": 0.9
             });*/
            console.log("add oplayer");
            map.addLayers([opLayer]);
          /*  for(var i=0;i<=4;i++){
                map.setZoom(i);
                console.log(map.getZoom());
            }*/
            map.on("layers-add-result", initSlider);
            function initSlider() {

                var layInfo = opLayer.layerInfos.length - 7;
                opLayer.setVisibleLayers([layInfo]);//数据源数据类别
                //添加动态图层到底图上

                var timeSlider = new TimeSlider({
                    style: "width: 100%;"
                }, dom.byId("timeSliderDiv"));

                self.map.setTimeSlider(timeSlider);

                var timeExtent = new TimeExtent();
                var startDay = new Date("12/27/2015");
                var endDay = new Date("12/30/2015");
                timeExtent.startTime = startDay;
                timeExtent.endTime = endDay;

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
                        if (i % 24 === 0) {
                            timeStr = timeStop.getDate() + "日";
                        }
                        else timeStr = timeStop.getHours() + "时";
                        return timeStr;
                    } else {
                        return "";
                    }
                });

                timeSlider.setLabels(labels);
                var input = opLayer.layerInfos;
                var loopIII = opLayer.layerInfos.length - 5;
                //图层随着进度条改变而改变
                timeSlider.on("time-extent-change", function (evt) {

                    var endValString = evt.endTime.getFullYear() + "年" + evt.endTime.getMonth() + "月" + evt.endTime.getDate() + "日" + evt.endTime.getHours() + "时";
                    dom.byId("daterange").innerHTML = "<i>" + " of " + endValString + "<\/i>";

                    var minoTime = evt.endTime - evt.startTime;//进度条时间差
                    var minosBar = minoTime / 3600000;//123表示进度条第几个bar
                    var loopI = loopIII - minosBar * 5;

                    var visible = new Array();
                    visible.push(input[loopI].id);
                    opLayer.setVisibleLayers(visible);
                    console.log(loopIII);//总层数
                    console.log(loopI);//当前层 360 0000*1*7+483=490     360 0000*2*7+476=490
                });
            }
        });
    }else{
        $("#data1").attr("disabled",false);
    }
   /* if($("#data3").is(":checked")){
        console.log("checked3");
        $("#data1").attr("disabled","disabled");
        $("#data2").attr("disabled","disabled");
        $(".infoTable").toggle();
        console.log($("#data3").is(':checked'))
    }else if($("#data3").attr('checked',false)){
        console.log("unchecked");
        $(".infoTable").css('display','none');
    }*/
});

/*$("#data2").click(function(){
    console.log("test checkbox");
    if($("#data2").is(":checked")){

    }else{
        console.log("remove mapgis")
    }
});*/
//风场的数据




