package com.iset.hobbyapp.controller;

import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.entity.FriendRequest;
import com.iset.hobbyapp.Services.FriendsService;
import com.iset.hobbyapp.Services.UserService;
import com.iset.hobbyapp.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/friends")
public class FriendsController {
    
    @Autowired
    private FriendsService friendsService;
    
    @Autowired
    private UserService userService;
    
    // Get all friends for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserDTO>> getFriends(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(404).build();
            }
            List<UserDTO> friends = user.getFriends().stream()
                    .map(f -> new UserDTO(f.getId(), f.getEmail(), f.getName(), f.getBio(), f.getPhone()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            System.err.println("Error fetching friends: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    // Get pending friend requests for a user
    @GetMapping("/{userId}/requests/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(404).build();
            }
            
            List<FriendRequest> requests = friendsService.getPendingFriendRequests(user);
            List<Map<String, Object>> response = requests.stream().map(req -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", req.getId());
                map.put("sender", new UserDTO(
                        req.getSender().getId(),
                        req.getSender().getEmail(),
                        req.getSender().getName(),
                        req.getSender().getBio(),
                        req.getSender().getPhone()
                ));
                map.put("createdAt", req.getCreatedAt());
                return map;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    // Send a friend request
    @PostMapping("/{userId}/{friendId}/request")
    public ResponseEntity<Map<String, Object>> sendFriendRequest(
            @PathVariable Long userId,
            @PathVariable Long friendId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(404).body(new HashMap<String, Object>() {{
                    put("error", "User not found");
                }});
            }
            
            FriendRequest request = friendsService.sendFriendRequest(user, friendId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Friend request sent successfully");
            response.put("requestId", request.getId());
            response.put("status", request.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Friend request error: " + e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            
            // Return 400 for validation errors like "already friends"
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            System.err.println("Unexpected error in friend request: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to send friend request: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    // Accept a friend request
    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<Map<String, String>> acceptFriendRequest(@PathVariable Long requestId) {
        try {
            friendsService.acceptFriendRequest(requestId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Friend request accepted");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }
    
    // Reject a friend request
    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<Map<String, String>> rejectFriendRequest(@PathVariable Long requestId) {
        try {
            friendsService.rejectFriendRequest(requestId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Friend request rejected");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }
    
    // Get friends with common hobbies
    @GetMapping("/{userId}/common-hobbies")
    public ResponseEntity<List<UserDTO>> getFriendsWithCommonHobbies(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(404).build();
            }
            List<UserDTO> friends = friendsService.getFriendsWithCommonHobbies(user).stream()
                    .map(f -> new UserDTO(f.getId(), f.getEmail(), f.getName(), f.getBio(), f.getPhone()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    // Remove a friend
    @DeleteMapping("/{userId}/{friendId}")
    public ResponseEntity<Map<String, String>> removeFriend(
            @PathVariable Long userId,
            @PathVariable Long friendId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                return ResponseEntity.status(404).body(error);
            }
            friendsService.removeFriend(user, friendId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Friend removed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    // Check if users are friends
    @GetMapping("/{userId}/check/{friendId}")
    public ResponseEntity<Boolean> areFriends(
            @PathVariable Long userId,
            @PathVariable Long friendId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(404).build();
            }
            boolean friends = friendsService.areFriends(user, friendId);
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
