package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.*;
import com.vitalcare.backend.service.DoctorConsultationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorConsultationController {

    private final DoctorConsultationService
            consultationService;

    public DoctorConsultationController(
            DoctorConsultationService consultationService
    ) {
        this.consultationService =
                consultationService;
    }

    @GetMapping("/doctor/{doctorId}/arrived")
    public List<ReceptionistAppointmentResponse>
            getArrivedPatients(
                    @PathVariable Integer doctorId
            ) {

        return consultationService
                .getArrivedPatientsForToday(
                        doctorId
                );
    }

    @PostMapping("/prescriptions")
    public ResponseEntity<PrescriptionResponse>
            createPrescription(
                    @Valid
                    @RequestBody
                    PrescriptionRequest request
            ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        consultationService
                                .createPrescription(
                                        request
                                )
                );
    }

    @GetMapping(
            "/prescriptions/appointment/{appointmentId}"
    )
    public PrescriptionResponse
            getPrescriptionByAppointment(
                    @PathVariable
                    Integer appointmentId
            ) {

        return consultationService
                .getPrescriptionByAppointment(
                        appointmentId
                );
    }

    @GetMapping(
            "/prescriptions/patient/{patientId}"
    )
    public List<PrescriptionResponse>
            getPatientPrescriptions(
                    @PathVariable
                    Integer patientId
            ) {

        return consultationService
                .getPatientPrescriptions(
                        patientId
                );
    }
}