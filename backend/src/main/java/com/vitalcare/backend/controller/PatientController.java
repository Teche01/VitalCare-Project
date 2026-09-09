package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.PatientProfileRequest;
import com.vitalcare.backend.dto.PatientProfileResponse;

import com.vitalcare.backend.service.PatientProfileService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientProfileService
            patientProfileService;

    public PatientController(
            PatientProfileService patientProfileService
    ) {
        this.patientProfileService =
                patientProfileService;
    }

    // =========================
    // GET PROFILE
    // =========================

    @GetMapping("/{patientId}")
    public PatientProfileResponse getProfile(
            @PathVariable Integer patientId,
            Authentication authentication
    ) {

        return patientProfileService
                .getProfile(
                        patientId,
                        authentication.getName()
                );
    }

    // =========================
    // UPDATE PROFILE
    // =========================

    @PutMapping("/{patientId}")
    public PatientProfileResponse updateProfile(
            @PathVariable Integer patientId,

            @Valid
            @RequestBody
            PatientProfileRequest request,

            Authentication authentication
    ) {

        return patientProfileService
                .updateProfile(
                        patientId,
                        authentication.getName(),
                        request
                );
    }
}