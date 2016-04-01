package cn.edu.shou.domain.form;
/**
 * Created by Administrator on 2016/3/31.
 */
import lombok.Getter;
import lombok.Setter;


public class tbjhshipdataForm {
    @Setter
    @Getter
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
    private String obDate;//观测日期


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

    public String getObDate() {
        return obDate;
    }

    public void setObDate(String obDate) {
        this.obDate = obDate;
    }
}

