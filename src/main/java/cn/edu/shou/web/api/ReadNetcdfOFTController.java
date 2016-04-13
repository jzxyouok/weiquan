package cn.edu.shou.web.api;

import cn.edu.shou.domain.tbjhshipdata;
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
public class ReadNetcdfOFTController {
    NetcdfFile ncfile = null;
    String filename = "D:\\jidi\\标准化NC\\OFT_2016040111_CURRENT_V.nc";
    //获取u v 数据值
    // lat 纬度 lon 经度
    @RequestMapping(value = "/getOFTSqrt", method =RequestMethod.GET)
    public List<Map<String, String>> getNetCdfPredictData(int lat,int lon) throws Exception{
        List<Map<String,String>> list = new ArrayList<Map<String,String>>();

        try{
            ncfile = NetcdfFile.open(filename);
            String variable = "U";
            String variable10 = "V";
            Variable varu10 = ncfile.findVariable(variable);
            Variable varv10 = ncfile.findVariable(variable10);

            if (null != varu10 && null != varv10) {
                List ranges = new ArrayList();
                ranges.add(new Range(0,100,30));
                ranges.add(new Range(0,0));
                ranges.add(new Range(0,105,1));
                Array data2D =varu10.read(ranges).reduce();
                for(int i = 0;i<30;i++){
                    Map<String,String> map =new HashMap();
                    Double netcdfSqrt = Math.sqrt((Math.pow(data2D.getDouble(i), 2) + Math.pow(data2D.getDouble(i+1), 2)));
                    System.out.println("netcdfsqrt"+netcdfSqrt);
                    map.put("windSpeed", netcdfSqrt.toString());
                    map.put("windDir", netcdfSqrt.toString());
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
        return list;
    }
    @RequestMapping(value = "/PostOFTCoordinates/{lat}/{lon}",method =RequestMethod.GET)
    public  List<tbjhshipdata> postCoordiantes( @PathVariable int lat,
                                  @PathVariable int lon){
        List<Map<String,String>> lists = new ArrayList<Map<String,String>>();
        try {
            Map<String,Integer> map=getLatAndLonIndex(lat,lon);
            //return list
            lists =  getNetCdfPredictData(map.get("latindex"),map.get("lonindex"));
            System.out.println("lists is"+lists);
        }catch (Exception e){
            e.printStackTrace();
        }
        List<tbjhshipdata> results=new ArrayList<tbjhshipdata>();
        for (Map<String,String>list:lists){
            tbjhshipdata shiData=new tbjhshipdata();
            shiData.setWindspeed(Float.parseFloat(list.get("windSpeed")));
            shiData.setWinddir(Float.parseFloat(list.get("windDir")));
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