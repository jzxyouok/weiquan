/**
 * Created by Administrator on 2016/1/11.
 */
var grandSlam = [{
    "year": "2003",
    "win": 13,
    "extremum": "MIN: 13",
    "loss": 3
},{
    "year": "2004",
    "win": 22,
    "loss": 1
},{
    "year": "2005",
    "win": 24,
    "loss": 2
},{
    "year": "2006",
    "win": 27,
    "extremum": "MAX: 27",
    "loss": 1
},{
    "year": "2007",
    "win": 26,
    "loss": 1
},{
    "year": "2008",
    "win": 24,
    "loss": 3
},{
    "year": "2009",
    "win": 26,
    "loss": 2
},{
    "year": "2010",
    "win": 20,
    "loss": 3
},{
    "year": "2011",
    "win": 20,
    "loss": 4
},{
    "year": "2012",
    "win": 19,
    "loss": 3
}];
//台风数据点
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
    {"id":20, "x":139.470083, "y":13.943192, "radius":0}];
var extents=[{"flag":1,
              "extent":[
                   {"XMin":119.18410731793},{"YMin": 29.24033413704},
                   {"XMax": 125.38410731793},{"YMax": 37.39033413704}
               ]},
              {
                "flag":2,
                  "extent":[
                      {"XMin":119.18410731793},{"YMin": 29.24033413704},
                      {"XMax": 125.38410731793},{"YMax": 37.39033413704}
                  ]
              },
                {
                    "flag":3,
                    "extent":[
                        {"XMin":120.17376709},{"YMin": 27},
                        {"XMax":122.00376709},{"YMax": 28.385}
                    ]
                },
                {
                    "flag":4,
                    "extent":[
                        {"XMin":116.6169548434617},{"YMin": 16.595026978301036},
                        {"XMax":129.85052710425353},{"YMax":41.00595907689315}
                    ]
                }
    ];
