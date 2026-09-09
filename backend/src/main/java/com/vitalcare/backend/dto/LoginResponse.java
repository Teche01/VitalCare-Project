package com.vitalcare.backend.dto;

public class LoginResponse {

    private Integer userId;
    private Integer profileId;

    private String fullName;
    private String email;
    private String role;

    private String token;

    private String message;

    public LoginResponse(
            Integer userId,
            Integer profileId,
            String fullName,
            String email,
            String role,
            String token,
            String message
    ) {
        this.userId =
                userId;

        this.profileId =
                profileId;

        this.fullName =
                fullName;

        this.email =
                email;

        this.role =
                role;

        this.token =
                token;

        this.message =
                message;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }
}