package cn.edu.shou.web.api;

import cn.edu.shou.domain.tbjhshipdata;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ucar.ma2.Array;
import ucar.ma2.Range;
import ucar.nc2.NetcdfFile;
import ucar.nc2.Variable;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/4/2.
 */
@RestController
@RequestMapping(value = "/api/config")
public class ReadNetcdfFishWindController {
    NetcdfFile ncfile = null;
    String filename = "D:\\jidi\\标准化NC\\FISHWIND_2016040100_FISHVIS_R.nc";
    //获取u v 数据值
    // lat 纬度 lon 经度
    public List<Map<String, String>> getNetCdfPredictData(Model model,int lat,int lon) throws Exception{
        List<Map<String,String>> list = new ArrayList<Map<String,String>>();
    //    List<Map<String,String>>dates=new ArrayList<Map<String, String>>();//接收所有的日期
        try{
            ncfile = NetcdfFile.open(filename);
            String variable = "U";
            String variable10 = "V";
            String TStime ="TSTEPS";
            Variable varu10 = ncfile.findVariable(variable);
            Variable varv10 = ncfile.findVariable(variable10);
            Variable varTime = ncfile.findVariable(TStime);

            if (null != varu10 && null != varv10) {
                //未来三天的时间序列
                List rangeTime = new ArrayList();
                rangeTime.add(new Range(0,432,6));
                rangeTime.add(new Range(3,3,1));
                Array dataTime = varTime.read(rangeTime).reduce();
                //日期day的时间序列
                List rangeData = new ArrayList();
               rangeData.add(new Range(0,432,6));
               rangeData.add(new Range(2,2,1));
               Array daydata =varTime.read(rangeData).reduce();
                //日期month的时间序列
                List rangeMonth = new ArrayList();
                rangeMonth.add(new Range(0,432,6));
                rangeMonth.add(new Range(1,1,1));
                Array Monthdata =varTime.read(rangeMonth).reduce();
                 /* for(int i =0;i<72;i++){
                      Map<String,String> date = new HashMap<String, String>();
                      if(i%12==0){
                          String dateStr=String.valueOf(Monthdata.getInt(i))+"月"+String.valueOf(daydata.getInt(i))+"日";
                          date.put("date", dateStr);
                          list.add(date);//添加到日期列表
                      }
                  }*/
                //未来三天U的值
                List ranges = new ArrayList();
                ranges.add(new Range(0,432,6));//时间维度，一共720个时刻，取未来3天的时刻，跨度为10
                ranges.add(new Range(0,0));//layer的维度
                ranges.add(new Range(lat,lat,1));//nodes，网格的数据
                Array data2D =varu10.read(ranges).reduce();
                //未来3天V的值
                List rangeLon = new ArrayList();
                rangeLon.add(new Range(0,432,6));
                rangeLon.add(new Range(0,0));
                rangeLon.add(new Range(lon,lon,1));
                Array dataV =varu10.read(ranges).reduce();
                System.out.println("dataV"+dataV);
                for(int i = 0;i<72;i++){
                    Map<String,String> map =new HashMap();
                    Double windDir=null;
                    Double netcdfSqrt = Math.sqrt((Math.pow(data2D.getDouble(i), 2) + Math.pow(dataV.getDouble(i), 2)));
                    map.put("windSpeed", netcdfSqrt.toString());
                    if(data2D.getDouble(i) > 0)
                        windDir=((180 / Math.PI) * Math.atan(data2D.getDouble(i)/dataV.getDouble(i)) + 180);
                    if(data2D.getDouble(i) < 0 & dataV.getDouble(i) < 0)
                        windDir= ((180 / Math.PI) * Math.atan(data2D.getDouble(i) / dataV.getDouble(i)) + 0);
                    if(data2D.getDouble(i) > 0 & dataV.getDouble(i) < 0)
                        windDir=((180 / Math.PI) * Math.atan(data2D.getDouble(i) / dataV.getDouble(i)) + 360);
                    map.put("windDir", windDir.toString());
                    Double times = dataTime.getDouble(i);
                    map.put("waterTemp",times.toString());
                    String dateStr=String.valueOf(Monthdata.getInt(i))+"月"+String.valueOf(daydata.getInt(i))+"日";
                    map.put("dates",dateStr);
                    list.add(map);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            if (null != ncfile)
                try {
                    ncfile.close();
                } catch (IOException ioe) {
                    ioe.printStackTrace();
                }
        }
        //返回前端
      //  model.addAttribute("dates",dates);
        return list;
    }
    @RequestMapping(value = "/PostFishWindCoordinates/{lat}/{lon}",method =RequestMethod.GET)
    public  List<tbjhshipdata> postCoordiantes( Model model,@PathVariable int lat,
                                  @PathVariable int lon){
        List<Map<String,String>> lists = new ArrayList<Map<String,String>>();
        try {
            Map<String,Integer> map=getLatAndLonIndex(lat,lon);
            //return list
            lists =  getNetCdfPredictData(model,map.get("latindex"),map.get("lonindex"));
            System.out.println("lists is"+lists);
        }catch (Exception e){
            e.printStackTrace();
        }
        List<tbjhshipdata> results=new ArrayList<tbjhshipdata>();
        for (Map<String,String>list:lists){
            tbjhshipdata shiData=new tbjhshipdata();
            shiData.setWindspeed(Float.parseFloat(list.get("windSpeed")));
            shiData.setWinddir(Float.parseFloat(list.get("windDir")));
            shiData.setWatertemp(Float.parseFloat(list.get("waterTemp")));
            shiData.setDates(list.get("dates"));
            results.add(shiData);
        }
        return results;
    }
    private Map<String,Integer>getLatAndLonIndex(int lat,int lon){
        Map<String,Integer> latAndLonIndex =new HashMap();//接收鼠标点击经纬度对应nc文件的编号
        latAndLonIndex.put("latindex",lat);
        latAndLonIndex.put("lonindex",lon);
        return latAndLonIndex;
    }
}