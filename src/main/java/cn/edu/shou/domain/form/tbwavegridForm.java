package cn.edu.shou.domain.form;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by Administrator on 2016/4/1.
 * ID, WAVEHEIGHT, WAVEDIR, WAVECYC, PUBLISHDATE, PERIOD, GRIDID
 */
@Entity
@Table(name = "tbwavegrid")
public class tbwavegridForm {
    @Id
    @Setter @Getter
    private int ID;
    @Setter @Getter
    private float waveheight;
    @Setter @Getter
    private float wavedir;
    @Setter @Getter
    private float wavecyc;
    @Setter @Getter
    private String publishdate;
    @Setter @Getter
    private int period;
    @Setter @Getter
    private int gridid;

    public int getID() {
        return ID;
    }
    public void setID(int ID) {
        this.ID = ID;
    }

    public float getWaveheight() {
        return waveheight;
    }

    public void setWaveheight(float waveheight) {
        this.waveheight = waveheight;
    }

    public float getWavedir() {
        return wavedir;
    }

    public void setWavedir(float wavedir) {
        this.wavedir = wavedir;
    }

    public float getWavecyc() {
        return wavecyc;
    }

    public void setWavecyc(float wavecyc) {
        this.wavecyc = wavecyc;
    }

    public String getPublishdate() {
        return publishdate;
    }

    public void setPublishdate(String publishdate) {
        this.publishdate = publishdate;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }

    public int getGridid() {
        return gridid;
    }

    public void setGridid(int gridid) {
        this.gridid = gridid;
    }
}
