package cn.edu.shou.service;

import cn.edu.shou.domain.tbjhshipdata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
/**
 * Created by seky on 16/3/27.
 */
public interface shipDataRepository extends PagingAndSortingRepository<tbjhshipdata, Long> {

    //获取观测数据
    @Query("select ship from tbjhshipdata ship  where ship.tbjhship.obdate>:date order by ship.id asc")
    public List<tbjhshipdata>getTopShipData(@Param("date") Timestamp date);

}
