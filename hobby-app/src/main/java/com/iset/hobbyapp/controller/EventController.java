package com.iset.hobbyapp.controller;

import com.iset.hobbyapp.entity.Event;
import com.iset.hobbyapp.Services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")

public class EventController {

    @Autowired
    private EventService eventService;

    // ✅ Get all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        try {
            List<Event> events = eventService.getAllEvents();
            System.out.println("Fetched " + events.size() + " events");
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("Error fetching events: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Get events by group
    @GetMapping("/groups/{groupId}")
    public ResponseEntity<List<Event>> getEventsByGroup(@PathVariable Long groupId) {
        try {
            List<Event> events = eventService.getEventsByGroup(groupId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("Error fetching events by group: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Add new event
    @PostMapping
    public ResponseEntity<Event> addEvent(@RequestBody Event event) {
        try {
            Event savedEvent = eventService.addEvent(event);
            return ResponseEntity.status(201).body(savedEvent);
        } catch (Exception e) {
            System.err.println("Error adding event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
