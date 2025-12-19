package com.iset.hobbyapp.Services;

import com.iset.hobbyapp.entity.Group;
import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.repository.GroupRepository;
import com.iset.hobbyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group getGroupById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + id));
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public Group updateGroup(Long id, Group group) {
        Group existingGroup = getGroupById(id);
        existingGroup.setName(group.getName());
        existingGroup.setDescription(group.getDescription());
        existingGroup.setLocation(group.getLocation());
        existingGroup.setHobby(group.getHobby());
        return groupRepository.save(existingGroup);
    }

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }
    
    @Transactional
    public void joinGroup(User user, Group group) {
        if (!group.getUsers().contains(user)) {
            group.getUsers().add(user);
            user.getGroups().add(group);
            groupRepository.save(group);
            userRepository.save(user);
        }
    }
    
    @Transactional
    public void leaveGroup(User user, Group group) {
        if (group.getUsers().contains(user)) {
            group.getUsers().remove(user);
            user.getGroups().remove(group);
            groupRepository.save(group);
            userRepository.save(user);
        }
    }
}
