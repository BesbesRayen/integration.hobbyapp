package com.iset.hobbyapp.Services;

import com.iset.hobbyapp.entity.Chat;
import com.iset.hobbyapp.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    public List<Chat> getByGroup(Long groupId) {
        List<Chat> chats = chatRepository.findByGroupIdOrderByTimestampAsc(groupId);
        return chats.stream().map(chat -> {

            if (chat.getGroup() != null) {
                chat.setGroupId(chat.getGroup().getId());
            }
            if (chat.getUser() != null) {
                chat.setUserId(chat.getUser().getId());
                chat.setUserName(chat.getUser().getName());
            }
            return chat;
        }).collect(Collectors.toList());
    }

    public Chat save(Chat chat) {
        Chat saved = chatRepository.save(chat);

        if (saved.getGroup() != null) {
            saved.setGroupId(saved.getGroup().getId());
        }
        if (saved.getUser() != null) {
            saved.setUserId(saved.getUser().getId());
            saved.setUserName(saved.getUser().getName());
        }
        return saved;
    }

}
