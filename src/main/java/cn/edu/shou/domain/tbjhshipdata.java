package cn.edu.shou.domain;

import cn.edu.shou.domain.tbjhship;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * Created by seky on 16/3/25.
 */
@Entity
@Table(name = "tbjhshipdata")
public class tbjhshipdata {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter @Getter
    private int id;
    @Setter @Getter
    private float windspeed;//风速
    @Setter @Getter
    private float winddir;//方向
    @Setter @Getter
    private float cwindspeed;//c风速
    @Setter @Getter
    private float cwinddir;//c风向

    @Setter @Getter
    private float watertemp;//水温
    @Setter @Getter
    private float airpressure;//气压
    @Setter @Getter
    private String dates;//日期

    @Setter @Getter
    private  String obminute;//字段切割

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "tbjhshipid")
    @JsonManagedReference
    public cn.edu.shou.domain.tbjhship tbjhship;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float getWindspeed() {
        return windspeed;
    }

    public void setWindspeed(float windspeed) {
        this.windspeed = windspeed;
    }

    public float getWinddir() {
        return winddir;
    }

    public void setWinddir(float winddir) {
        this.winddir = winddir;
    }

    public float getCwindspeed() {
        return cwindspeed;
    }

    public void setCwindspeed(float cwindspeed) {
        this.cwindspeed = cwindspeed;
    }

    public float getCwinddir() {
        return cwinddir;
    }

    public void setCwinddir(float cwinddir) {
        this.cwinddir = cwinddir;
    }

    public float getWatertemp() {
        return watertemp;
    }

    public void setWatertemp(float watertemp) {
        this.watertemp = watertemp;
    }


    public float getAirpressure() {
        return airpressure;
    }

    public void setAirpressure(float airpressure) {
        this.airpressure = airpressure;
    }

    public tbjhship getTbjhship() {
        return tbjhship;
    }

    public void setTbjhship(tbjhship tbjhship) {
        this.tbjhship = tbjhship;
    }

    public String getDates() {
        return dates;
    }

    public void setDates(String dates) {
        this.dates = dates;
    }

    public String getObminute() {
        return obminute;
    }

    public void setObminute(String obminute) {
        this.obminute = obminute;
    }
}
