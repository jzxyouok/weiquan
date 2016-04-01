package cn.edu.shou.web.api;

import cn.edu.shou.domain.D_REFCATEGORY;
import cn.edu.shou.domain.D_REFINSTITUDE;
import cn.edu.shou.domain.TBREFPRODUCT;
import cn.edu.shou.domain.PicUrlForm;
import cn.edu.shou.service.CategoryRepository;
import cn.edu.shou.service.InstitutionRepository;
import cn.edu.shou.service.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * Created by Administrator on 2014/7/31.
 */
@RestController
@RequestMapping(value = "/api/config")
public class ConfigApiController {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private InstitutionRepository institutionRepository;
    @Autowired
    private ProductRepository productRepository;

    static String rootFolder="C:\\Program Files\\Apache Software Foundation\\Tomcat 7.0\\webapps\\weather";//文件根目录

    //获取所有图片分类信息
    @RequestMapping(value = "/getAllCategory", method = RequestMethod.GET)
    public List<D_REFCATEGORY> getAllCategory() {
        List<D_REFCATEGORY> d_refcategories = categoryRepository.findAll();
        return d_refcategories;
    }
    //获取所有机构信息
    @RequestMapping(value = "/getAllInstitution", method = RequestMethod.GET)
    public List<D_REFINSTITUDE> getAllInstitution() {
        List<D_REFINSTITUDE> d_refinstitudes = institutionRepository.findAll();
        return d_refinstitudes;
    }
    @RequestMapping(value = "/all/{element}/{institution}/", method = RequestMethod.GET)
    public List<TBREFPRODUCT> getTreeList(@PathVariable int element, @PathVariable int institution) {
        String elementS = element + "";
        String institutionS = institution + "";
        List<TBREFPRODUCT> tbrefproducts = new ArrayList<TBREFPRODUCT>();
        tbrefproducts = productRepository.getAllTreeList(elementS, institutionS);
        return tbrefproducts;
    }
    //点击事件 获取该时间段有哪些类型数据
    @RequestMapping(value = "/all/{element}/{institution}/{date}", method = RequestMethod.GET)
    public List<TBREFPRODUCT> getTreeListByDate(@PathVariable int element, @PathVariable int institution,@PathVariable Date date) {
        String listYear=String.format("%tY",date);//获取到年
        String listMonth=String.format("%tm",date);//获取到月份
        String listDate=String.format("%td",date);//获取到日
        String allDate=listYear+listMonth+listDate;//获取到完整的文件年月日
        String elementS = element + "";
        String institutionS = institution + "";
        List<TBREFPRODUCT> tbrefproducts = new ArrayList<TBREFPRODUCT>();
        tbrefproducts = productRepository.getAllTreeList(elementS, institutionS);
        List<TBREFPRODUCT>tbrefproductList=new ArrayList<TBREFPRODUCT>();//返回结果集
        for(TBREFPRODUCT tbrefproduct:tbrefproducts){
            String filePath=tbrefproduct.getPATH();
            filePath=filePath.replace("{year}",listYear).replace("{month}",listMonth);
            filePath=rootFolder+filePath;
            //判断该路径下是否有文件
            boolean fExit=folderAndFileExit(filePath,allDate);//判断文件夹以及文件是否存在
            if(fExit){
                tbrefproductList.add(tbrefproduct);
            }
        }
        return tbrefproductList;
    }

    @RequestMapping(value = "/allElement/{element}", method = RequestMethod.GET)
    public List<TBREFPRODUCT> getETreeList(@PathVariable int element) {
        String elementS = element + "";
        List<TBREFPRODUCT> tbrefproducts = productRepository.getCatTreeList(elementS);
        return tbrefproducts;
    }

    @RequestMapping(value = "/allInstitution/{institution}", method = RequestMethod.GET)
    public List<TBREFPRODUCT> getITreeList(@PathVariable int institution) {
        String institutionS = institution + "";
        List<TBREFPRODUCT> tbrefproducts = productRepository.getInsTreeList(institutionS);
        return tbrefproducts;
    }
    @RequestMapping(value = "/getFileList/{picId}/{picName}")
    @ResponseBody
    protected List<PicUrlForm> CalculateGeoServlet(@PathVariable int picId, @PathVariable String picName) throws ServletException, IOException {
        //根据某类picId获取根目录url
        List<PicUrlForm> fileList = new ArrayList<PicUrlForm>();
        if (picId == 0) {
            fileList = null;
        } else {
            String urlOringin = productRepository.getUrlById(picId);
            String year = picName.substring(0, 4);//年 201511252000
            String month = picName.substring(4, 6);//月
            String date = picName.substring(6, 8);//日
            String hour = picName.substring(8, 10);//小时
            String pic1 = urlOringin.replace("{year}", year);
            String urlMonth = pic1.replace("{month}", month);
            // String urlDate = urlMonth.replace("{date}", date);
            String allDate=year+month+date;//获取到文件年月日
            fileList = getFiles(urlMonth,allDate);
        }
        return fileList;
    }
    /**
     * 通过递归得到某一路径下所有的目录及其文件
     *
     * @param filePath 文件路径
     * @return
     */
    public static List<PicUrlForm> getFiles(String filePath,String allDate) {
        ArrayList<PicUrlForm> fileLists = new ArrayList<PicUrlForm>();
        System.out.print("filepath is :" + filePath);
        File root = new File(rootFolder + filePath);//根目录文件夹
        File[] files = root.listFiles();//根目录下文件
        if (files != null) {
            for (File file : files) {
                String fileName=file.getName();//获取到文件名
                //判定文件是否是所选择日期文件，不是就不需要返回
                if(fileName.contains(allDate)){
                    PicUrlForm fileList = new PicUrlForm();
                    String cutAbsolutePath = file.getAbsolutePath().replace(rootFolder, "");
                    fileList.setUrl(cutAbsolutePath);
                    fileList.setPicName(file.getName());
                    fileLists.add(fileList);
                }
            }
        } else {
            return null;
        }
        return fileLists;
    }
    //判断文件夹是否存在以及文件夹下面是否有文件
    private boolean folderAndFileExit(String filePath,String allDate){
        File file=new File(filePath);
        File list[]=file.listFiles();//判断是否有文件
        if (file.exists()){
            //判定文件夹下面是否有指定日期文件
            for (File fi:list){
                String fileName=fi.getName();//获取文件名
                if(fileName.contains(allDate)){
                    return true;
                }
            }
            return false;
        }else {
            return false;
        }
    }
}
