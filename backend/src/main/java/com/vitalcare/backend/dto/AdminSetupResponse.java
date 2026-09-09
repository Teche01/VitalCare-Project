package com.vitalcare.backend.dto;

public class AdminSetupResponse {

    private Integer userId;
    private String email;
    private String role;
    private String message;

    public AdminSetupResponse(
            Integer userId,
            String email,
            String role,
            String message
    ) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}