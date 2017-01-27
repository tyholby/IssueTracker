package edu.byu.mtc.otm.models;

import java.util.Date;

public class Issue {
    private String id;
    private String title;
    private String description;
    private Date duedate;
    private String assigneeid;
    private String statusid;
    private String createdbyid;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDuedate() {
        return duedate;
    }

    public void setDuedate(Date duedate) {
        this.duedate = duedate;
    }

    public String getAssigneeid() {
        return assigneeid;
    }

    public void setAssigneeid(String assigneeid) {
        this.assigneeid = assigneeid;
    }

    public String getStatusid() {
        return statusid;
    }

    public void setStatusid(String statusid) {
        this.statusid = statusid;
    }

    public String getCreatedbyid() {
        return createdbyid;
    }

    public void setCreatedbyid(String createdbyid) {
        this.createdbyid = createdbyid;
    }
}
