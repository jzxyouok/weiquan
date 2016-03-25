//天气图
    var today=new Date();
    var treeListSource;
    var dayX="";
    switch (today.getDay()){
        case 1:dayX="星期一";break;
        case 2:dayX="星期二";break;
        case 3:dayX="星期三";break;
        case 4:dayX="星期四";break;
        case 5:dayX="星期五";break;
        case 6:dayX="星期六";break;
        case 7:dayX="星期日";break;
    }
    function actBox(){
        if($("#acewaring").hasClass('open')){
             $("#acewaring").removeClass("open");
        };
        $("#ace-settings-box").toggleClass("open");
    };
    function windWar(){
        if($("#ace-settings-box").hasClass('open')){
            $("#ace-settings-box").removeClass("open");
        };
        $("#acewaring").toggleClass("open");
        if($("#widget").css("display")=="block"){
            $("#widget").toggle();
        }
    };
    var rightTopToday=today.getFullYear()+"-"+today.getMonth()+1+"-"+today.getDate()+"  "+dayX;
    $("#rightTopToday").text(rightTopToday);

    $("#releaseDateInput").kendoDatePicker({
        culture:"zh-CN",
        start: "year",
        depth: "year",
        format: "yyyy/MM"
    //        value:today
    });
    $("#elementName").kendoDropDownList({
        optionLabel: "请选择一",
        dataTextField: "mc",
        dataValueField: "dm",
        dataSource:{
            transport:{
                read:{
                    dataType: "json",
                    url:"/api/config/getAllCategory"
                }
            }
        }
    });
    $("#institutionName").kendoDropDownList({
        optionLabel: "请选择一",
        dataTextField: "mc",
        dataValueField: "dm",
        dataSource:{
            transport:{
                read:{
                    dataType: "json",
                    url:"/api/config/getAllInstitution"
                }
            }
        }
    });
    $("#dataTreeView").kendoGrid({
        dataSource:{
            transport:{
                read:{
                    dataType: "json",
                    url:"/api/config/all/0/0/"
                }
            }
        },
        grid:false,
        columns:[
            {hidden: true,field :"id"},
            {field:"feature",title:"天气图类型"},

        ]
    });

  function changeList(){
        var element=$("#elementName").val();
        var institution=$("#institutionName").val();
        var listUrl="/api/config/";

        if(element!=""&institution!=""){
            listUrl+="all/"+element+"/"+institution+"/";
        }
        else if(institution!=""){
            listUrl+="allInstitution/"+institution;
        }
        else if(element!=""){
            listUrl+="allElement/"+element;
        }
        //天气图下拉框
        $("#dataTreeView").kendoGrid({
            dataSource:{
                transport:{
                    read:{
                        dataType: "json",
                        url:listUrl
                    }
                }
            },
            grid:false,
            columns:[
                {hidden: true,field :"id"},
                {field:"feature",title:"天气图类型"},

            ],
            selectable:true,
           /* change: function(e) {*/
                //获取当前时间和时间间隔
              /*  var dateInput=$("#releaseDateInput").val();//当前日期

                var timeInput=$("#releaseTimeInput").val();//当前时间
                if(timeInput==""){
                    timeInput="00";
                }*/
                change: function() {
                    var row = this.select();//当前选中行
                    var data = this.dataItem(row);
                    bindListPics(data);
                }
             });
    }
      function bindListPics(data){
          //获取输入的时间和时间间隔
          var dateInput=$("#releaseDateInput").val();//输入的日期
          var timeInput=$("#releaseTimeInput").val();//输入的时间
          if(timeInput=""){
              timeInput="00";
          }
          var year=dateInput.split("/")[0];//输入年份
          var month=dateInput.split("/")[1];//输入月份
          var date=dateInput.split("/")[2];//输入的日
          var picId=data.id;//使用图片ID获取图片url，后台拼接地址
          //图片名称拼接
          var picName=year+""+month+""+date+""+timeInput+"00";
          //0119 zhouxuenan 图片展示部分
          var dataSourcePic = new kendo.data.DataSource({
              transport:{
                  read:{
                      dataType: "json",
                      url:"/api/config/getFileList/"+picId+"/"+picName,
                      async:false
                  }
              },
              pageSize: 4
          });
          $("#pager").kendoPager({
              dataSource: dataSourcePic
          });
          $("#listView").kendoListView({
              dataSource: dataSourcePic,
              template: kendo.template($("#template").html())
          });
          var totalCount=dataSourcePic._pristineTotal;//图片数据总数
          var show= document.getElementById('noDataImg'); //设置一个变量用于接收id=noDataImg的元素
          if(totalCount===0){
              $("#listView").css("display","none");
              $("#pager").css("display","none");
              $("#inputData").css("display","none");
              show.style.display='block';
          }else{
              $("#listView").css("display","block");
              $("#pager").css("display","block");
              $("#inputData").css("display","none");
              show.style.display='none';
          }}
  //视图切换
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
  //控制弹窗显示
   function show(){
       if($("#ace-settings-box").hasClass("open")){
          $("#ace-settings-box").toggleClass("open");
       };
    }
   function show1(){
       $("#widget").toggle();
   }
    $("#datepicker").datepicker({
            format: "yyyy-MM-dd",
            value: new Date()
        });
    function sethide(){
       document.getElementById("info").style.visibility="hidden";
    }
    var sales_charts = $('#sales-charts').css({'width':'100%' , 'height':'220px'});

  $("#ace-waring").click(function(){
      $("#ace-waring").toggleClass("open");
      $("#acewaring").toggleClass("open");
  });
$("#close").click(function(){
    $("#acewaring").toggleClass("open");
});
 $("#navWarning").attr('checked',true);
  $("#wind-btn").click(function(){
      $("#windScale").toggleClass("open");
      $("#wind-btn").toggleClass("open");
      $("#wind-btn").toggle();
  });
  $("#angleRight").click(function(){
      $("#windScale").toggleClass("open");
      $("#wind-btn").toggleClass("open");
      $("#wind-btn").toggle();
  });
  $("#ace-timeSlider-button").click(function(){
      $("#bottomPanel").toggleClass("closeTimeSliderPanel");
      $("#ace-timeSlider-button").css("display","none");
  });
 $("#angledown").click(function(){
     $("#bottomPanel").toggleClass("closeTimeSliderPanel");
     $("#ace-timeSlider-button").css("display","block");
 });
//infotemplates css 修改
$(".maximize").css("display","none");
$(".title").css("font","caption");
$(".title").css("color","aliceblue");


