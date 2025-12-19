package com.iset.hobbyapp.controller;

import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/user")

public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
    
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestParam(required = false) Long userId) {
        try {
            if (userId == null || userId <= 0) {
                System.err.println("[UserController] getCurrentUser called without valid userId");
                return ResponseEntity.badRequest().build();
            }
            User user = userService.getUserById(userId);
            if (user == null) {
                System.err.println("[UserController] User not found with ID: " + userId);
                return ResponseEntity.notFound().build();
            }
            System.out.println("[UserController] getCurrentUser returning user: " + user.getName() + " (ID: " + user.getId() + ")");
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.err.println("[UserController] Error fetching current user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            if (userDetails.getName() != null) user.setName(userDetails.getName());
            if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
            if (userDetails.getBio() != null) user.setBio(userDetails.getBio());
            if (userDetails.getPhone() != null) user.setPhone(userDetails.getPhone());
            
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
