package com.iset.hobbyapp.Services;

import com.iset.hobbyapp.entity.Group;
import com.iset.hobbyapp.entity.Hobby;
import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.repository.GroupRepository;
import com.iset.hobbyapp.repository.HobbyRepository;
import com.iset.hobbyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class HobbyService {
    @Autowired
    private HobbyRepository hobbyRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Hobby> getAll() {
        return hobbyRepository.findAll();
    }

    public List<Group> getGroupsByHobby(Long hobbyId) {
        return groupRepository.findByHobbyId(hobbyId);
    }
    
    public Hobby getHobbyById(Long id) {
        Optional<Hobby> hobby = hobbyRepository.findById(id);
        return hobby.orElse(null);
    }
    
    @Transactional
    public void joinHobby(User user, Hobby hobby) {
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (hobby == null) {
            throw new RuntimeException("Hobby not found");
        }
        if (!user.getHobbies().contains(hobby)) {
            user.getHobbies().add(hobby);
            userRepository.save(user);
        }
    }
}