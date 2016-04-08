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

        format: "yyyy/MM/dd"
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
//日历控件初始不可选
var datepicker = $("#releaseDateInput").data("kendoDatePicker");
datepicker.readonly(true);
//必选要素名称、发布机构、发布时间
$("#releaseDateInputLi").click(function(){
    var element=$("#elementName").val();//要素名称
    var institution=$("#institutionName").val();//发布机构
    if(element==""&& institution==""){
        alert("请选择要素名称、发布机构");
    }else if(element==""){
        alert("请选择要素名称");
    }else if(institution==""){
        alert("请选择发布机构");
    }
});
//改变要素名称、发布机构时，发布时间变为可选择
function changeFun(){
    var element=$("#elementName").val();//要素名称
    var date=$("#releaseDateInput").val();//发布时间
    var institutionName=$("#institutionName");//发布机构
    if(element!="" && date!="" && institutionName!=""){
        changeList();
    }else if(element!="" && institutionName!=""){
        datepicker.readonly(false);
    }
};
function changeList(){
    var element=$("#elementName").val();//要素名称
    var institution=$("#institutionName").val();//发布机构
    var listUrl="/api/config/";
    if(element!="" && institution!=""){
        listUrl+="all/"+element+"/"+institution+"/";
    }
    else if(institution!=""){
        listUrl+="allInstitution/"+institution;
    }
    else if(element!=""){
        listUrl+="allElement/"+element;
    }
    var datepicker = $("#releaseDateInput").data("kendoDatePicker");
    var date=datepicker.value();
    listUrl=listUrl+date;
    //天气图下拉框
    initDataTreeView(listUrl);
    var totalRecords=$("#dataTreeView").data("kendoGrid").dataSource.total();//显示dataSource的数据总数
    if(totalRecords==0){
        $("#noDataImg").css("display","block");
        $("#listView").css("display","none");
        $("#pager").css("display","none");
        $("#inputData").css("display","none");
    }else{
        $("#noDataImg").css("display","none");
        $("#inputData").css("display","none");
        $("#listView").css("display","block");
        $("#pager").css("display","block");
        //加载第一类的图片数据
        var grid = $("#dataTreeView").data("kendoGrid");
        var initId=grid._data[0].id;//获取到需要初始化数据的ID
        bindListPics(initId);//绑定图片数据
        grid.select("tr:eq(0)");
    }
}
//初始化grid
function initDataTreeView(listUrl){
    $("#dataTreeView").kendoGrid({
        dataSource:{
            transport:{
                read:{
                    async:false,
                    dataType: "json",
                    url:listUrl
                }
            }
        },
        hidden:false,
        grid:false,
        columns:[
            {hidden: true,field :"id"},
            {field:"feature",title:"天气图类型"}
        ],
        selectable:"row",
        change: function(e) {
            var row = this.select();//当前选中行
            var data = this.dataItem(row);
            if(data==null){
                data=this.dataItem("tr:eq(0)");
            }
            data==null?"":bindListPics(data.id);
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
          var picId=data;//使用图片ID获取图片url，后台拼接地址
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
          $("#compasss").css("transform","");
          $(".c_icon").css("transform","");
          $("#mapDiv_zoom_slider").css("display","block");
      }else{
          cha.className="map1";
          $("#mapDiv_zoom_slider").css("display","none");
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
//风力浪
/* $("#wind-btn").click(function(){
      $("#windScale").toggleClass("open");
      $("#wind-btn").toggleClass("open");
      $("#wind-btn").toggle();
 });
  $("#angleRight").click(function(){
      $("#windScale").toggleClass("open");
      $("#wind-btn").toggleClass("open");
      $("#wind-btn").toggle();
  });*/
//风力等级图片显示
$("#wind-btn").click(function(){
    $("#windScale").toggleClass("open");
    $("#windScale").toggle();
});
$("#wind").click(function(){
    $("#windScale").toggle();
    $("#waveScale").hide();
});
$("#angleRight").click(function(){
    $("#windScale").css("display","none");
});

//浪等级图片显示
$("#wave-btn").click(function(){
    $("#waveScale").toggleClass("open");
    $("#waveScale").toggle();
    $("#wave-btn").toggleClass("open");
    $("#wave-btn").toggle();
});
$("#wave").click(function(){
    $("#waveScale").toggle();
    $("#windScale").hide();
    $("#wave-btn").hide();
    $("#wind-btn").toggle();
});
$("#rightAngle").click(function(){
    $("#waveScale").css("display","none");
    $("#wave-btn").toggleClass("open");
    $("#wave-btn").css("display","block");
});


//timeslider 样式显示
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

//视图模式
var img = null,
    needle = null,
    ctx = null,degrees=0;
function clearCanvas() {
    ctx.clearRect(0, 0, 200, 200);
}
function draw() {
  /*  console.log("degrees before ",degrees);
    if(degrees==0||degrees==360){
        degrees=0;
    }else if(degrees==90){
        degrees=90;
    }else if(degrees==180){
        degrees=180;
    }else if(degrees==270){
        degrees=270;
    }else if(0<degrees<90){
        degrees=45;
    }else if(90<degrees<180){
        degrees=135;
    }else  if(180<degrees<270){
        degrees=225;
    }else if(270<degrees<360){
        degrees=315;
    };*/
    clearCanvas();
    // Draw the compass onto the canvas
    ctx.drawImage(img, 0, 0);
    // Save the current drawing state
    ctx.save();
    // Now move across and down half the
    ctx.translate(15, 15);
    // Rotate around this point
    ctx.rotate(degrees * (Math.PI / 180));
    // Draw the image back and up
    ctx.drawImage(needle, -10, -10);
    // Restore the previous drawing state
    ctx.restore();
    // Increment the angle of the needle by 5 degrees
    degrees+=5;
}
function imgLoaded() {
       setInterval(draw,100);
}
$(document).ready(function(){
    var canvas = document.getElementById('compass');
    if (canvas.getContext('2d')) {
        ctx = canvas.getContext('2d');
        // Load the needle image
        needle = new Image();
        needle.src = '/img/compass_arrow.png';
        // Load the compass image
        img = new Image();
        img.src = '/img/compass.png';
        img.onload = imgLoaded;
    } else {
        alert("Canvas not supported!");
    }
});
//船载观测数据div xlzheng 20160321
function setShipObserve(open){
    var observed = $("#shipOb");
    var oType=$("#observedType");//观测数据类型窗体
    if (!observed.data("kendoWindow")) {
        observed.kendoWindow({
            width: "900px",
            height:"300px",
            actions: ["Custom", "Minimize", "Close"],
            title: "船载观测数据"
        });
    };
    if (!oType.data("kendoWindow")) {
        oType.kendoWindow({
            width: "260px",
            height:"50px",
            actions: ["Custom", "Minimize", "Close"],
            title: "船载观测类型"
        });
    };

    //获取船载观测数据图表
    getObservedData("wind");
    //获取船载数据grid
    getObservedGrid();
    if(open){
        observed.data("kendoWindow").open();//打开window
        oType.data("kendoWindow").open();//打开window
    }else{
        observed.data("kendoWindow").close();//关闭window
        oType.data("kendoWindow").close();//关闭window
    }

}
//船载观测类型选择
function chkShipObserveType(obj){
    var chkValue=obj.value;//选择的值
    //获取船载观测数据图表
    getObservedData(chkValue);
}
//船的类型数据
function setboatTypeObserve(open){
    var observed = $("#boatType");
    if (!observed.data("kendoWindow")) {
        observed.kendoWindow({
            width: "259px",
            height:"154px",
            actions: ["Custom", "Minimize", "Close"],
            title: "船舶类型"
        });
    };
    //获取船的类型数据
    getBoatType();
    if(open){
        observed.data("kendoWindow").open();//打开window
    }else{
        observed.data("kendoWindow").close();//关闭window
    }
}
function getBoatType(){
    $("#treeview").kendoTreeView({
        checkboxes: {
            checkChildren: true
        },
        check: onCheck,
        dataSource: [{
            id: 1, text: "船舶", expanded: true, spriteCssClass: "rootfolder", items: [
                {
                    id: 2, text: "近岸", expanded: true, spriteCssClass: "folder", items: [
                    { id: 3, text: "船1", spriteCssClass: "html" },
                    { id: 4, text: "船2", spriteCssClass: "html" },
                    { id: 5, text: "船3", spriteCssClass: "image" }
                ]
                },
                {
                    id: 6, text: "远洋", expanded: true, spriteCssClass: "folder", items: [
                    { id: 7, text: "船1", spriteCssClass: "image" },
                    { id: 8, text: "船2", spriteCssClass: "pdf" },
                ]
                }
            ]
        }]
    });
};
function checkedNodeIds(nodes, checkedNodes) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedNodes.push(nodes[i].id);
        }
        if (nodes[i].hasChildren) {
            checkedNodeIds(nodes[i].children.view(), checkedNodes);
        }
    }
}
function onCheck() {
    var checkedNodes = [],message,
        treeView = $("#treeview").data("kendoTreeView");
    checkedNodeIds(treeView.dataSource.view(), checkedNodes);
    if (checkedNodes.length > 0) {
        message = "IDs of checked nodes: " + checkedNodes.join(",");
    } else {
        message = "No nodes checked.";
    }
}


