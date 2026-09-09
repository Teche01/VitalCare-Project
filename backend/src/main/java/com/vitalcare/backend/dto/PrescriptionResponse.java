package com.vitalcare.backend.dto;

import java.util.List;

public class PrescriptionResponse {

    private Integer prescriptionId;
    private Integer appointmentId;

    private String patientName;
    private String doctorName;
    private String specialization;
    private String departmentName;

    private String appointmentDate;

    private String diagnosis;
    private String consultationNotes;
    private String generalAdvice;
    private String followUpDate;

    private List<MedicineResponse> medicines;

    public PrescriptionResponse(
            Integer prescriptionId,
            Integer appointmentId,
            String patientName,
            String doctorName,
            String specialization,
            String departmentName,
            String appointmentDate,
            String diagnosis,
            String consultationNotes,
            String generalAdvice,
            String followUpDate,
            List<MedicineResponse> medicines
    ) {
        this.prescriptionId = prescriptionId;
        this.appointmentId = appointmentId;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.specialization = specialization;
        this.departmentName = departmentName;
        this.appointmentDate = appointmentDate;
        this.diagnosis = diagnosis;
        this.consultationNotes = consultationNotes;
        this.generalAdvice = generalAdvice;
        this.followUpDate = followUpDate;
        this.medicines = medicines;
    }

    public Integer getPrescriptionId() {
        return prescriptionId;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public String getConsultationNotes() {
        return consultationNotes;
    }

    public String getGeneralAdvice() {
        return generalAdvice;
    }

    public String getFollowUpDate() {
        return followUpDate;
    }

    public List<MedicineResponse> getMedicines() {
        return medicines;
    }
}