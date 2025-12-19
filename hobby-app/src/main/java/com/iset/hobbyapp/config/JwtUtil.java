package com.iset.hobbyapp.config;

import org.springframework.stereotype.Component;


@Deprecated
@Component
public class JwtUtil {

    public String extractUsername(String token) {
        throw new UnsupportedOperationException("JWT is deprecated");
    }

    public String generateToken(String username) {
        throw new UnsupportedOperationException("JWT is deprecated");
    }

    public boolean validateToken(String token, String username) {
        throw new UnsupportedOperationException("JWT is deprecated");
    }
}
