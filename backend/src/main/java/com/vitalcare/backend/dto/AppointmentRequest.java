package com.vitalcare.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AppointmentRequest {

    @NotNull(message = "Patient ID is required")
    private Integer patientId;

    @NotNull(message = "Doctor ID is required")
    private Integer doctorId;

    @NotBlank(message = "Appointment date is required")
    private String appointmentDate;

    @NotBlank(message = "Appointment time is required")
    private String appointmentTime;

    @NotBlank(message = "Reason category is required")
    private String reasonCategory;

    private String reasonDetails;

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(
            String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(
            String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getReasonCategory() {
        return reasonCategory;
    }

    public void setReasonCategory(
            String reasonCategory) {
        this.reasonCategory = reasonCategory;
    }

    public String getReasonDetails() {
        return reasonDetails;
    }

    public void setReasonDetails(
            String reasonDetails) {
        this.reasonDetails = reasonDetails;
    }
}