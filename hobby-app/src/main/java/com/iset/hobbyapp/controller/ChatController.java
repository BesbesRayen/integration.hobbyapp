package com.iset.hobbyapp.controller;

import com.iset.hobbyapp.Services.ChatService;
import com.iset.hobbyapp.entity.Chat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;


    @GetMapping("/groups/{groupId}")
    public List<Chat> getChatsByGroup(@PathVariable Long groupId) {
        return chatService.getByGroup(groupId);
    }

    @PostMapping
    public Chat sendMessage(@RequestBody Chat chat) {
        chat.setTimestamp(LocalDateTime.now());
        return chatService.save(chat);
    }
}
