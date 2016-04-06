package cn.edu.shou.web.api;

import cn.edu.shou.domain.tbjhship;
import cn.edu.shou.service.mvTbjhshipRepository;
import cn.edu.shou.service.tbjhShipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Created by Administrator on 2016/4/2.
 */
@RestController
@RequestMapping(value = "/api/ship")
public class mvTbjhshipController {
    @Autowired
    private mvTbjhshipRepository mvTbjhship;

    //获取所有的数据信息
    @RequestMapping(value="/getMessages", method= RequestMethod.GET)
    public List<Map<String,Object>> getMessages(){
        List<Map<String,Object>> tbjhShips =mvTbjhship.getCount();
        return tbjhShips;
    }
}
