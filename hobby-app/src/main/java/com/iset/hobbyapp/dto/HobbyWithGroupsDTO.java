package com.iset.hobbyapp.dto;

import java.util.List;

public class HobbyWithGroupsDTO {
    private Long id;
    private String name;
    private String description;
    private List<GroupDTO> groups;

    public HobbyWithGroupsDTO() {}

    public HobbyWithGroupsDTO(Long id, String name, String description, List<GroupDTO> groups) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.groups = groups;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<GroupDTO> getGroups() { return groups; }
    public void setGroups(List<GroupDTO> groups) { this.groups = groups; }
}
