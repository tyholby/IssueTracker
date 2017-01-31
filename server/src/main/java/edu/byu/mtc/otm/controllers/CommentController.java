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
@RequestMapping("comment")
public class CommentController {

    @Inject
    @Named("CommentDAO")
    private CommentDAO commentDAO;

    @Inject
    @Named("UserDAO")
    private UserDAO userDAO;

    private @Autowired HttpServletRequest request;

    @RequestMapping(method=RequestMethod.GET, value="/{id}")
    public @ResponseBody ResponseEntity<List<Comment>> getCommentsByIssueId(@PathVariable String id) {
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Comment> comments = commentDAO.getCommentsByIssueId(id);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.PUT)
    public @ResponseBody ResponseEntity<Comment> updateComment(@RequestBody Comment comment){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        comment = commentDAO.updateComment(comment);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.POST)
    public @ResponseBody ResponseEntity<Comment> createComment(@RequestBody Comment comment){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Comment newComment = commentDAO.createComment(comment);
        comment.setAuthorname(userDAO.getUserById(comment.getAuthorid()).getFullName());
        return new ResponseEntity<>(newComment, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public @ResponseBody ResponseEntity<String> deleteComment(@PathVariable String id){
//        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
        if (request.getUserPrincipal() == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        id = commentDAO.deleteComment(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
