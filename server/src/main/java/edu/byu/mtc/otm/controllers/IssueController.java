package edu.byu.mtc.otm.controllers;

import edu.byu.mtc.otm.daos.*;
import edu.byu.mtc.otm.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("issue")
public class IssueController {

    @Inject
    @Named("StatusDAO")
    private StatusDAO statusDAO;

    @Inject
    @Named("AttachmentDAO")
    private AttachmentDAO attachmentDAO;

    @Inject
    @Named("UserDAO")
    private UserDAO userDAO;

    @Inject
    @Named("CommentDAO")
    private CommentDAO commentDAO;

    @Inject
    @Named("IssueDAO")
    private IssueDAO issueDAO;

    private @Autowired HttpServletRequest request;

    @RequestMapping(method= RequestMethod.GET)
    public @ResponseBody ResponseEntity<List<Issue>> getIssues() {
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Issue> issues = issueDAO.getIssues();
        return new ResponseEntity<>(issues, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.GET, value="/bystatus/{id}")
    public @ResponseBody ResponseEntity<List<Issue>> getIssuesByStatus(@PathVariable String id) {
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Issue> issues = issueDAO.getIssuesByStatus(id);
        return new ResponseEntity<>(issues, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.GET, value="/{id}")
    public @ResponseBody ResponseEntity<IssueDetails> getIssueDetailsById(@PathVariable String id) {
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        IssueDetails issueDetails = new IssueDetails();
        Issue issue = issueDAO.getIssueById(id);
        Status status = statusDAO.getStatusById(issue.getStatusid());
        User createdBy = userDAO.getUserById(issue.getCreatedbyid());
        User assignee = userDAO.getUserById(issue.getAssigneeid());
        List<Attachment> attachments = attachmentDAO.getAttachmentsByIssueId(id);
        List<Comment> comments = commentDAO.getCommentsByIssueId(id);

        issueDetails.setId(issue.getId());
        issueDetails.setTitle(issue.getTitle());
        issueDetails.setDescription(issue.getDescription());
        issueDetails.setDuedate(issue.getDuedate());
        issueDetails.setCreatedBy(createdBy);
        issueDetails.setAssignee(assignee);
        issueDetails.setAttachments(attachments);
        issueDetails.setStatus(status);
        issueDetails.setComments(comments);
        return new ResponseEntity<>(issueDetails, HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.PUT)
    public @ResponseBody ResponseEntity<List<Issue>> updateIssues(@RequestBody List<Issue> issues){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        issues = issueDAO.updateIssues(issues);
        return new ResponseEntity<>(issues, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.POST)
    public @ResponseBody ResponseEntity<Issue> createSingleIssue(@RequestBody Issue issue){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (issue.getStatusid().length() == 0) {
            List<Status> statuses = statusDAO.getStatuses();
            if (statuses.size() > 0) {
                issue.setStatusid(statuses.get(0).getId());
            }
            else {
                Status status = new Status();
                status.setId(null);
                status.setDescription("TODO");
                status.setOrdernum("1");
                status = statusDAO.createStatus(status);
                issue.setStatusid(status.getId());
            }
        }
        Issue newIssue = issueDAO.createIssue(issue);
        return new ResponseEntity<>(newIssue, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public @ResponseBody ResponseEntity<String> deleteIssue(@PathVariable String id){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        id = issueDAO.deleteIssue(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
