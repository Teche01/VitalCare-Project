package com.vitalcare.backend.dto;

public class PatientResponse {

    private Integer patientId;
    private String fullName;
    private String email;
    private String dateOfBirth;
    private String gender;
    private String phone;
    private String address;

    public PatientResponse(
            Integer patientId,
            String fullName,
            String email,
            String dateOfBirth,
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

    public String getDateOfBirth() {
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