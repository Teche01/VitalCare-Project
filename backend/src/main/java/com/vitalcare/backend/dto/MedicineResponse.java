package com.vitalcare.backend.dto;

public class MedicineResponse {

    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;

    public MedicineResponse(
            String medicineName,
            String dosage,
            String frequency,
            String duration,
            String instructions
    ) {
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.instructions = instructions;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public String getDuration() {
        return duration;
    }

    public String getInstructions() {
        return instructions;
    }
}