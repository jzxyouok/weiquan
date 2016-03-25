package cn.edu.shou.service;

import cn.edu.shou.domain.D_REFINSTITUDE;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

//import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by CHENAULTC on 14-7-20.
 */
//@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface InstitutionRepository extends PagingAndSortingRepository<D_REFINSTITUDE, Long> {

    public List<D_REFINSTITUDE> findAll();

    @Query(value= "select institute.DM,institute.MC from D_REFINSTITUDE institute")
    public List<D_REFINSTITUDE> getAllInstitute();


}
