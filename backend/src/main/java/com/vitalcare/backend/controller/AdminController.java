package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.AdminDashboardStatsResponse;
import com.vitalcare.backend.dto.AppointmentResponse;
import com.vitalcare.backend.dto.PatientResponse;

import com.vitalcare.backend.service.AdminService;
import com.vitalcare.backend.service.AppointmentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final AppointmentService appointmentService;

    public AdminController(
            AdminService adminService,
            AppointmentService appointmentService
    ) {
        this.adminService = adminService;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/dashboard/stats")
    public AdminDashboardStatsResponse getDashboardStats() {

        return adminService
                .getDashboardStats();
    }

    @GetMapping("/patients")
    public List<PatientResponse> getAllPatients() {

        return adminService
                .getAllPatients();
    }

    @GetMapping("/appointments")
    public List<AppointmentResponse> getAllAppointments() {

        return appointmentService
                .getAllAppointments();
    }
}