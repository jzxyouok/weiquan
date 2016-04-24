package cn.edu.shou.web.api;

import cn.edu.shou.domain.tbjhshipdata;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ucar.ma2.Array;
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
    String filename = "D:\\jidi\\SM_20160420_05h48m.nc";
    //获取u v 数据值
    // lat 纬度 lon 经度
    public List<Map<String, String>> getNetCdfPredictData() throws Exception{
        List<Map<String,String>> list = new ArrayList<Map<String,String>>();
        try{
            ncfile = NetcdfFile.open(filename);
            String variable = "U_10m";
            String variable10 = "V_10m";
            String lats ="latitude";
            String lons ="longitude";
            Variable varlat =ncfile.findVariable(lats);
            Variable varlon =ncfile.findVariable(lons);
            Variable varu10 = ncfile.findVariable(variable);
            Variable varv10 = ncfile.findVariable(variable10);

            if (null != varu10 && null != varv10) {

                //第一个参数为时间编号，表示第几个时刻，
                //第二个参数为经度的数据编号，表示从哪个经度数据开始
                //第三个参数为维度的数据编号，表示从哪个维度数据开始
                int[] origin = new int[]{0, 0, 0};//位置

                //第一个参数表示时间的范围，72表示要读取72个时刻的数据
                //第二个表示经度的数据范围，1表示只读去一个点的数据
                //第三个表示纬度的数据范围，1表示只读一个点的数据
                int[] size = new int[] {160,160};//
                Array data2D = varu10.read(origin, size);
                //v10 read
                System.out.println("data2d is"+data2D);
                Array data3D = varv10.read(origin, size);
            /*    //经纬度的值
                Array arrLat = varlat.read("0:170:5");
                Array arrLon = varlon.read("0:116:5");*/
                Double a [][] = new Double[160][160];
                int count=0;
                for(int i=0;i<160;i++){
                    for(int j=0;j<160;j++){
                        a[i][j]=data2D.getDouble(count);
                        count++;
                        System.out.println("count is "+count);
                    }
                }
                for(int i=0;i<a.length;i++){
                    for(int j=0;j<a[i].length;j++){
                        System.out.print(a[i][j]);
                    }
                    System.out.println();
                }

                //开方
               /* for(int i = 0;i<24;i++){
                    Map<String,String> map =new HashMap();
                    Double netcdfSqrt = Math.sqrt((Math.pow(data2D.getDouble(i), 2) + Math.pow(data3D.getDouble(i), 2)));
                    System.out.println("netcdf"+netcdfSqrt);
                    if(netcdfSqrt>=13.9&&netcdfSqrt<=17.1){
                        System.out.println(i);
                        map.put("windSpeed", String.valueOf(arrLat.getDouble(i)));
                        map.put("windDir",String.valueOf(arrLon.getDouble(i)));
                        list.add(map);
                    }
                }*/
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
    @RequestMapping(value = "/PostSMCoordinates/",method =RequestMethod.GET)
    public  List<tbjhshipdata> postCoordiantes(){
        List<Map<String,String>> list1 = new ArrayList<Map<String,String>>();
        try {
          // Map<String,Integer> map=getLatAndLonIndex();
            //return list
            list1 =  getNetCdfPredictData();
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

/*    private Map<String,Integer>getLatAndLonIndex(int lat,int lon){
        Map<String,Integer> latAndLonIndex =new HashMap();//接收鼠标点击经纬度对应nc文件的编号
        latAndLonIndex.put("latindex",lat);
        latAndLonIndex.put("lonindex",lon);
        return latAndLonIndex;
    }*/
}