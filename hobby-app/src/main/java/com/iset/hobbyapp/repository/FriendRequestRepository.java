package com.iset.hobbyapp.repository;

import com.iset.hobbyapp.entity.FriendRequest;
import com.iset.hobbyapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    
    // Find pending requests for a user
    List<FriendRequest> findByReceiverAndStatus(User receiver, String status);
    
    // Find request between two users
    Optional<FriendRequest> findBySenderAndReceiverAndStatus(User sender, User receiver, String status);
    
    // Check if request exists
    boolean existsBySenderAndReceiverAndStatus(User sender, User receiver, String status);
}
