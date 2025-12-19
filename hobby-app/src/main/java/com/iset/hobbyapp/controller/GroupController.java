package com.iset.hobbyapp.controller;

import com.iset.hobbyapp.entity.Group;
import com.iset.hobbyapp.Services.GroupService;
import com.iset.hobbyapp.Services.UserService;
import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.dto.GroupDTO;
import com.iset.hobbyapp.dto.UserDTO;
import com.iset.hobbyapp.dto.HobbyDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;
    private final UserService userService;

    @Autowired
    public GroupController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    // Convert Group to GroupDTO to prevent circular references
    private GroupDTO convertToDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setLocation(group.getLocation());
        
        if (group.getUsers() != null) {
            dto.setUsers(group.getUsers().stream()
                .map(u -> new UserDTO(u.getId(), u.getEmail(), u.getName(), u.getBio(), u.getPhone()))
                .collect(Collectors.toList()));
        }
        
        if (group.getHobby() != null) {
            dto.setHobby(new HobbyDTO(group.getHobby().getId(), group.getHobby().getName(), group.getHobby().getDescription()));
        }
        
        return dto;
    }

    // 🔹 Get all groups
    @GetMapping
    public List<GroupDTO> getAllGroups() {
        return groupService.getAllGroups().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // 🔹 Get a group by ID
    @GetMapping("/{id}")
    public GroupDTO getGroupById(@PathVariable Long id) {
        return convertToDTO(groupService.getGroupById(id));
    }

    // 🔹 Create a new group
    @PostMapping
    public GroupDTO createGroup(@RequestBody Group group) {
        return convertToDTO(groupService.createGroup(group));
    }

    // 🔹 Update an existing group
    @PutMapping("/{id}")
    public GroupDTO updateGroup(@PathVariable Long id, @RequestBody Group group) {
        return convertToDTO(groupService.updateGroup(id, group));
    }

    // 🔹 Delete a group
    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
    }
    
    // 🔹 Join a group
    @PostMapping("/{id}/join/{userId}")
    public ResponseEntity<?> joinGroup(@PathVariable Long id, @PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            Group group = groupService.getGroupById(id);
            
            if (user == null || group == null) {
                return ResponseEntity.notFound().build();
            }
            
            groupService.joinGroup(user, group);
            return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
                put("message", "Successfully joined group");
                put("groupId", id.toString());
            }});
        } catch (Exception e) {
            System.err.println("Error joining group: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new java.util.HashMap<String, String>() {{
                put("error", e.getMessage());
            }});
        }
    }
    
    // 🔹 Leave a group
    @DeleteMapping("/{id}/leave/{userId}")
    public ResponseEntity<?> leaveGroup(@PathVariable Long id, @PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            Group group = groupService.getGroupById(id);
            
            if (user == null || group == null) {
                return ResponseEntity.notFound().build();
            }
            
            groupService.leaveGroup(user, group);
            return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
                put("message", "Successfully left group");
                put("groupId", id.toString());
            }});
        } catch (Exception e) {
            System.err.println("Error leaving group: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new java.util.HashMap<String, String>() {{
                put("error", e.getMessage());
            }});
        }
    }
}
