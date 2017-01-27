package edu.byu.mtc.otm.daos;

import edu.byu.mtc.otm.models.Issue;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import java.util.List;

public class IssueDAO extends NamedParameterJdbcDaoSupport {

    public List<Issue> getIssues() {
        String query = "SELECT iss.id, iss.title, iss.description, iss.duedate, iss.assigneeid, iss.statusid, iss.createdbyid " +
                "FROM issue iss " +
                "INNER JOIN status sta " +
                "ON iss.statusid = sta.id " +
                "INNER JOIN users us " +
                "ON us.ldsid = iss.assigneeid";
        List<Issue> issues = getNamedParameterJdbcTemplate().query(query, new BeanPropertyRowMapper<>(Issue.class));
        return issues;
    }

    public Issue getIssueById(String id) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", id);
        String sql = "SELECT id, title, description, duedate, assigneeid, statusid, createdbyid FROM issue WHERE id = :id";
        List<Issue> issues = getNamedParameterJdbcTemplate().query(sql, params, new BeanPropertyRowMapper<>(Issue.class));
        if (issues.size() > 0) {
            return issues.get(0);
        }
        return null;
    }

    public Issue createIssue(Issue issue) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(issue);

        //Set the id to the newly generated key
        String selectGeneratedKeySql = "SELECT issueid_seq.nextval FROM dual";
        String generatedKey = getNamedParameterJdbcTemplate().queryForObject(selectGeneratedKeySql, params, String.class);
        issue.setId(generatedKey);

        String insertSql = "INSERT INTO issue " +
                "(id, title, description, duedate, assigneeid, statusid, createdbyid) " +
                "VALUES (:id, :title, :description, :duedate, :assigneeid, :statusid, :createdbyid) ";
        getNamedParameterJdbcTemplate().update(insertSql, params);
        return issue;
    }

    public List<Issue> updateIssues(List<Issue> issues) {
        if (issues.size() > 0) {
            for(Issue i : issues) {
                updateIssue(i);
            }
        }
        return issues;
    }

    public Issue updateIssue(Issue issue) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(issue);
        String sql = "UPDATE issue SET title = :title, description = :description, duedate = :duedate, assigneeid = :assigneeid, statusid = :statusid, createdbyid = :createdbyid WHERE id = :id";
        getNamedParameterJdbcTemplate().update(sql, params);
        return issue;
    }

    public String deleteIssue(String id){
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id",id);
        String sql = "DELETE FROM issue WHERE id = :id";
        getNamedParameterJdbcTemplate().update(sql, params);
        return id;
    }
}
