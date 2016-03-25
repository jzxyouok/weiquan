package cn.edu.shou.web.api;

import cn.edu.shou.domain.*;
import cn.edu.shou.service.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Administrator on 2014/7/31.
 */
@RestController
@RequestMapping(value = "/api/user")
public class UserApiController {
    @Autowired
    private UserRepository usDAO;

    //通过用户名获取用户信息
    @RequestMapping(value="/getUserByUserName", method= RequestMethod.GET)
    public User getuserbyusername(String userName){

        return usDAO.findByUserName(userName);
    }
    //通过用户Id获取用户信息
    @RequestMapping(value="/getUserById", method= RequestMethod.GET)
    public User getuserbyid(Long id){

        return usDAO.findOne(id);
    }
}
