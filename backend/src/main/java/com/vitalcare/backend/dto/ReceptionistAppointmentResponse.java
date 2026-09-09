package com.vitalcare.backend.dto;

public class ReceptionistAppointmentResponse {

    private Integer appointmentId;

    private Integer patientId;
    private String patientName;
    private String patientPhone;
    private String patientGender;
    private String patientDateOfBirth;

    private Integer doctorId;
    private String doctorName;

    private String departmentName;

    private String appointmentDate;
    private String appointmentTime;

    private String reasonCategory;
    private String reasonDetails;

    private String appointmentStatus;
    private String arrivalStatus;
    private String arrivedAt;

    public ReceptionistAppointmentResponse(
            Integer appointmentId,
            Integer patientId,
            String patientName,
            String patientPhone,
            String patientGender,
            String patientDateOfBirth,
            Integer doctorId,
            String doctorName,
            String departmentName,
            String appointmentDate,
            String appointmentTime,
            String reasonCategory,
            String reasonDetails,
            String appointmentStatus,
            String arrivalStatus,
            String arrivedAt
    ) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientPhone = patientPhone;
        this.patientGender = patientGender;
        this.patientDateOfBirth = patientDateOfBirth;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.departmentName = departmentName;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.reasonCategory = reasonCategory;
        this.reasonDetails = reasonDetails;
        this.appointmentStatus = appointmentStatus;
        this.arrivalStatus = arrivalStatus;
        this.arrivedAt = arrivedAt;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public String getPatientGender() {
        return patientGender;
    }

    public String getPatientDateOfBirth() {
        return patientDateOfBirth;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public String getReasonCategory() {
        return reasonCategory;
    }

    public String getReasonDetails() {
        return reasonDetails;
    }

    public String getAppointmentStatus() {
        return appointmentStatus;
    }

    public String getArrivalStatus() {
        return arrivalStatus;
    }

    public String getArrivedAt() {
        return arrivedAt;
    }
}