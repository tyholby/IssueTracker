package edu.byu.mtc.otm.daos;

import edu.byu.mtc.otm.models.Attachment;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import java.util.ArrayList;
import java.util.List;

public class AttachmentDAO extends NamedParameterJdbcDaoSupport {

    public List<Attachment> getAttachmentsByIssueId(String issueid) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("issueid", issueid);
        String query = "SELECT id, url, issueid, attacheddate, filename FROM attachments WHERE issueid = :issueid";
        List<Attachment> attachments = getNamedParameterJdbcTemplate().query(query, params, new BeanPropertyRowMapper<>(Attachment.class));
        return attachments;
    }

    public Attachment getAttachmentById(String id) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", id);
        String sql = "SELECT id, url, issueid, attacheddate, filename FROM attachments WHERE id = :id";
        List<Attachment> attachments = getNamedParameterJdbcTemplate().query(sql, params, new BeanPropertyRowMapper<>(Attachment.class));
        if (attachments.size() > 0) {
            return attachments.get(0);
        }
        return null;
    }

    public List<Attachment> createAttachments(List<Attachment> attachments) {
        List<Attachment> newAttachments = new ArrayList<>();
        for (Attachment attachment : attachments) {
            newAttachments.add(createAttachment(attachment));
        }
        return newAttachments;
    }

    public Attachment createAttachment(Attachment attachment) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(attachment);

        //Set the id to the newly generated key
        String selectGeneratedKeySql = "SELECT attachmentsid_seq.nextval FROM dual";
        String generatedKey = getNamedParameterJdbcTemplate().queryForObject(selectGeneratedKeySql, params, String.class);
        attachment.setId(generatedKey);

        String insertSql = "INSERT INTO attachments " +
                "(id, url, issueid, attacheddate, filename) " +
                "VALUES (:id, :url, :issueid, :attacheddate, :filename ) ";
        getNamedParameterJdbcTemplate().update(insertSql, params);
        return attachment;
    }

    public List<Attachment> updateAttachments(List<Attachment> attachments) {
        if (attachments.size() > 0) {
            for(Attachment i : attachments) {
                updateAttachment(i);
            }
        }
        return attachments;
    }

    public Attachment updateAttachment(Attachment attachment) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(attachment);
        String sql = "UPDATE attachments SET id = :id, url = :url, issueid = :issueid, attacheddate = :attacheddate, filename = :filename WHERE id = :id";
        getNamedParameterJdbcTemplate().update(sql, params);
        return attachment;
    }

    public String deleteAttachment(String id){
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id",id);
        String sql = "DELETE FROM attachments WHERE id = :id";
        getNamedParameterJdbcTemplate().update(sql, params);
        return id;
    }
}
