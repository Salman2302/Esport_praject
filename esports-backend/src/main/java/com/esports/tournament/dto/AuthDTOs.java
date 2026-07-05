package com.esports.tournament.dto;

import com.esports.tournament.entity.User;
import lombok.Data;

// ===== LOGIN REQUEST =====
@Data
class LoginRequest {
    private String email;
    private String password;
}

// ===== REGISTER REQUEST =====
@Data
class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private User.Role role = User.Role.PLAYER;
    private String gameTag;
    private String favoriteGame;
}

// ===== AUTH RESPONSE =====
@Data
class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private Long userId;

    public AuthResponse(String token, String username, String email, String role, Long userId) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.userId = userId;
    }
}

// Wrapper class to export all DTOs
public class AuthDTOs {
    public static class LoginReq extends LoginRequest {}
    public static class RegisterReq extends RegisterRequest {}
    public static class AuthRes extends AuthResponse {
        public AuthRes(String token, String username, String email, String role, Long userId) {
            super(token, username, email, role, userId);
        }
    }
}
