package cn.edu.shou.web.api;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
 * Created by Administrator on 2016/4/2.
 */
@RestController
@RequestMapping(value = "/api/config")
public class ReadNetcdfController {
    NetcdfFile ncfile = null;
    String filename = "D:\\jidi\\Wind_wq_sugon_wrf_2015121620.nc";

   // ncfile = NetcdfFile.
    //获取u v 数据值
    // lat 纬度 lon 经度
    @RequestMapping(value = "/getSqrt", method =RequestMethod.GET)
    public List<Map<String, String>> getNetCdfPredictData(int lat,int lon) throws Exception{
        List<Map<String,String>> list = new ArrayList<Map<String,String>>();
        Map<String,String> map =new HashMap();
        try{
            ncfile = NetcdfFile.open(filename);
            String variable = "u10";
            String variable10 = "v10";
            Variable varu10 = ncfile.findVariable(variable);
            Variable varv10 = ncfile.findVariable(variable10);

            if (null != varu10 && null != varv10) {
                //第一个参数为时间编号，表示第几个时刻，
                //第二个参数为经度的数据编号，表示从哪个经度数据开始
                //第三个参数为维度的数据编号，表示从哪个维度数据开始
                int[] origin = new int[]{4, 0, 0};//位置
                origin[1]=lat;
                origin[2]=lon;
                //第一个参数表示时间的范围，72表示要读取72个时刻的数据
                //第二个表示经度的数据范围，1表示只读去一个点的数据
                //第三个表示纬度的数据范围，1表示只读一个点的数据
                int[] size = new int[]{72, 1, 1};//
                Array data2D = varu10.read(origin, size);
                //v10 read
                Array data3D = varv10.read(origin, size);
                //开方
                Double netcdfSqrt = Math.sqrt((Math.pow(data2D.getDouble(0), 2) + Math.pow(data3D.getDouble(0), 2)));

                map.put("windSpeed",netcdfSqrt.toString());
                map.put("windDir", netcdfSqrt.toString());
                list.add(map);
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
    @RequestMapping(value = "/PostCoordinates",method =RequestMethod.POST)
    public boolean postCoordiantes(Model model, @RequestParam int lat,
                                  @RequestParam int lon){
        try {
            Map<String,Integer> map=getLatAndLonIndex(lat,lon);
            getNetCdfPredictData(map.get("latindex"),map.get("lonindex"));
            return  true;
        }catch (Exception e){
            e.printStackTrace();
        }
        return true;
    }

    private Map<String,Integer>getLatAndLonIndex(int lat,int lon){
        Map<String,Integer> latAndLonIndex =new HashMap();//接收鼠标点击经纬度对应nc文件的编号
        latAndLonIndex.put("latindex",lat);
        latAndLonIndex.put("lonindex",lon);
        return latAndLonIndex;
    }
}