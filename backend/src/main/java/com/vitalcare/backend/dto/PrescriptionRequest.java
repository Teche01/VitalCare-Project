package com.vitalcare.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class PrescriptionRequest {

    @NotNull(message = "Appointment ID is required")
    private Integer appointmentId;

    private String diagnosis;

    private String consultationNotes;

    private String generalAdvice;

    private String followUpDate;

    @Valid
    private List<MedicineRequest> medicines;

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getConsultationNotes() {
        return consultationNotes;
    }

    public void setConsultationNotes(
            String consultationNotes
    ) {
        this.consultationNotes =
                consultationNotes;
    }

    public String getGeneralAdvice() {
        return generalAdvice;
    }

    public void setGeneralAdvice(
            String generalAdvice
    ) {
        this.generalAdvice =
                generalAdvice;
    }

    public String getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(
            String followUpDate
    ) {
        this.followUpDate =
                followUpDate;
    }

    public List<MedicineRequest>
            getMedicines() {
        return medicines;
    }

    public void setMedicines(
            List<MedicineRequest> medicines
    ) {
        this.medicines = medicines;
    }
}