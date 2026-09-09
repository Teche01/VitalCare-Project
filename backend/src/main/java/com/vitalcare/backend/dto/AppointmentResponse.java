package com.vitalcare.backend.dto;

public class AppointmentResponse {

    private Integer appointmentId;
    private Integer patientId;
    private String patientName;

    private Integer doctorId;
    private String doctorName;

    private String departmentName;

    private String appointmentDate;
    private String appointmentTime;

    private String reasonCategory;
    private String reasonDetails;

    private String appointmentStatus;
    private String arrivalStatus;

    public AppointmentResponse(
            Integer appointmentId,
            Integer patientId,
            String patientName,
            Integer doctorId,
            String doctorName,
            String departmentName,
            String appointmentDate,
            String appointmentTime,
            String reasonCategory,
            String reasonDetails,
            String appointmentStatus,
            String arrivalStatus
    ) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.departmentName = departmentName;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.reasonCategory = reasonCategory;
        this.reasonDetails = reasonDetails;
        this.appointmentStatus = appointmentStatus;
        this.arrivalStatus = arrivalStatus;
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
}