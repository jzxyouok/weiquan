package cn.edu.shou.web.api;

import cn.edu.shou.domain.tbjhship;
import cn.edu.shou.service.tbjhShipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Administrator on 2016/3/30.
 */
@RestController
@RequestMapping(value = "/api/tbjhship")
public class TbjhshipApiController {
    @Autowired
   private  tbjhShipRepository shipRepository;

    //获取所有的数据信息
    @RequestMapping(value="/getAllMessages", method= RequestMethod.GET)
    public List<tbjhship> getAllMessages(){
        List<tbjhship> tbjhShips =shipRepository.getAllMessages();
        return tbjhShips;
    }
}
