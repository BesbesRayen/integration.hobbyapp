package com.iset.hobbyapp.controller;

import com.iset.hobbyapp.dto.LoginRequest;
import com.iset.hobbyapp.dto.RegisterRequest;
import com.iset.hobbyapp.entity.User;
import com.iset.hobbyapp.Services.AuthService;
import com.iset.hobbyapp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String token = authService.register(request);
            User user = userService.getUserByEmail(request.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            if (user != null) {
                response.put("user", user);
            }
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request == null || request.getEmail() == null || request.getPassword() == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email and password are required");
                return ResponseEntity.status(400).body(error);
            }
            
            String token = authService.login(request);
            User user = userService.getUserByEmail(request.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            if (user != null) {
                response.put("user", user);
            }
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }
}
