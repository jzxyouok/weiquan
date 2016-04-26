package cn.edu.shou.service;

import cn.edu.shou.domain.tbjhship;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

/**
 * Created by Administrator on 2016/3/30.
 */
public interface tbjhShipRepository extends PagingAndSortingRepository<tbjhship,Long> {

    public List<tbjhship> findAll();

    @Query(value = "select ship from tbjhship ship")
    public List<tbjhship> getAllMessages();
}
