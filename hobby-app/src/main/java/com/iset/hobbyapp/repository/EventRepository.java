package com.iset.hobbyapp.repository;

import com.iset.hobbyapp.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // ✅ Custom method to find events by group ID
    List<Event> findByGroupId(Long groupId);
}
