package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.ReceptionistAppointmentResponse;
import com.vitalcare.backend.service.ReceptionistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "http://localhost:5173")
public class ReceptionistController {

        private final ReceptionistService receptionistService;

        public ReceptionistController(
                        ReceptionistService receptionistService) {
                this.receptionistService = receptionistService;
        }

        @GetMapping("/appointments/today")
        public List<ReceptionistAppointmentResponse> getTodaysAppointments() {

                return receptionistService
                                .getTodaysAppointments();
        }

        @GetMapping("/appointments/{appointmentId}")
        public ReceptionistAppointmentResponse getAppointment(
                        @PathVariable Integer appointmentId) {

                return receptionistService
                                .getAppointmentById(
                                                appointmentId);
        }

        @GetMapping("/appointments/search/name")
        public List<ReceptionistAppointmentResponse> searchByPatientName(
                        @RequestParam String patientName) {

                return receptionistService
                                .searchByPatientName(
                                                patientName);
        }

        @GetMapping("/appointments/search/phone")
        public List<ReceptionistAppointmentResponse> searchByPhone(
                        @RequestParam String phone) {

                return receptionistService
                                .searchByPhone(
                                                phone);
        }

        @PatchMapping("/appointments/{appointmentId}/arrived")
        public ReceptionistAppointmentResponse markPatientArrived(
                        @PathVariable Integer appointmentId) {

                return receptionistService
                                .markPatientArrived(
                                                appointmentId);
        }

        @PatchMapping("/appointments/{appointmentId}/no-show")
        public ReceptionistAppointmentResponse markNoShow(
                        @PathVariable Integer appointmentId) {

                return receptionistService
                                .markNoShow(
                                                appointmentId);
        }
}