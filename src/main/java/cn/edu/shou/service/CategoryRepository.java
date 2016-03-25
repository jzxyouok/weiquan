package cn.edu.shou.service;

import cn.edu.shou.domain.D_REFCATEGORY;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by CHENAULTC on 14-7-20.
 */
//@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface CategoryRepository extends PagingAndSortingRepository<D_REFCATEGORY, Long> {

    public List<D_REFCATEGORY> findAll();

    @Query(value= "select category.DM,category.MC from D_REFCATEGORY category")
    public List<D_REFCATEGORY> getAllCategory();



}
