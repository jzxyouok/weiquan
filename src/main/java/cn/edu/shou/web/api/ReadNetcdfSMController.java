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
 * Created by Administrator on 2016/4/23.
 */
@RestController
@RequestMapping(value = "/api/config")
public class ReadNetcdfSMController {
    NetcdfFile ncfile = null;
    String filename = "D:\\jidi\\标准化NC\\SM_20160420_05h48m.nc";
    //获取u v 数据值
    // lat 纬度 lon 经度
    public List<Map<String, String>> getNetCdfPredictData(int zoom) throws Exception{
        List<Map<String,String>> list = new ArrayList<Map<String,String>>();
        try{
            System.out.println(zoom);
            ncfile = NetcdfFile.open(filename);
            String variable = "U_10m";
            String variable10 = "V_10m";
            String lats ="latitude";
            String lons ="longitude";
            Variable varlat =ncfile.findVariable(lats);
            Variable varlon =ncfile.findVariable(lons);
            Variable varu10 = ncfile.findVariable(variable);
            Variable varv10 = ncfile.findVariable(variable10);
            int count,counts=0;
            if (null != varu10 && null != varv10) {
                int[] origin = new int[]{0, 0, 0};//位置
                int[] size = new int[] {160,160};//
                Array data2D = varu10.read(origin, size);
                //v10 read
                Array data3D = varv10.read(origin, size);
                //经纬度数据
                List latrang = new ArrayList();
                latrang.add(new Range(0,160));
                Array lattigude = varlat.read(latrang).reduce();
                List lonrang = new ArrayList();
                lonrang.add(new Range(0,160));
                Array longtigude = varlon.read(lonrang).reduce();
                //开方
                switch (zoom){
                    case 0:count=1;break;
                    case 1:count=5;break;
                    case 2:count=10;break;
                    case 3:count=25;break;
                    case 4:count=50;break;
                    case 5:count=100;break;
                    case 6:count=250;break;
                    case 7:count=500;break;
                    case 8:count=1000;break;
                    case 9:count=1250;break;
                    case 10:count=1500;break;
                    case 11:count=2250;break;
                    case 12:count=3300;break;
                    case 13:count=4000;break;
                    default:count=1;break;
                }
                      for(int j=0;j<10;j++){
                          Map<String,String>map = new HashMap<String, String>();
                            if(Double.isNaN(data2D.getDouble(counts))!=true&&Double.isNaN(data3D.getDouble(counts))!=true){
                                Double netcdfSqrt = Math.sqrt((Math.pow(data2D.getDouble(counts), 2) + Math.pow(data3D.getDouble(counts), 2)));
                                map.put("windSpeed",String.valueOf(netcdfSqrt));
                                //  map.put("u_10m",String.valueOf(data2D.getDouble(counts)));
                                //   map.put("v_10m",String.valueOf(data3D.getDouble(counts)));
                            }
                          map.put("lattigude",String.valueOf(lattigude.getDouble(counts)));
                          map.put("longtigude",String.valueOf(longtigude.getDouble(counts)));
                          list.add(map);
                          counts+=1;
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
    @RequestMapping(value = "/PostSMCoordinates/{zoom}",method =RequestMethod.GET)
    public  List<tbjhshipdata> postCoordiantes( @PathVariable int zoom){
        List<Map<String,String>> list1 = new ArrayList<Map<String,String>>();
        try {
         //  Map<String,Integer> map=getLatAndLonIndex(zoom);
            //return list
            list1 =  getNetCdfPredictData(zoom);
        }catch (Exception e){
            e.printStackTrace();
        }
        List<tbjhshipdata> results=new ArrayList<tbjhshipdata>();
        for (Map<String,String>list:list1){
            tbjhshipdata shiData=new tbjhshipdata();
            shiData.setWindspeed(Float.parseFloat(list.get("windSpeed")));
            shiData.setWinddir(Float.parseFloat(list.get("longtigude")));
            shiData.setWatertemp(Float.parseFloat(list.get("lattigude")));
            results.add(shiData);
        }
        return results;
    }

    private Map<String,Integer>getLatAndLonIndex(int zoom){
        Map<String,Integer> latAndLonIndex =new HashMap();//接收当前地图的缩放级别zoom
        latAndLonIndex.put("zoom",zoom);
        return latAndLonIndex;
    }
}