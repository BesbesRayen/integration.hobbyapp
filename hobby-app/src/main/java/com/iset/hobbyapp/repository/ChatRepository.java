package com.iset.hobbyapp.repository;

import com.iset.hobbyapp.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT c FROM Chat c WHERE c.group.id = :groupId ORDER BY c.timestamp ASC")
    List<Chat> findByGroupIdOrderByTimestampAsc(@Param("groupId") Long groupId);
}