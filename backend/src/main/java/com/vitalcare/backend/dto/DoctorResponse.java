package com.vitalcare.backend.dto;

public class DoctorResponse {

    private Integer doctorId;
    private String fullName;
    private String email;
    private Integer departmentId;
    private String departmentName;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String phone;
    private Integer consultationDurationMinutes;
    private Boolean active;

    public DoctorResponse(
            Integer doctorId,
            String fullName,
            String email,
            Integer departmentId,
            String departmentName,
            String specialization,
            String qualification,
            Integer experienceYears,
            String phone,
            Integer consultationDurationMinutes,
            Boolean active) {

        this.doctorId = doctorId;
        this.fullName = fullName;
        this.email = email;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experienceYears = experienceYears;
        this.phone = phone;
        this.consultationDurationMinutes =
                consultationDurationMinutes;
        this.active = active;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getQualification() {
        return qualification;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public String getPhone() {
        return phone;
    }

    public Integer getConsultationDurationMinutes() {
        return consultationDurationMinutes;
    }

    public Boolean getActive() {
        return active;
    }
}