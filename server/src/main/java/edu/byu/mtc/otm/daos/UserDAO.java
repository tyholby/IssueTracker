package edu.byu.mtc.otm.daos;

import edu.byu.mtc.otm.models.User;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import java.util.List;

public class UserDAO extends NamedParameterJdbcDaoSupport {

    public List<User> getUsers() {
        String query = "SELECT ldsid, role, fullname as fullName FROM users";
        List<User> users = getNamedParameterJdbcTemplate().query(query, new BeanPropertyRowMapper<>(User.class));
        return users;
    }

    public User getUserById(String ldsid) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("ldsid", ldsid);
        String sql = "SELECT ldsid, role, fullname as fullName FROM users WHERE ldsid = :ldsid";
        List<User> users = getNamedParameterJdbcTemplate().query(sql, params, new BeanPropertyRowMapper<>(User.class));
        if (users.size() > 0) {
            return users.get(0);
        }
        return null;
    }

    public User createUser(User user) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(user);
        String insertSql = "INSERT INTO users " +
                "(ldsid, role, fullname) " +
                "VALUES (:ldsid, :role, :fullName) ";
        getNamedParameterJdbcTemplate().update(insertSql, params);
        return user;
    }

    public User updateUser(User user) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(user);
        String sql = "UPDATE users SET role = :role, fullname = :fullName WHERE ldsid = :ldsid";
        getNamedParameterJdbcTemplate().update(sql, params);
        return user;
    }

    public String deleteUser(String ldsid){
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("ldsid",ldsid);
        String sql = "DELETE FROM users WHERE ldsid = :ldsid";
        getNamedParameterJdbcTemplate().update(sql, params);
        return ldsid;
    }
}
