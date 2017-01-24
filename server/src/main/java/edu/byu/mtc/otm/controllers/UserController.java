package edu.byu.mtc.otm.controllers;

import edu.byu.mtc.otm.daos.*;
import edu.byu.mtc.otm.models.*;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@Controller
@RequestMapping("user")
public class UserController {

    @Inject
    @Named("UserDAO")
    private UserDAO userDAO;

    private @Autowired HttpServletRequest request;

    @RequestMapping(method= RequestMethod.GET)
    public @ResponseBody ResponseEntity<List<User>> getUsers() {
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) { //TODO are these the right roles??
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<User> users = userDAO.getUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.GET, value="/{id}")
    public @ResponseBody ResponseEntity<User> getUserById(@PathVariable String id) {
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        User user = userDAO.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.PUT)
    public @ResponseBody ResponseEntity<User> updateUser(@RequestBody User user){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        user = userDAO.updateUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.POST)
    public @ResponseBody ResponseEntity<User> createSingleUser(@RequestBody User user){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        User newUser = userDAO.createUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public @ResponseBody ResponseEntity<String> deleteUser(@PathVariable String id){
        if (request.getUserPrincipal() == null || (!request.isUserInRole("developer"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        id = userDAO.deleteUser(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
