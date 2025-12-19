package com.iset.hobbyapp.Services;

import com.iset.hobbyapp.entity.Event;
import com.iset.hobbyapp.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEventsByGroup(Long groupId) {
        return eventRepository.findByGroupId(groupId);
    }

    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }
}
