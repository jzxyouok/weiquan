package cn.edu.shou.service;

import cn.edu.shou.domain.tbjhshipdata;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by seky on 16/3/27.
 */
public interface shipDataRepository extends PagingAndSortingRepository<tbjhshipdata, Long> {
    //获取观测数据
    @Query("select ship from tbjhshipdata ship  where ship.tbjhship.obdate>:date order by ship.id asc")
    public List<tbjhshipdata>getTopShipData(@Param("date") Timestamp date);

}
