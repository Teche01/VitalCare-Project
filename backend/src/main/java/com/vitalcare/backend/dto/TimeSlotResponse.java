package com.vitalcare.backend.dto;

public class TimeSlotResponse {

    private String time;
    private Boolean available;

    public TimeSlotResponse(
            String time,
            Boolean available
    ) {
        this.time = time;
        this.available = available;
    }

    public String getTime() {
        return time;
    }

    public Boolean getAvailable() {
        return available;
    }
}