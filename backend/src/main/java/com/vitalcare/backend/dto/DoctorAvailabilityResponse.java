package com.vitalcare.backend.dto;

public class DoctorAvailabilityResponse {

    private Integer availabilityId;
    private Integer doctorId;
    private String doctorName;
    private String dayOfWeek;
    private String startTime;
    private String endTime;

    public DoctorAvailabilityResponse(
            Integer availabilityId,
            Integer doctorId,
            String doctorName,
            String dayOfWeek,
            String startTime,
            String endTime
    ) {
        this.availabilityId = availabilityId;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Integer getAvailabilityId() {
        return availabilityId;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }
}