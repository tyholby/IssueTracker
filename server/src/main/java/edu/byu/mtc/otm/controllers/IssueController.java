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
    @Named("IssueDAO")
    private IssueDAO issueDAO;

    private @Autowired HttpServletRequest request;

    @RequestMapping(method= RequestMethod.GET)
    public @ResponseBody ResponseEntity<List<Issue>> getIssues() {
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) { //TODO are these the right roles??
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Issue> issues = issueDAO.getIssues();
        return new ResponseEntity<>(issues, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.GET, value="/{id}")
    public @ResponseBody ResponseEntity<Issue> getIssueById(@PathVariable String id) {
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Issue issue = issueDAO.getIssueById(id);
        return new ResponseEntity<>(issue, HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.PUT)
    public @ResponseBody ResponseEntity<List<Issue>> updateIssues(@RequestBody List<Issue> issues){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        issues = issueDAO.updateIssues(issues);
        return new ResponseEntity<>(issues, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.POST)
    public @ResponseBody ResponseEntity<Issue> createSingleIssue(@RequestBody Issue issue){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
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
        Issue newIssue = issueDAO.createIssue(issue);
        return new ResponseEntity<>(newIssue, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public @ResponseBody ResponseEntity<String> deleteIssue(@PathVariable String id){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        id = issueDAO.deleteIssue(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
