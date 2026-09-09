package com.vitalcare.backend.dto;

public class PatientRegistrationResponse {

    private Integer patientId;
    private String fullName;
    private String email;
    private String role;
    private String message;

    public PatientRegistrationResponse(
            Integer patientId,
            String fullName,
            String email,
            String role,
            String message
    ) {
        this.patientId = patientId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public Integer getPatientId() {
        return patientId;
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

    public String getMessage() {
        return message;
    }
}