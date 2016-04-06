package cn.edu.shou.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/4/2.
 */
@Repository
public class mvTbjhshipRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;
    //测试数据
    public List<Map<String,Object>> getCount(){
        String sqlStr="select * from mv_tbjhship";
        List<Map<String,Object>> list=new ArrayList<Map<String,Object>>();
        list = jdbcTemplate.queryForList(sqlStr);
        return list;

    }

}
