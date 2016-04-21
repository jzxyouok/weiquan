package cn.edu.shou.web.api;
import cn.edu.shou.domain.tbjhshipdata;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ucar.ma2.Array;
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
public class ReadNetcdfController {
    NetcdfFile ncfile = null;
    String filename = "D:\\jidi\\Wind_wq_sugon_wrf_2015121620.nc";
    //获取u v 数据值
    // lat 纬度 lon 经度
    @RequestMapping(value = "/getSqrt", method =RequestMethod.GET)
    public List<Map<String, String>> getNetCdfPredictData(int lat,int lon) throws Exception{
        List<Map<String,String>> list = new ArrayList<Map<String,String>>();

        try{
            ncfile = NetcdfFile.open(filename);
            String variable = "u10";
            String variable10 = "v10";
            String lats ="lat";
            String lons ="lon";
            Variable varlat =ncfile.findVariable(lats);
            Variable varlon =ncfile.findVariable(lons);
            Variable varu10 = ncfile.findVariable(variable);
            Variable varv10 = ncfile.findVariable(variable10);

            if (null != varu10 && null != varv10) {

                //第一个参数为时间编号，表示第几个时刻，
                //第二个参数为经度的数据编号，表示从哪个经度数据开始
                //第三个参数为维度的数据编号，表示从哪个维度数据开始
                int[] origin = new int[]{0, 0, 0};//位置
                origin[1]=lat;
                origin[2]=lon;
                //第一个参数表示时间的范围，72表示要读取72个时刻的数据
                //第二个表示经度的数据范围，1表示只读去一个点的数据
                //第三个表示纬度的数据范围，1表示只读一个点的数据
                int[] size = new int[]{144, 170, 116};//
                Array data2D = varu10.read(origin, size);
                //v10 read
                System.out.println("data2d is"+data2D);
                Array data3D = varv10.read(origin, size);
                //经纬度的值
                Array arrLat = varlat.read("0:170:5");
                Array arrLon = varlon.read("0:116:5");
                //开方
                for(int i = 0;i<24;i++){
                    Map<String,String> map =new HashMap();
                    Double netcdfSqrt = Math.sqrt((Math.pow(data2D.getDouble(i), 2) + Math.pow(data3D.getDouble(i), 2)));
                    System.out.println("netcdf"+netcdfSqrt);
                    if(netcdfSqrt>=7){
                        System.out.println(i);
                        map.put("windSpeed", String.valueOf(arrLat.getDouble(i)));
                        map.put("windDir",String.valueOf(arrLon.getDouble(i)));
                        list.add(map);
                    }
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
    @RequestMapping(value = "/PostCoordinates/{lat}/{lon}",method =RequestMethod.GET)
    public  List<tbjhshipdata> postCoordiantes( @PathVariable int lat,
                                  @PathVariable int lon){
        List<Map<String,String>> list1 = new ArrayList<Map<String,String>>();
        try {
            Map<String,Integer> map=getLatAndLonIndex(lat,lon);
            //return list
            list1 =  getNetCdfPredictData(map.get("latindex"),map.get("lonindex"));
            System.out.println("list1 is"+list1);
        }catch (Exception e){
            e.printStackTrace();
        }
        List<tbjhshipdata> results=new ArrayList<tbjhshipdata>();
        for (Map<String,String>list:list1){
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