var  clickLayer,sr,pictureLayer;
var map,opLayer=null,loading,query,showLoad,open;
var index = 0,t= 0,flag=0;
require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/layers/GraphicsLayer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "dojo/_base/Color",
        "esri/geometry/Circle",
        "esri/graphic",
        "esri/geometry/Point",
        "esri/dijit/Popup",
        "esri/InfoTemplate",
        "esri/toolbars/draw",
        "dojo/_base/lang",
       "esri/symbols/Font", "esri/symbols/TextSymbol","esri/tasks/GeometryService", "esri/tasks/DistanceParameters",
        "esri/TimeExtent", "esri/dijit/TimeSlider",
        "dojo/_base/array","esri/geometry/geometryEngine", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleFillSymbol","esri/tasks/query",
        "dojo/dom-geometry","dojo/window","dojo/has",
        "dojo/on",
        "dojo/dom",
        "dojo/domReady!"],
    function(Map,
             ArcGISDynamicMapServiceLayer,
             FeatureLayer,
             GraphicsLayer,
             PictureMarkerSymbol,
             SimpleLineSymbol,
             Color,
             Circle,
             Graphic,Point,Popup,InfoTemplate,Draw,lang,Font,TextSymbol,GeometryService,DistanceParameters,
             TimeExtent, TimeSlider, arrayUtils,geometryEngine,SimpleMarkerSymbol,SimpleFillSymbol, Query,
             domGeom,win,has,
             on,dom
        ) {
        loading = dom.byId("loadingImg");
        map = new Map("mapDiv",{logo:false});//加载底图
        tb = new Draw(map);
        var Layer = new ArcGISDynamicMapServiceLayer("http://xxs.dhybzx.org:6082/arcgis/rest/services/OILBaseMap/MapServer",{
            "id": "Layer",
            "opacity": 0.9
        });
        //加载图层
        map.addLayer(Layer);
        sr = map.spatialReference;
        clickLayer = new GraphicsLayer({"id":"clickLayer"});
        map.addLayer(clickLayer);
        pictureLayer = new GraphicsLayer({"id":"pictureLayer"});
        map.addLayer(pictureLayer,2);
        //气泡变量初始化
        var popup = map.infoWindow;
        popup.highlight = false;
        popup.titleInBody = false;
        popup.domNode.className += " light";
        //定义点的填充和半径
        var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([0,255,0, 0.3]), 10),
            new Color([0,255,0,1]));
        var buffSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT,
                new Color([255,128,0,1]), 3),
            new Color([255,128,0,0.15]));
        //航线变量定义
        var totalDistance = 0, inputPoints = [], legDistance = [], enableMeasureLength = false;
        //量算服务
        var geometryService = new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");
       //地图初始化执行的方法
        var p = {};
        map.on("load",function(){
            //增加船体图片
            getshipmessage();
            //调用画点划线的方法，台风路径展示
            //  addPath();
        });
        function getshipmessage(){
            var url="/api/tbjhship/getAllMessages";
            $.ajax({
                type:"GET",
                url:url,
                success:function(data){
                    console.log("data is get success",data);
                    addGraphics(data);
                },
                error:function(data){
                    console.log(data);
                }
            });
        }

        //增加船体图片的方法
        function addGraphics(evt){
            var lat = evt[0].lat;
            var lon = evt[0].lon;
            p = new esri.geometry.Point(lon,lat,sr);
            console.log("p is",p);
            var  symMarker = createPictureSymbol('/img/boat1.png', 0, 12, 30, 40);
            var pictureGraphic = new Graphic(p, symMarker, null);
            map.graphics.add(pictureGraphic);
              map.infoWindow.resize(250,200);
              map.infoWindow.setTitle("海监船航行预警预报");
              map.infoWindow.setContent(
                      "坐标点 : " +lat.toFixed(2) + ", " + lon.toFixed(2) +
                      "<br>"+"航速: 20km/h<br>航向: 东南<br>大风预警：距离3级大风还有100海里，预计当前船速3分钟内到达风圈<br>" +
                      "大浪预警：距离3级大浪还有200海里，预警当前航速5分钟到达浪圈<br>" +
                      "台风预警：距离台风风眼还有400海里"
              );
             map.infoWindow.show(p,map.getInfoWindowAnchor(p));
            //注册点击的graphics事件
            dojo.connect(map.graphics, "onClick", function(){
                //显示船载观测数据窗体
                setShipObserve(true);
                $("#dataType").css("display","block");
                $("#shipobserve").css("display","block");
            });
            //鼠标经过船体事件
            /*      dojo.connect(map.graphics,"onMouseOver",function(evt){
             map.infoWindow.setTitle("设备类型:"+evt.mapPoint.x);
             map.infoWindow.setContent("ceshi");
             });*/
        };
        //pictureSymbol的创建方法
        function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
            return new PictureMarkerSymbol(
                {
                    "angle": 0,
                    "xoffset": xOffset, "yoffset": yOffset, "type": "esriPMS",
                    "url": url,
                    "contentType": "image/png",
                    "width":xWidth, "height": yHeight
                });
        };
        //气泡展示方法
        function setPopup(map,anchorPos,xOffset,yOffset) {
            var popup  = map.infoWindow;
            popup.highlight = false;
            popup.set("anchor", anchorPos);
            popup.domNode.style.marginLeft = xOffset+"px";
            popup.domNode.style.marginTop = yOffset+"px";
        };
        //单击获取map页面的点
        function getPoint(evt){
            console.log("evt  is",evt);
            //单击后获取当前点的坐标值
            var point = evt.mapPoint;
            console.log("point is",point);
            map.graphics.clear();
            getshipmessage();
            //添加一个graphic在当前点的位置上
            var ptGraphic = new Graphic(point, pointSymbol);
            map.graphics.add(ptGraphic);
            //添加一个半径当前点
            var buffer = geometryEngine.geodesicBuffer(point, 10, "miles");
            var bufferGraphic = new Graphic(buffer, buffSymbol);
            map.graphics.add(bufferGraphic);
            for(var i in extents){
                if(i == (flag-1) && flag==extents[i].flag){
                    //判断当前点是否是陆地
                    if(extents[i].extent[0].XMin<=point.x && point.x<=extents[i].extent[2].XMax
                        && extents[i].extent[1].YMin<=point.y&&point.y<=extents[i].extent[3].YMax){
                        console.log("flag is"+flag);
                        //弹窗数据展示
                        switch (flag){
                            case 1: setwindObserve(point);console.log("海面风数据加载成功，绘制图表");
                                break;
                            case 2: setShipObservedWin(point);console.log("海浪数据加载成功，绘制图表");break;
                            case 3: setflowObserver(point);console.log("海流数据加载成功，绘制图表");break;
                            case 4: setWaveVisibility(point);console.log("能见度数据加载成功，绘制图表");break;
                            default :
                                console.log("eeee");break;
                        }
                    }else{
                        //如果是陆地的话，气泡显示经纬度
                        console.log("point"+point.x+point.y);
                            var latitude = point.x;
                            var longitude = point.y;
                            var infotemplate = new InfoTemplate("该点坐标信息","lat/lon : " +latitude.toFixed(2) + ", " + longitude.toFixed(2));
                            var pictureSymbol =   new PictureMarkerSymbol('/img/typhoon.jpg', 30, 30);
                            var pictureGraphic = new Graphic(point, pictureSymbol, null,infotemplate);
                        //    map.graphics.add(pictureGraphic);
                    }
                }
            }
            //查询当前地图的数据信息
           // blockGroupsLyr.queryFeatures(queryParams, getStats, errback);
        };
        //图层清除
        function removedynamicLayer(op){
            if(flag===1||flag===2||flag===3||flag===4&&flag!=0){
                console.log("remove");
                map.removeLayer(op);
            };
        };
        //海平面数据展示
        function setwindObserve(evt){
            $("#winds").css("visibility","visible");

            var observed = $("#windObserved");//数据窗体
            if (!observed.data("kendoWindow")) {
                observed.kendoWindow({
                    width: "700px",
                    height:"300px",
                    actions: ["Custom", "Minimize", "Close"],
                    title: "海面风预报展示"
                });
            };
            //获取数据
            getObservedData(evt);
            observed.data("kendoWindow").open();//打开window
        };
        //海浪数据弹窗展示
        function setShipObservedWin(evt){
            $("#ship").css("visibility","visible");

            console.log("setshipObservedWin");
            var observed = $("#shipObserved");//数据窗体
            if (!observed.data("kendoWindow")) {
                observed.kendoWindow({
                    width: "700px",
                    height:"300px",
                    actions: ["Custom", "Minimize", "Close"],
                    title: "海浪预报展示"
                });
            };
            //获取船载观测数据
            getObservedData(evt);
            observed.data("kendoWindow").open();//打开window
        };
        //海流数据弹窗展示
        function setflowObserver(evt){
            $("#sflow").css("visibility","visible");

            var observed = $("#wflow");//数据窗体
            if (!observed.data("kendoWindow")) {
                observed.kendoWindow({
                    width: "700px",
                    height:"300px",
                    actions: ["Custom", "Minimize", "Close"],
                    title: "海流预报展示"
                });
            };
            //获取数据
            getObservedData(evt);
            observed.data("kendoWindow").open();//打开window
        };
        //能见度数据弹窗展示
        function  setWaveVisibility(evt){
            console.log("能见度");
            $("#visibile").css("visibility","visible");

            var observed = $("#Evisibled");//能见度数据窗体
            if (!observed.data("kendoWindow")) {
                observed.kendoWindow({
                    width: "700px",
                    height:"300px",
                    actions: ["Custom", "Minimize", "Close"],
                    title: "能见度预报展示"
                });
            };
            //获取船载观测数据
            getObservedData(evt);
            observed.data("kendoWindow").open();//打开window
        };
        //数据获取
        function getObservedData(evt){
            //海面风
            $("#chart1").kendoChart({
                title: {
                    text: "当前坐标("+evt.x.toFixed(2)+","+evt.y.toFixed(2)+")"
                },
                legend: {
                    position: "bottom"
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    type: "line",
                    style: "smooth"
                },
                series: [{
                    name: "3级以下",
                    data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                },{
                    name: "4级以下",
                    data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, -2.245, 4.339, 2.727]
                },{
                    name: "5级以下",
                    data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, -7.832, 4.3, 4.3]
                },{
                    name: "6级以下",
                    data: [-0.253, 0.362, -3.519, 1.799, 2.252, 3.343, 0.843, 2.877, -5.416, 5.590]
                }],
                valueAxis: {
                    labels: {
                        format: "{0}"
                    },
                    line: {
                        visible: false
                    },
                    axisCrossingValue: -10
                },
                categoryAxis: {
                    categories: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011],
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: "auto"
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    template: "#= series.name #: #= value #"
                }
            });
            //海浪
            $("#chart2").kendoChart({
                dataSource: {
                    transport: {
                        read: {
                            url: "/js/spain-electricity.json",
                            dataType: "json"
                        }
                    },
                    sort: {
                        field: "year",
                        dir: "asc"
                    }
                },
                title: {
                    text: "东海海域单点海浪预报曲线 \n "+"("+evt.x.toFixed(2)+","+evt.y.toFixed(2)+")"
                },
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                    field: "nuclear",
                    name: "最大高度"
                }, {
                    field: "hydro",
                    name: "有效高度"
                }, {
                    field: "wind",
                    name: "海浪数值曲线"
                }],
                categoryAxis: {
                    field: "year",
                    labels: {
                        rotation: -90
                    },
                    crosshair: {
                        visible: true
                    }
                },
                valueAxis: {
                    labels: {
                        format: "N0"
                    },
                    majorUnit: 10000
                },
                tooltip: {
                    visible: true,
                    shared: true,
                    format: "N0"
                }
            });
            //海流
            $("#chart3").kendoChart({
                title: {
                    text: "海流数据展示 \n"+"("+evt.x.toFixed(2)+","+evt.y.toFixed(2)+")"
                },
                legend: {
                    position: "bottom"
                },
                series: [{
                    type: "line",
                    data: [6, 10, 10, 10, 10, 9, 5, 5, 10, 8, 8, 5, 8, 11, 9, 15, 20, 23, 24, 21, 21, 20, 22, 22, 20, 18, 16, 15, 20, 13.2, 18],
                    name: "海流最大值",
                    color: "#ff1c1c",
                    axis: "temp"
                }, {
                    type: "line",
                    data: [-5, -6, 0, -4, -3, -5.2, -5, -1.7, -1, 0, -0.4, -2, -2, -5, 4, -2, -4, -1, -1, 2, 4, -1, 1, 1, 4, 0, -1, 1, -2, 5.7, 5],
                    name: "海流最小值",
                    color: "#ffae00",
                    axis: "temp"
                }, {
                    type: "area",
                    data: [16.4, 21.7, 35.4, 19, 10.9, 13.6, 10.9, 10.9, 10.9, 16.4, 16.4, 13.6, 13.6, 29.9, 27.1, 16.4, 13.6, 10.9, 16.4, 10.9, 24.5, 10.9, 8.1, 19, 21.7, 27.1, 24.5, 16.4, 27.1, 29.9, 27.1],
                    name: "海流流速",
                    color: "#73c100",
                    axis: "wind"
                }, {
                    type: "area",
                    data: [5.4, 2, 5.4, 3, 2, 1, 3.2, 7.4, 0, 8.2, 0, 1.8, 0.3, 0, 0, 2.3, 0, 3.7, 5.2, 6.5, 0, 7.1, 0, 4.7, 0, 1.8, 0, 0, 0, 1.5, 0.8],
                    name: "海流平均流速",
                    color: "#007eff",
                    axis: "rain"
                }],
                valueAxes: [{
                    name: "rain",
                    color: "#007eff",
                    min: 0,
                    max: 60
                }, {
                    name: "wind",
                    color: "#73c100",
                    min: 0,
                    max: 60
                }, {
                    name: "temp",
                    min: -30,
                    max: 30
                }],
                categoryAxis: {
                    categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
                    axisCrossingValues: [32, 32, 0],
                    justified: true
                },
                tooltip: {
                    visible: true,
                    format: "{0}",
                    template: "#= category #/03: #= value #"
                }
            });
            //能见度
            $("#chart4").kendoChart({
                dataSource: {
                    data: grandSlam
                },
                title:{
                    text:"能见度数据展示 \n"+"("+evt.x.toFixed(2)+","+evt.y.toFixed(2)+")"
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                    field: "win",
                    name: "能见度最大值",
                    noteTextField: "extremum",
                    notes: {
                        label: {
                            position: "outside"
                        },
                        position: "bottom"
                    }
                },{
                    field: "loss",
                    name: "能见度平均值"
                }],
                valueAxis: {
                    line: {
                        visible: true
                    }
                },
                categoryAxis: {
                    field: "year",
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                }
            });
        }
        //航线规划
        $("#line").click(function(){
            if($("#acewaring").hasClass('open')||$("#ace-settings-box").hasClass('open')){
                $("#acewaring").removeClass("open");
            };
                $("#widget").toggle();
                $("#polyline").kendoButton();
                $("#stop").kendoButton();
                $("#clear").kendoButton();
                //调用航线路径划线方法
                getpath();
            });
        //航线路径规划方法
        function  getpath() {
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
        function drawPolyline(evtObj) {
            console.log("evtobj"+evtObj);
            var geometry = evtObj.geometry;
            var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2);
            var graphic = new Graphic(geometry, symbol);
            map.graphics.clear();
            map.graphics.add(graphic);
            //控制风向、航向、浪高的显示
            $("#info").css("visibility","visible");
            try {
                getLabelPoints(geometry);
            } catch (err) {
                console.info("测距错误:", err);
            } finally {
                totalDistance = 0;
                inputPoints = [];
                legDistance = [];
            }
        };
        function getLabelPoints(geometries) {
            if (!geometries.paths) {
                return;
            }
            var paths = geometries.paths[0];
            var pathsLength = paths.length;
            if (pathsLength >= 2) {
                var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
                var pointQD = new esri.geometry.Point(paths[0][0], paths[0][1]);
                var pointZD = new esri.geometry.Point(paths[pathsLength - 1][0], paths[pathsLength - 1][1]);
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
                    var point = new esri.geometry.Point(paths[i][0], paths[i][1]);
                    var legTemp = 0;
                    for (var m = 0; m <= i - 1; m++) {
                        legTemp += legDistance[m];
                    }
                    var textSymbol = new TextSymbol(
                            (legTemp / 1000).toFixed(2) + "," + "千米 ",
                        font, new Color([0, 0, 0]));
                    textSymbol.setAngle(15);
                    textSymbol.setDecoration("justify");
                    var labelPointGraphic = new Graphic(point, textSymbol);
                    map.graphics.add(labelPointGraphic);
                }
            }
        };
        //地图鼠标点击响应
        map.on("click", mapClickHandler);
        function mapClickHandler(evtObj) {
            if (!enableMeasureLength) {
                return;
            }
            var point = new esri.geometry.Point(evtObj.mapPoint.x, evtObj.mapPoint.y, map.spatialReference);
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
        };
        //海面风数据加载
        $("#wind").click(function(){
            console.log("oplayer is"+opLayer);
            //设置loading展示，true为显示
            showLoad=true;open=true;
            //设置timeslider的播放title
            var title = "东海海域海面风时间序列"
            $("#timeInfo label").html(title);
             if(opLayer!=null){
                 removedynamicLayer(opLayer);
             };
            opLayer = new ArcGISDynamicMapServiceLayer("http://101.231.140.173:6084/arcgis/rest/services/WIND/MapServer");
            map.addLayers([opLayer]);

            map.on("layers-add-result",initSlider);
            map.on("update-start",showLoading);
            map.on("update-end",hideLoading);
            flag = 1;
            location();
            map.on("click",getPoint);
        });
        //海浪的数据加载
        $("#wave").click(function(){
            showLoad=true;
            var title = "东海海域海浪时间序列"
            $("#timeInfo label").html(title);
            if(opLayer!=null){
                removedynamicLayer(opLayer);
            };
            opLayer = new ArcGISDynamicMapServiceLayer("http://101.231.140.173:6084/arcgis/rest/services/WAVE/MapServer",{
                "id": "opLayer",
                "opacity": 0.9
            });
            map.addLayers([opLayer]);
            map.on("layers-add-result",initSlider);
            map.on("update-start",showLoading);
            map.on("update-end",hideLoading);
            flag=2;
            location();
            map.on("click",getPoint);
        });
        //海流数据加载
        $("#waveflow").click(function(){
            console.log("oplayer is"+opLayer);
            showLoad=true;
            var title = "东海海域海流时间序列"
            $("#timeInfo label").html(title);
            if(opLayer!=null){
                removedynamicLayer(opLayer);
            };
            opLayer = new ArcGISDynamicMapServiceLayer("http://xxs.dhybzx.org:6081/arcgis/rest/services/OFT/MapServer",{
                "id": "opLayer",
                "opacity": 0.9
            });
            map.addLayers([opLayer]);
            map.on("layers-add-result",initSlider);
            map.on("update-start",showLoading);
            map.on("update-end",hideLoading);
            flag = 3;
            location();
            map.on("click",getPoint);
        });
        //能见度数据加载
        $("#visibility").click(function(){
            showLoad=true;
            var title = "东海海域能见度时间序列"
            $("#timeInfo label").html(title);
            console.log("oplayer is"+opLayer);
            if(opLayer!=null){
                removedynamicLayer(opLayer);
            };
            opLayer = new ArcGISDynamicMapServiceLayer("http://202.121.66.51:808/arcgis/rest/services/WaveDown/MapServer",{
                "id": "opLayer",
                "opacity": 0.9
            });
            map.addLayers([opLayer]);
            map.on("layers-add-result",initSlider);
            map.on("update-start",showLoading);
            map.on("update-end",hideLoading);
            flag=4;location();
            map.on("click",getPoint);
        });
        //loading 效果
        function showLoading(){
            console.log("showload",showLoad);
           if(showLoad){
               $("#loadingImg").css("display","block");
               esri.show(loading);
               map.disableMapNavigation();
               map.hideZoomSlider();
           };
        };
        function hideLoading(){
            $("#loadingImg").css("display","none");
            esri.hide(loading);
            map.enableMapNavigation();
            map.showZoomSlider();
        };
        //定位效果
        function location(){
        switch (flag){
            case 1:
                var ptStart = new esri.geometry.Point(122.63547702920563,33.69240001655749,sr);
                map.centerAndZoom(ptStart);break;
            case 2:
                var ptStart = new esri.geometry.Point(122.75238022672157,33.96554219858331,sr);
                map.centerAndZoom(ptStart);break;
            case 3:
                var ptStart = new esri.geometry.Point(121.3744313357893,27.662642908585198,sr);
                map.centerAndZoom(ptStart);break;
            case 4:
                var ptStart = new esri.geometry.Point(125.3972649620242,28.955264236830423,sr);
                map.centerAndZoom(ptStart);break;
            }
        }
        //大风大浪的数据展示及播放滚动条checkbox
        $("input[type='checkbox']").click(function() {
            if ($("#data1").prop("checked")) {
                $("#data2").attr("disabled", "disabled");
                       //数据源1大浪
                    opLayer = new ArcGISDynamicMapServiceLayer("http://101.231.140.173:6084/arcgis/rest/services/WAVE/MapServer", {
                        "id": "opLayer",
                        "opacity": 0.9
                    });
                    map.addLayers([opLayer]);
                    map.on("layers-add-result", initSlider);
            } else {
                $("#data2").attr("disabled", false);
                    map.removeLayer(opLayer);
            }
            if ($("#data2").prop("checked")) {
                $("#data1").attr("disabled", "disabled");
                    //数据源2大风
                    opLayer = new ArcGISDynamicMapServiceLayer("http://202.121.66.51:808/arcgis/rest/services/WaveDown/MapServer", {
                        "id": "opLayer",
                        "opacity": 0.9
                    });
               map.addLayers([opLayer]);
               map.on("layers-add-result", initSlider);
            } else {
                $("#data1").attr("disabled", false);
            }
        });
        //定义播放滚动条方法
        function initSlider() {
            var layInfo,loopIII;
            console.log("opLayer.layerInfos.length",opLayer.layerInfos.length);
            if(opLayer.layerInfos.length%7==0) {
                layInfo = opLayer.layerInfos.length - 7;
            }else{
                layInfo = opLayer.layerInfos.length - 5;
            }
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
            if(input.length%7==0){
                loopIII = opLayer.layerInfos.length - 7;
            }else{
                loopIII = opLayer.layerInfos.length - 5;
            }
            console.log("loopIII IS",loopIII);
            //图层随着进度条改变而改变
            timeSlider.on("time-extent-change", function (evt) {
                showLoad=false;
                var endValString = evt.endTime.getFullYear() + "年" + evt.endTime.getMonth() + "月" + evt.endTime.getDate() + "日" + evt.endTime.getHours() + "时";
                dom.byId("daterange").innerHTML = "<i>" + " of " + endValString + "<\/i>";

                var minoTime = evt.endTime - evt.startTime;//进度条时间差
                var minosBar = minoTime / 3600000;//表示进度条第几个bar
                var loopI;
                loopIII = opLayer.layerInfos.length;
                if(loopIII%7==0) {
                    loopI = loopIII - minosBar * 7;
                }else if(loopIII%5==0 ){
                    loopI = loopIII - minosBar *5;
                };
                if(loopI<0){
                    return;
                }
                var visible = new Array();
                console.log("input[loopI]",input[loopI].id);
                visible.push(input[loopI].id);
                opLayer.setVisibleLayers(visible);
                console.log("总共层数",loopIII);//总层数
                console.log("LOOPI IS 当前层",loopI);//当前层 360 0000*1*7+483=490     360 0000*2*7+476=490
            });
        }
    });
//台风路径展示方法(这个方法必须在require外面，否则settimeout方法调用失效)
function addPath(){
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
};



