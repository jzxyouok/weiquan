package cn.edu.shou.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * Created by sqhe on 14-7-12.
 */
@Entity
@Table(name = "D_REFINSTITUDE")
public class D_REFINSTITUDE  {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter @Setter
    private int DM;//id
    @Getter @Setter
    private String MC;//国家

    public int getDM() {
        return DM;
    }
    public void setDM(int DM){this.DM = DM ;}
    public String getMC() {
        return MC;
    }
    public void setMC(String MC) {
        this.MC = MC;
    }
}
