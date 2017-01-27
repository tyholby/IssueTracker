package edu.byu.mtc.otm.models;

import java.util.Date;

public class Attachment {
    private String id;
    private String url;
    private String issueid;
    private Date attacheddate;
    private String filename;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIssueid() {
        return issueid;
    }

    public void setIssueid(String issueid) {
        this.issueid = issueid;
    }

    public Date getAttacheddate() {
        return attacheddate;
    }

    public void setAttacheddate(Date attacheddate) {
        this.attacheddate = attacheddate;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
