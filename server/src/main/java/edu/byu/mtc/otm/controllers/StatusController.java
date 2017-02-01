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
@RequestMapping("status")
public class StatusController {

    @Inject
    @Named("StatusDAO")
    private StatusDAO statusDAO;

    @Inject
    @Named("IssueDAO")
    private IssueDAO issueDAO;

    private @Autowired HttpServletRequest request;

    @RequestMapping(method= RequestMethod.GET)
    public @ResponseBody ResponseEntity<List<Status>> getStatuses() {
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Status> statuses = statusDAO.getStatuses();
        return new ResponseEntity<>(statuses, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.GET, value="/{id}")
    public @ResponseBody ResponseEntity<Status> getStatusById(@PathVariable String id) {
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Status status = statusDAO.getStatusById(id);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.PUT)
    public @ResponseBody ResponseEntity<List<Status>> updateStatuses(@RequestBody List<Status> statuses){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        statuses = statusDAO.updateStatuses(statuses);
        return new ResponseEntity<>(statuses, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.PUT, value="/move")
    public @ResponseBody ResponseEntity<String> moveStatusIssues(@RequestBody MoveStatusInstruction moveStatusInstruction){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String id = statusDAO.deleteStatus(moveStatusInstruction.getId());
        issueDAO.moveIssuesToStatus(moveStatusInstruction);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.POST)
    public @ResponseBody ResponseEntity<Status> createSingleStatus(@RequestBody Status status){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Status newStatus = statusDAO.createStatus(status);
        return new ResponseEntity<>(newStatus, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public @ResponseBody ResponseEntity<String> deleteStatus(@PathVariable String id){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        id = statusDAO.deleteStatus(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
