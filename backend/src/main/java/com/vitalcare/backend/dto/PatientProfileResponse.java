package com.vitalcare.backend.dto;

import java.time.LocalDate;

public class PatientProfileResponse {

    private Integer patientId;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private String address;

    public PatientProfileResponse(
            Integer patientId,
            String fullName,
            String email,
            LocalDate dateOfBirth,
            String gender,
            String phone,
            String address
    ) {
        this.patientId = patientId;
        this.fullName = fullName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phone = phone;
        this.address = address;
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }
}