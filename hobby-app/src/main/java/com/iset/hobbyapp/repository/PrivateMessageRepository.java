package com.iset.hobbyapp.repository;

import com.iset.hobbyapp.entity.PrivateMessage;
import com.iset.hobbyapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrivateMessageRepository extends JpaRepository<PrivateMessage, Long> {
    @Query("SELECT pm FROM PrivateMessage pm WHERE " +
           "(pm.sender = :user1 AND pm.recipient = :user2) OR " +
           "(pm.sender = :user2 AND pm.recipient = :user1) " +
           "ORDER BY pm.createdAt DESC")
    List<PrivateMessage> findConversation(@Param("user1") User user1, @Param("user2") User user2);
    
    List<PrivateMessage> findByRecipientOrderByCreatedAtDesc(User recipient);
}
