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
import java.util.ArrayList;
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



    //获取所有图片分类信息
    @RequestMapping(value="/getAllCategory", method= RequestMethod.GET)
    public List<D_REFCATEGORY> getAllCategory(){
        List<D_REFCATEGORY> d_refcategories=categoryRepository.findAll();

        return d_refcategories ;
    }

    //获取所有机构信息
    @RequestMapping(value="/getAllInstitution", method= RequestMethod.GET)
    public List<D_REFINSTITUDE> getAllInstitution(){
        List<D_REFINSTITUDE> d_refinstitudes=institutionRepository.findAll();

        return d_refinstitudes ;
    }
    @RequestMapping(value = "/all/{element}/{institution}/", method= RequestMethod.GET)
    public List<TBREFPRODUCT> getTreeList(@PathVariable int element,@PathVariable int institution){
        String elementS=element+"";
        String institutionS=institution+"";
        List<TBREFPRODUCT>  tbrefproducts=new ArrayList<TBREFPRODUCT>();

        if(productRepository.getAllTreeList(elementS,institutionS).size()!=0){
            tbrefproducts=productRepository.getAllTreeList(elementS,institutionS);
        }
        System.out.print(tbrefproducts);
        return tbrefproducts;
    }

    @RequestMapping(value = "/allElement/{element}", method= RequestMethod.GET)
    public List<TBREFPRODUCT> getETreeList(@PathVariable int element){
        String elementS=element+"";
        List<TBREFPRODUCT>  tbrefproducts=productRepository.getCatTreeList(elementS);
        return tbrefproducts;

    }

    @RequestMapping(value = "/allInstitution/{institution}", method= RequestMethod.GET)
    public List<TBREFPRODUCT> getITreeList(@PathVariable int institution){
        String institutionS=institution+"";
        List<TBREFPRODUCT>  tbrefproducts=productRepository.getInsTreeList(institutionS);
        return tbrefproducts;

    }
    @RequestMapping(value="/getFileList/{picId}/{picName}")
    @ResponseBody
    protected List<PicUrlForm> CalculateGeoServlet(@PathVariable int picId,@PathVariable String picName) throws ServletException, IOException{
        //根据某类picId获取根目录url
        System.out.print(picId);
        List<PicUrlForm> fileList = new ArrayList<PicUrlForm>();
        if(picId==0){
            fileList=null;
        }
        else {
            String urlOringin = productRepository.getUrlById(picId);
            String year = picName.substring(0, 4);//年 201511252000
            String month = picName.substring(4, 6);//月
            String date = picName.substring(6, 8);//日
            String hour = picName.substring(8, 10);//小时
            String pic1 = urlOringin.replace("{year}", year);
            String url = pic1.replace("{month}", month);
            fileList = getFiles(url);
        }
        return fileList;
    }
    /**
     * 通过递归得到某一路径下所有的目录及其文件
     * @param filePath 文件路径
     * @return
     */
    public static List<PicUrlForm> getFiles(String filePath) {
        ArrayList<PicUrlForm> fileLists = new ArrayList<PicUrlForm>();
        System.out.print("filepath is :"+filePath);
        File root = new File("C:\\Program Files\\Apache Software Foundation\\Tomcat 7.0\\webapps\\ROOT"+filePath);//根目录文件夹
        File[] files = root.listFiles();//根目录下文件
        if(files!=null){
        for (File file : files) {
            PicUrlForm fileList = new PicUrlForm();
            String cutAbsolutePath=file.getAbsolutePath().replace("C:\\Program Files\\Apache Software Foundation\\Tomcat 7.0\\webapps\\ROOT","");
            fileList.setUrl(cutAbsolutePath);
                fileList.setPicName(file.getName());
//              String picPathStr = file.getAbsolutePath().replaceAll("\\\\","//");
                fileLists.add(fileList);

        }
//            for(int loop=0;loop<=files.length;loop++){
//                File file=new File("");
//                file=files[loop];
//                fileList.setPicId(loop+1);
//                fileList.setUrl(file.getAbsolutePath());
//                fileList.setPicName(file.getName());
////              String picPathStr = file.getAbsolutePath().replaceAll("\\\\","//");
//                //fileLists.add(fileList);
//                fileLists.add(loop,fileList);
//            }
        /*for(String str:fileList){
            System.out.println(str);
        }*/
    }
        return fileLists;
    }


}
