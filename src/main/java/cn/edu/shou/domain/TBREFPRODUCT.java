package cn.edu.shou.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * Created by sqhe on 14-7-12.
 */
@Entity
@Table(name = "TBREFPRODUCT")

public class TBREFPRODUCT  {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter @Setter
    private int ID;
    @Getter @Setter
    private String CATEGORYDM;
    @Getter @Setter
    private String INSTITUDEDM;
    @Getter @Setter
    private String FEATURE;
    @Getter @Setter
    private String PATH;
    @Getter @Setter
    private String REFTYPE;
    @Getter @Setter
    private String INTERVAL;
    @Getter @Setter
    private String TIMEFORMAT;


    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getCATEGORYDM() {
        return CATEGORYDM;
    }

    public void setCATEGORYDM(String CATEGORYDM) {
        this.CATEGORYDM = CATEGORYDM;
    }

    public String getINSTITUDEDM() {
        return INSTITUDEDM;
    }

    public void setINSTITUDEDM(String INSTITUDEDM) {
        this.INSTITUDEDM = INSTITUDEDM;
    }

    public String getFEATURE() {
        return FEATURE;
    }

    public void setFEATURE(String FEATURE) {
        this.FEATURE = FEATURE;
    }

    public String getPATH() {
        return PATH;
    }

    public void setPATH(String PATH) {
        this.PATH = PATH;
    }

    public String getREFTYPE() {
        return REFTYPE;
    }

    public void setREFTYPE(String REFTYPE) {
        this.REFTYPE = REFTYPE;
    }

    public String getINTERVAL() {
        return INTERVAL;
    }

    public void setINTERVAL(String INTERVAL) {
        this.INTERVAL = INTERVAL;
    }

    public String getTIMEFORMAT() {
        return TIMEFORMAT;
    }

    public void setTIMEFORMAT(String TIMEFORMAT) {
        this.TIMEFORMAT = TIMEFORMAT;
    }
}
