package com.iset.hobbyapp.Services;

import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.entity.FriendRequest;
import com.iset.hobbyapp.repository.UserRepository;
import com.iset.hobbyapp.repository.FriendRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FriendsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    

    @Transactional
    public FriendRequest sendFriendRequest(User sender, Long receiverId) {
        if (sender == null || sender.getId() == null) {
            throw new RuntimeException("Sender user not found or not authenticated");
        }
        
        User receiver = userRepository.findById(receiverId).orElse(null);
        if (receiver == null) {
            throw new RuntimeException("User not found");
        }
        
        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Cannot send friend request to yourself");
        }
        
        // Check if request already exists in either direction
        boolean pendingFromSender = friendRequestRepository.existsBySenderAndReceiverAndStatus(sender, receiver, "PENDING");
        boolean pendingFromReceiver = friendRequestRepository.existsBySenderAndReceiverAndStatus(receiver, sender, "PENDING");
        
        if (pendingFromSender) {
            throw new RuntimeException("You already sent a friend request to this user");
        }
        
        if (pendingFromReceiver) {
            throw new RuntimeException("This user already sent you a friend request");
        }
        
        // Check if there's a REMOVED request
        var removedFromSender = friendRequestRepository.findBySenderAndReceiverAndStatus(sender, receiver, "REMOVED");
        if (removedFromSender.isPresent()) {
            FriendRequest removedReq = removedFromSender.get();
            removedReq.setStatus("PENDING");
            return friendRequestRepository.save(removedReq);
        }
        
        var removedFromReceiver = friendRequestRepository.findBySenderAndReceiverAndStatus(receiver, sender, "REMOVED");
        if (removedFromReceiver.isPresent()) {
            FriendRequest removedReq = removedFromReceiver.get();
            removedReq.setStatus("PENDING");
            return friendRequestRepository.save(removedReq);
        }
        
        // Check if already friends -
        boolean acceptedFromSender = friendRequestRepository.existsBySenderAndReceiverAndStatus(sender, receiver, "ACCEPTED");
        boolean acceptedFromReceiver = friendRequestRepository.existsBySenderAndReceiverAndStatus(receiver, sender, "ACCEPTED");
        
        if (acceptedFromSender || acceptedFromReceiver) {
            throw new RuntimeException("Already friends with this user");
        }
        
        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("PENDING");
        
        return friendRequestRepository.save(request);
    }
    

    @Transactional(readOnly = true)
    public List<FriendRequest> getPendingFriendRequests(User user) {
        return friendRequestRepository.findByReceiverAndStatus(user, "PENDING");
    }
    

    @Transactional
    public void acceptFriendRequest(Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        User sender = request.getSender();
        User receiver = request.getReceiver();
        

        sender.getFriends().add(receiver);
        receiver.getFriends().add(sender);
        
        request.setStatus("ACCEPTED");
        
        userRepository.save(sender);
        userRepository.save(receiver);
        friendRequestRepository.save(request);
    }
    

    @Transactional
    public void rejectFriendRequest(Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        request.setStatus("REJECTED");
        friendRequestRepository.save(request);
    }
    
    @Transactional
    public void removeFriend(User user, Long friendId) {
        User friend = userRepository.findById(friendId).orElse(null);
        if (friend == null) {
            throw new RuntimeException("Friend not found");
        }
        if (user.getFriends().contains(friend)) {
            user.getFriends().remove(friend);
            friend.getFriends().remove(user);
            userRepository.save(user);
            userRepository.save(friend);

            // Also update the FriendRequest status to REMOVED so a new request can be sent
            friendRequestRepository.findBySenderAndReceiverAndStatus(user, friend, "ACCEPTED")
                    .ifPresent(req -> {
                        req.setStatus("REMOVED");
                        friendRequestRepository.save(req);
                    });
            
            friendRequestRepository.findBySenderAndReceiverAndStatus(friend, user, "ACCEPTED")
                    .ifPresent(req -> {
                        req.setStatus("REMOVED");
                        friendRequestRepository.save(req);
                    });
        }
    }
    
    @Transactional
    public List<User> getFriendsWithCommonHobbies(User user) {
        return user.getFriends().stream()
                .filter(friend -> hasCommonHobbies(user, friend))
                .collect(Collectors.toList());
    }
    
    private boolean hasCommonHobbies(User user1, User user2) {
        Set<Long> hobbies1 = user1.getHobbies().stream()
                .map(h -> h.getId())
                .collect(Collectors.toSet());
        
        return user2.getHobbies().stream()
                .anyMatch(h -> hobbies1.contains(h.getId()));
    }
    
    @Transactional
    public boolean areFriends(User user1, Long user2Id) {
        return user1.getFriends().stream()
                .anyMatch(f -> f.getId().equals(user2Id));
    }
}
