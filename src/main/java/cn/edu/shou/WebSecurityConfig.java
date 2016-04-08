package cn.edu.shou;

import cn.edu.shou.service.AuthoritiesRepository;
import cn.edu.shou.service.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.sql.DataSource;

/**
 * Created by Administrator on 2016/2/28.
 */
@Configuration
@EnableWebMvcSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private UserDAO userDao;
    @Autowired
    private AuthoritiesRepository authDao;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .permitAll()
                .and()
                .httpBasic();
        http.headers().frameOptions().disable();
    }
    @Autowired
    DataSource dataSource;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        BCryptPasswordEncoder bcpe = new BCryptPasswordEncoder();
        auth.userDetailsService(userDao);
        auth.jdbcAuthentication().dataSource(dataSource)
                .usersByUsernameQuery("select username,password,enabled from users where username=?")
                .authoritiesByUsernameQuery("select users.username,authorities.authority from authorities,users where authorities.user_id=users.id and users.username=?");
    }
    @Override
    public void configure(WebSecurity web) throws Exception {
        web
                .ignoring()
                .antMatchers("/default")
                .antMatchers("/*")
                .antMatchers("/new")
                .antMatchers("/select")
                .antMatchers("/data/**")
                .antMatchers("/front/**")
                .antMatchers("/assets/**")
                .antMatchers("/css/**")
                .antMatchers("/img/**")
                .antMatchers("/js/**")
                .antMatchers("/api/pad/login")
                .antMatchers("/missiveSign/missiveSignToPDF/**")
                .antMatchers("/missive/missivePublishToPDF/**")
                .antMatchers("/api/bgPng/**")
                .antMatchers("/api/**")
                .antMatchers("/dijit/**")
                .antMatchers("/FaxCable/static/**");
    }
}