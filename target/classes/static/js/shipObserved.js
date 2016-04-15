/**
 * Created by seky on 16/3/21.
 * 船载观测数据
 */
//加载船载观测数据 图表
var windDirData=[{start:11.3,end:33.7},{start:33.8,end:56.2},{start:56.3,end:78.7},{start:78.8,end:101.2},{start:101.3,end:123.7},{start:123.8,end:146.2},
    {start:146.3,end:168.7},{start:168.8,end:191.2},{start:191.3,end:213.7},{start:213.8,end:236.2},{start:236.3,end:258.7},{start:258.8,end:281.2},{start:281.3,end:303.7},
    {start:303.8,end:326.2},{start:326.3,end:348.7},{start:248.8,end:11.2}];
$(".k-window .widget-box").css("display","none");
function getObservedData(type){
    if(type=="wind"){
        windChart();
    }else{
        airPressureChart();
    }
}
//风速曲线图
function airPressureChart(){
    $("#chart").kendoChart({
        dataSource: {
            type: "json",
            transport: {
                read: "/api/ship/getTopShipData"
            }
        },
        title: {
            text: "气压曲线图"
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
        series: [
            {
            name: "气压",
            field:"airpressure"
        }

        ],
        valueAxis: {
            labels: {
                format: "{0}pa"
            },
            line: {
                visible: true
            },
            axisCrossingValue: -10
        },
        categoryAxis: {
            field:"obminute",
            majorGridLines: {
                visible: false
            },
            labels: {
                rotation: 0,
                step:5,
                format:"{0}"
            },
            crosshair: {
                visible: true
            }
        },
        tooltip: {
            visible: true,
            format: "{0}%",
            template: "#= series.name #: #= value #"
        }
    });
}
//气压曲线图
function windChart(){
    $("#chart").kendoChart({
        dataSource: {
            type: "json",
            transport: {
                read: "/api/ship/getTopShipData"
            }
        },
        title: {
            text: "风速曲线图"
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
        series: [
            {
                name: "风速风向",
                field:"windspeed",
                markers: {
                    size: 15,
                    visual: function (e) {
                        //根据风向加载相对应的风向图片
                        var winddir=getWindDir(e.dataItem.winddir);
                        var src = kendo.format("/img/ships/{0}", winddir);

                        var image = new kendo.drawing.Image(src, e.rect);
                        return image;
                    }
                }
            }
        ],
        valueAxis: {
            labels: {
                format: "{0}m/s"
            },majorUnit:1,
            line: {
                visible: true
            },
            axisCrossingValue: -10
        },
        categoryAxis: {
           // categories: ["", "40分", "", "", "", "", "35分", "", "", "","","30分","","","","","25分","","","","","20分","","","","","15分","","","",""],
            field:"obminute",
            majorGridLines: {
                visible: false
            },
            justified: false,
            labels: {
                rotation: 0,
                step:5,
                format:"{0}"
            },
            crosshair: {
                visible: true
            }
        },
        tooltip: {
            visible: true,
            format: "{0}%",
            template: "#= series.name #: #= value #"
        }
    });
}
//根据风向加载相对应的风向图片
function getWindDir(windDir){
    var name="";//返回图片名称
    if(windDir<=11.2 || windDir>348.7){//风向小于等于11.2和大于348.7的时候都是正北方向
        name="348.8-11.2.png";
    }else{
        for(var i=0;i<windDirData.length;++i){
            if(windDirData[i].end>windDir){
                name=windDirData[i].start+"-"+windDirData[i].end+".png";
                break;//跳出循环
            }
        }
    }
    return name;
}
//加载grid数据
function getObservedGrid(){
    $("#grid").kendoGrid({
        columns: [
            { field:"obDate",title:"日期",
                headerAttributes: {
                    style: "text-align: center; vertical-align:middle;font-size: 12px;width:100px;"
                },
                attributes: {
                    style: "text-align: center; font-size: 12px;width:100px;"
                }
            },
            { field:"windspeed",title:"风速",
                headerAttributes: {
                    style: "text-align: center; vertical-align:middle;font-size: 12px"
                },
                attributes: {
                    style: "text-align: center; font-size: 12px"
                }},
            { field:"winddir",title:"风向",
                headerAttributes: {
                    style: "text-align: center; vertical-align:middle;font-size: 12px"
                },
                attributes: {
                    style: "text-align: center; font-size: 12px"
                }},
            { field:"airpressure",title:"气压",
                headerAttributes: {
                    style: "text-align: center; vertical-align:middle;font-size: 12px"
                },
                attributes: {
                    style: "text-align: center; font-size: 12px"
                }}

        ],
        dataSource: {
            type: "json",
            transport: {
                read: "/api/ship/getTopShipData"
            }
        }
    });
}

