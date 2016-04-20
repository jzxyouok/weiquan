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
            String variable = "Value";
            String TStime ="TSTEPS";
            Variable varu10 = ncfile.findVariable(variable);
            Variable varTime = ncfile.findVariable(TStime);

            if (null != varu10 && null != varTime) {
                //未来三天的时间序列
                List rangeTime = new ArrayList();
                rangeTime.add(new Range(0,120,6));
                rangeTime.add(new Range(3,3,1));
                Array dataTime = varTime.read(rangeTime).reduce();
                //日期day的时间序列
                List rangeData = new ArrayList();
               rangeData.add(new Range(0,120,6));
               rangeData.add(new Range(2,2,1));
               Array daydata =varTime.read(rangeData).reduce();
                //日期month的时间序列
                List rangeMonth = new ArrayList();
                rangeMonth.add(new Range(0,120,6));
                rangeMonth.add(new Range(1,1,1));
                Array Monthdata =varTime.read(rangeMonth).reduce();
                //未来三天Value的值
                List rangeValue = new ArrayList();
                rangeValue.add(new Range(0,120,6));
                rangeValue.add(new Range(0,0));
                rangeValue.add(new Range(lon,lon,1));
                Array dasd = varu10.read(rangeValue).reduce();
                System.out.println("datavalue"+dasd);
               /* for(int i=0;i<21;i++){
                    Map<String,String> map =new HashMap();
                      Double times = dataTime.getDouble(i);
                      map.put("waterTemp",times.toString());
                      String dateStr=String.valueOf(Monthdata.getInt(i))+"月"+String.valueOf(daydata.getInt(i))+"日";
                      map.put("dates",dateStr);
                      list.add(map);
                }*/
                for(int i =0;i<72;i++){
                    Map<String,String> map =new HashMap();
                    map.put("windDir", String.valueOf(dasd.getDouble(i)));
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