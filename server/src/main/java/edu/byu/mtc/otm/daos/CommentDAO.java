package edu.byu.mtc.otm.daos;

import edu.byu.mtc.otm.models.Comment;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import java.util.ArrayList;
import java.util.List;

public class CommentDAO extends NamedParameterJdbcDaoSupport {
    public List<Comment> getCommentsByIssueId(String issueid) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("issueid", issueid);
        String query = "SELECT c.id, c.issueid, c.authorid, c.text, c.timestamp, u.fullname as authorname " +
                "FROM comments c " +
                "LEFT JOIN users u " +
                "ON c.authorid = u.ldsid " +
                "WHERE issueid = :issueid " +
                "ORDER BY c.timestamp ASC ";
        List<Comment> comments = getNamedParameterJdbcTemplate().query(query, params, new BeanPropertyRowMapper<>(Comment.class));
        return comments;
    }

    public Comment getCommentById(String id) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", id);
        String sql = "SELECT id, issueid, authorid, text, timestamp FROM comments WHERE id = :id";
        List<Comment> comments = getNamedParameterJdbcTemplate().query(sql, params, new BeanPropertyRowMapper<>(Comment.class));
        if (comments.size() > 0) {
            return comments.get(0);
        }
        return null;
    }

    public Comment createComment(Comment comment) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(comment);

        //Set the id to the newly generated key
        String selectGeneratedKeySql = "SELECT commentsid_seq.nextval FROM dual";
        String generatedKey = getNamedParameterJdbcTemplate().queryForObject(selectGeneratedKeySql, params, String.class);
        comment.setId(generatedKey);

        String insertSql = "INSERT INTO comments " +
                "(id, issueid, authorid, text, timestamp) " +
                "VALUES (:id, :issueid, :authorid, :text, :timestamp ) ";
        getNamedParameterJdbcTemplate().update(insertSql, params);
        return comment;
    }

    public Comment updateComment(Comment comment) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(comment);
        String sql = "UPDATE comments SET id = :id, issueid = :issueid, authorid = :authorid, text = :text, timestamp = :timestamp WHERE id = :id";
        getNamedParameterJdbcTemplate().update(sql, params);
        return comment;
    }

    public String deleteComment(String id){
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id",id);
        String sql = "DELETE FROM comments WHERE id = :id";
        getNamedParameterJdbcTemplate().update(sql, params);
        return id;
    }
}
