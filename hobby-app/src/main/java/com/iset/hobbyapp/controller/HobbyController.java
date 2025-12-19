package com.iset.hobbyapp.controller;

import com.iset.hobbyapp.entity.Group;
import com.iset.hobbyapp.entity.Hobby;
import com.iset.hobbyapp.Services.HobbyService;
import com.iset.hobbyapp.Services.UserService;
import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.dto.GroupDTO;
import com.iset.hobbyapp.dto.UserDTO;
import com.iset.hobbyapp.dto.HobbyWithGroupsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hobbies")
public class HobbyController {

    private final HobbyService hobbyService;
    private final UserService userService;

    @Autowired
    public HobbyController(HobbyService hobbyService, UserService userService) {
        this.hobbyService = hobbyService;
        this.userService = userService;
    }

    // Convert Group to GroupDTO
    private GroupDTO convertGroupToDTO(Group group) {
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
        
        return dto;
    }

    // Convert Hobby to HobbyWithGroupsDTO
    private HobbyWithGroupsDTO convertHobbyToDTO(Hobby hobby) {
        List<GroupDTO> groupDTOs = hobby.getGroups() != null 
            ? hobby.getGroups().stream().map(this::convertGroupToDTO).collect(Collectors.toList())
            : List.of();
        
        return new HobbyWithGroupsDTO(hobby.getId(), hobby.getName(), hobby.getDescription(), groupDTOs);
    }

    @GetMapping
    public ResponseEntity<List<HobbyWithGroupsDTO>> getAllHobbies() {
        try {
            List<Hobby> hobbies = hobbyService.getAll();
            System.out.println("Fetched " + hobbies.size() + " hobbies");
            return ResponseEntity.ok(hobbies.stream().map(this::convertHobbyToDTO).collect(Collectors.toList()));
        } catch (Exception e) {
            System.err.println("Error fetching hobbies: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}/groups")
    public ResponseEntity<List<GroupDTO>> getGroupsByHobby(@PathVariable Long id) {
        try {
            List<Group> groups = hobbyService.getGroupsByHobby(id);
            List<GroupDTO> groupDTOs = groups.stream().map(this::convertGroupToDTO).collect(Collectors.toList());
            return ResponseEntity.ok(groupDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching groups: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/{id}/join/{userId}")
    public ResponseEntity<?> joinHobby(@PathVariable Long id, @PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            System.out.println("[DEBUG] User found: " + (user != null ? user.getEmail() : "null"));
            
            Hobby hobby = hobbyService.getHobbyById(id);
            System.out.println("[DEBUG] Hobby found: " + (hobby != null ? hobby.getName() : "null"));
            
            if (user == null || hobby == null) {
                System.out.println("[ERROR] User or hobby not found");
                return ResponseEntity.notFound().build();
            }
            
            hobbyService.joinHobby(user, hobby);
            return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
                put("message", "Successfully joined hobby");
                put("hobbyId", id.toString());
            }});
        } catch (Exception e) {
            System.err.println("Error joining hobby: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new java.util.HashMap<String, String>() {{
                put("error", e.getMessage());
            }});
        }
    }
}
