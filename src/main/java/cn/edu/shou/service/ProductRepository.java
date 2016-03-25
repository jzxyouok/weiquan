package cn.edu.shou.service;

import cn.edu.shou.domain.TBREFPRODUCT;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;


/**
 * Created by CHENAULTC on 14-7-20.
 */
//@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface ProductRepository extends PagingAndSortingRepository<TBREFPRODUCT, Long> {

    public List<TBREFPRODUCT> findAll();


    //两个字段都不为空
    @Query(value= "select product from TBREFPRODUCT product where product.CATEGORYDM=:element and product.INSTITUDEDM=:institution")
    public List<TBREFPRODUCT> getAllTreeList(@Param("element") String element, @Param("institution") String institution);
    //institution
    @Query(value= "select product from TBREFPRODUCT product where product.INSTITUDEDM=:institution")
    public List<TBREFPRODUCT> getInsTreeList(@Param("institution") String institution);
    //element，category
    @Query(value= "select product from TBREFPRODUCT product where product.CATEGORYDM=:element")
    public List<TBREFPRODUCT> getCatTreeList(@Param("element") String element);
    //根据picId获取picURL
    @Query(value="select product.PATH from TBREFPRODUCT product where product.ID=:picId")
    public String getUrlById(@Param("picId") int picId);

}
