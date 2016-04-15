package cn.edu.shou.web.api;

import cn.edu.shou.domain.tbjhshipdata;
import cn.edu.shou.service.shipDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import cn.edu.shou.domain.form.tbjhshipdataForm;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by seky on 16/3/28.
 */
@RestController
@RequestMapping(value = "/api/ship")
public class shipDataApiController {
    @Autowired
    shipDataRepository shipDataRepository;


    @RequestMapping(value = "/getTopShipData")
    public List<tbjhshipdataForm>getTopShipData(){
        List<tbjhshipdataForm>tbjhshipdataForms= new ArrayList <tbjhshipdataForm>();

        Timestamp timestamp=null;
        try {
            //Timestamp timestamp;
            String strDateTime = "2016-03-24 10:11:00";
            //timestamp=new Timestamp(date.getTime());//获取当前时间

            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date=df.parse(strDateTime);
            String time = df.format(date);
            timestamp = Timestamp.valueOf(time);
        }
        catch (Exception ex){
            System.out.println(ex);
        }

        List<tbjhshipdata>tbjhshipdatas=shipDataRepository.getTopShipData(timestamp);
        for (tbjhshipdata data : tbjhshipdatas){
            tbjhshipdataForm tbjhshipdataForm = new tbjhshipdataForm();
            tbjhshipdataForm.setAirpressure(data.getAirpressure());//气压
            tbjhshipdataForm.setObDate(changeDate(data.getTbjhship().getObdate()));//观测日期 需要处理成24日10点41分
            tbjhshipdataForm.setWinddir(data.getWinddir());//风向
            tbjhshipdataForm.setWindspeed(data.getWindspeed());//风速

            tbjhshipdataForm.setObminute(splitDate(data.getTbjhship().getObdate()));//字段
            tbjhshipdataForms.add(tbjhshipdataForm);
            changeDate(data.getTbjhship().getObdate());
        }
        return tbjhshipdataForms;
    }
    //日期转换Timestamp转换成24日10点41分
    private String changeDate(Timestamp ts){
        Date date=new Date(ts.getTime());
        String month=String.valueOf(ts.getMonth()+1);//获取月
        String day=String.valueOf(ts.getDate());//获取日
        String hours=String.valueOf(ts.getHours());//获取时
        String minutes=String.valueOf(ts.getMinutes());//获取分
        return month+"月"+day+"日"+hours+"时"+minutes+"分";
    }
    //日期转换Timestamp转换成24日10点41分
    private String splitDate(Timestamp ts){
        Date date=new Date(ts.getTime());
        String month=String.valueOf(ts.getMonth()+1);//获取月
        String day=String.valueOf(ts.getDate());//获取日
        String hours=String.valueOf(ts.getHours());//获取时
        String minutes=String.valueOf(ts.getMinutes());//获取分
        return minutes+"分";
    }
}
