package com.iset.hobbyapp.controller;

import com.iset.hobbyapp.entity.PrivateMessage;
import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.Services.PrivateMessageService;
import com.iset.hobbyapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
public class PrivateMessageController {
    
    @Autowired
    private PrivateMessageService messageService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/send")
    public ResponseEntity<PrivateMessage> sendMessage(@RequestBody Map<String, Object> request) {
        try {
            Long senderId = Long.valueOf(request.get("senderId").toString());
            User sender = userService.getUserById(senderId);
            Long recipientId = Long.valueOf(request.get("recipientId").toString());
            String content = request.get("content").toString();
            
            PrivateMessage message = messageService.sendMessage(sender, recipientId, content);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/conversation/{userId}/{otherId}")
    public ResponseEntity<List<PrivateMessage>> getConversation(@PathVariable Long userId, @PathVariable Long otherId) {
        try {
            User user = userService.getUserById(userId);
            List<PrivateMessage> messages = messageService.getConversation(user, otherId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/inbox/{userId}")
    public ResponseEntity<List<PrivateMessage>> getInbox(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            List<PrivateMessage> messages = messageService.getInboxMessages(user);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @PutMapping("/{messageId}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long messageId) {
        try {
            messageService.markAsRead(messageId);
            return ResponseEntity.ok("Message marked as read");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
