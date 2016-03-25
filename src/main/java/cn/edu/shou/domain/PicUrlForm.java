package cn.edu.shou.domain;

/**
 * Created by Administrator on 2016/2/28.
 */
public class PicUrlForm {
    private int picId;
    private String url;//图片地址   地址加名称
    private String picName;//图片名称

    public int getPicId() {
        return picId;
    }

    public void setPicId(int picId) {
        this.picId = picId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPicName() {
        return picName;
    }

    public void setPicName(String picName) {
        this.picName = picName;
    }
}
