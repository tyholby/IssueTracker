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
@RequestMapping("attachment")
public class AttachmentController {

    @Inject
    @Named("AttachmentDAO")
    private AttachmentDAO attachmentDAO;

    private @Autowired HttpServletRequest request;

    @RequestMapping(method=RequestMethod.GET, value="/{id}")
    public @ResponseBody ResponseEntity<List<Attachment>> getAttachmentsByIssueId(@PathVariable String id) {
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
//        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Attachment> attachments = attachmentDAO.getAttachmentsByIssueId(id);
        return new ResponseEntity<>(attachments, HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.PUT)
    public @ResponseBody ResponseEntity<List<Attachment>> updateAttachments(@RequestBody List<Attachment> attachments){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
//        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        attachments = attachmentDAO.updateAttachments(attachments);
        return new ResponseEntity<>(attachments, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.POST)
    public @ResponseBody ResponseEntity<List<Attachment>> createAttachments(@RequestBody List<Attachment> attachments){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
//        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Attachment> newAttachments = attachmentDAO.createAttachments(attachments);
        return new ResponseEntity<>(newAttachments, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public @ResponseBody ResponseEntity<String> deleteAttachment(@PathVariable String id){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
//        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        id = attachmentDAO.deleteAttachment(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
