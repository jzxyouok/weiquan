package cn.edu.shou;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.nio.charset.Charset;
import java.util.List;

/**
 * Created by Administrator on 2016/2/28.
 */
@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addViewControllers(ViewControllerRegistry registry){
           //registry.addViewController("/index").setViewName("index");
           registry.addViewController("/").setViewName("default");
           registry.addViewController("/select").setViewName("select");
           registry.addViewController("/new").setViewName("new");
           registry.addViewController("/login").setViewName("login");
       }
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters){
        converters.add(new StringHttpMessageConverter(Charset.forName("utf-8")));
        super.configureMessageConverters(converters);
    }
}
