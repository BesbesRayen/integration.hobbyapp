package com.iset.hobbyapp.repository;

import com.iset.hobbyapp.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    // ✅ Add this custom query method
    List<Group> findByHobbyId(Long hobbyId);
}
