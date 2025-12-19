package com.iset.hobbyapp.dto;

import java.util.List;

public class GroupDTO {
    private Long id;
    private String name;
    private String description;
    private String location;
    private List<UserDTO> users;
    private HobbyDTO hobby;

    public GroupDTO() {}

    public GroupDTO(Long id, String name, String description, String location, List<UserDTO> users, HobbyDTO hobby) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.users = users;
        this.hobby = hobby;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public List<UserDTO> getUsers() { return users; }
    public void setUsers(List<UserDTO> users) { this.users = users; }
    public HobbyDTO getHobby() { return hobby; }
    public void setHobby(HobbyDTO hobby) { this.hobby = hobby; }
}
