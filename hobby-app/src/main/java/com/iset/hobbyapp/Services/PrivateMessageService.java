package com.iset.hobbyapp.Services;

import com.iset.hobbyapp.entity.PrivateMessage;
import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.repository.PrivateMessageRepository;
import com.iset.hobbyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrivateMessageService {
    @Autowired
    private PrivateMessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public PrivateMessage sendMessage(User sender, Long recipientId, String content) {
        User recipient = userRepository.findById(recipientId).orElse(null);
        if (recipient == null) {
            throw new RuntimeException("Recipient not found");
        }
        PrivateMessage message = new PrivateMessage(sender, recipient, content);
        return messageRepository.save(message);
    }
    
    public List<PrivateMessage> getConversation(User user1, Long user2Id) {
        User user2 = userRepository.findById(user2Id).orElse(null);
        if (user2 == null) {
            throw new RuntimeException("User not found");
        }
        return messageRepository.findConversation(user1, user2);
    }
    
    public List<PrivateMessage> getInboxMessages(User user) {
        return messageRepository.findByRecipientOrderByCreatedAtDesc(user);
    }
    
    public void markAsRead(Long messageId) {
        PrivateMessage message = messageRepository.findById(messageId).orElse(null);
        if (message != null) {
            message.setRead(true);
            messageRepository.save(message);
        }
    }
}
