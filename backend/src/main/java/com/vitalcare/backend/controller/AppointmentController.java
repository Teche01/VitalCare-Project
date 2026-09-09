package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.AppointmentRequest;
import com.vitalcare.backend.dto.AppointmentResponse;
import com.vitalcare.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

        private final AppointmentService appointmentService;

        public AppointmentController(
                        AppointmentService appointmentService) {
                this.appointmentService = appointmentService;
        }

        @PostMapping
        public ResponseEntity<AppointmentResponse> bookAppointment(
                        @Valid @RequestBody AppointmentRequest request) {

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(
                                                appointmentService
                                                                .bookAppointment(
                                                                                request));
        }

        @GetMapping("/patient/{patientId}")
        public List<AppointmentResponse> getPatientAppointments(
                        @PathVariable Integer patientId) {

                return appointmentService
                                .getPatientAppointments(
                                                patientId);
        }

        @PatchMapping("/{appointmentId}/cancel")
        public AppointmentResponse cancelAppointment(
                        @PathVariable Integer appointmentId,
                        @RequestParam Integer patientId) {

                return appointmentService
                                .cancelAppointment(
                                                appointmentId,
                                                patientId);
        }
}