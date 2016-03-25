package cn.edu.shou.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by sqhe on 14-7-7.
 */
@Controller
@RequestMapping(value="")
//@SessionAttributes(value = {"userbase64","user"})
public class IndexController {
    //首页
    @RequestMapping(value = "/default")
    public String index(){
        return "default";
    }
}
