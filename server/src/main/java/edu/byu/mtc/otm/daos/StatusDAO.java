package edu.byu.mtc.otm.daos;

import edu.byu.mtc.otm.models.Status;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import java.util.List;

public class StatusDAO extends NamedParameterJdbcDaoSupport {

    public List<Status> getStatuses() {
        String query = "SELECT id, description, ordernum FROM status ORDER BY ordernum";
        List<Status> statuses = getNamedParameterJdbcTemplate().query(query, new BeanPropertyRowMapper<>(Status.class));
        return statuses;
    }

    public Status getStatusById(String id) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", id);
        String sql = "SELECT id, description, ordernum FROM status WHERE id = :id";
        List<Status> statuses = getNamedParameterJdbcTemplate().query(sql, params, new BeanPropertyRowMapper<>(Status.class));
        if (statuses.size() > 0) {
            return statuses.get(0);
        }
        return null;
    }

    public Status createStatus(Status status) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(status);

        //Set the id to the newly generated key
        String selectGeneratedKeySql = "SELECT statusid_seq.nextval FROM dual";
        String generatedKey = getNamedParameterJdbcTemplate().queryForObject(selectGeneratedKeySql, params, String.class);
        status.setId(generatedKey);

        String insertSql = "INSERT INTO status " +
                "(id, description, ordernum) " +
                "VALUES (:id, :description, :ordernum) ";
        getNamedParameterJdbcTemplate().update(insertSql, params);
        return status;
    }

    public Status updateStatus(Status status) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(status);
        String sql = "UPDATE status SET description = :description, ordernum = :ordernum WHERE id = :id";
        getNamedParameterJdbcTemplate().update(sql, params);
        return status;
    }

    public String deleteStatus(String id){
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id",id);
        String sql = "DELETE FROM status WHERE id = :id";
        getNamedParameterJdbcTemplate().update(sql, params);
        return id;
    }
}
