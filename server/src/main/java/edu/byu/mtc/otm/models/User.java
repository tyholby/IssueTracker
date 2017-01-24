package edu.byu.mtc.otm.models;

public class User {
    private String ldsid;
    private String role;
    private String fullName;


    public String getLdsid() {
        return ldsid;
    }

    public void setLdsid(String ldsid) {
        this.ldsid = ldsid;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
