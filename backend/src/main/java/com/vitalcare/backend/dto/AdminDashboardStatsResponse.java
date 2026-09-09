package com.vitalcare.backend.dto;

public class AdminDashboardStatsResponse {

    private long totalPatients;
    private long totalDoctors;
    private long totalReceptionists;
    private long totalDepartments;

    private long todayAppointments;

    private long bookedAppointments;
    private long completedAppointments;
    private long cancelledAppointments;

    public AdminDashboardStatsResponse(
            long totalPatients,
            long totalDoctors,
            long totalReceptionists,
            long totalDepartments,
            long todayAppointments,
            long bookedAppointments,
            long completedAppointments,
            long cancelledAppointments
    ) {
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.totalReceptionists = totalReceptionists;
        this.totalDepartments = totalDepartments;
        this.todayAppointments = todayAppointments;
        this.bookedAppointments = bookedAppointments;
        this.completedAppointments = completedAppointments;
        this.cancelledAppointments = cancelledAppointments;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public long getTotalReceptionists() {
        return totalReceptionists;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public long getTodayAppointments() {
        return todayAppointments;
    }

    public long getBookedAppointments() {
        return bookedAppointments;
    }

    public long getCompletedAppointments() {
        return completedAppointments;
    }

    public long getCancelledAppointments() {
        return cancelledAppointments;
    }
}