package cn.edu.shou.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;
import org.joda.time.DateTime;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by seky on 16/3/25.
 */
@Entity
@Table(name = "tbjhship")
public class tbjhship {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter @Getter
    private int id;
    @Setter @Getter
    private String shipid;//船编号
    @Setter @Getter
    private Timestamp obdate;//观测日期
    @Setter @Getter
    private float lat;//纬度
    @Setter @Getter
    private float lon;//经度

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getShipid() {
        return shipid;
    }

    public void setShipid(String shipid) {
        this.shipid = shipid;
}

    public Timestamp getObdate() {
        return obdate;
    }

    public void setObdate(Timestamp obdate) {
        this.obdate = obdate;
    }

    public float getLat() {
        return lat;
    }

    public void setLat(float lat) {
        this.lat = lat;
    }

    public float getLon() {
        return lon;
    }

    public void setLon(float lon) {
        this.lon = lon;
    }
}
