package com.vitalcare.backend.controller;

import com.vitalcare.backend.dto.PatientRegistrationRequest;
import com.vitalcare.backend.dto.PatientRegistrationResponse;
import com.vitalcare.backend.service.PatientRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vitalcare.backend.dto.LoginRequest;
import com.vitalcare.backend.dto.LoginResponse;
import com.vitalcare.backend.service.AdminSetupService;
import com.vitalcare.backend.service.LoginService;
import com.vitalcare.backend.dto.AdminSetupRequest;
import com.vitalcare.backend.dto.AdminSetupResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

        private final PatientRegistrationService patientRegistrationService;

        private final LoginService loginService;

        private final AdminSetupService adminSetupService;

        public AuthController(
                        PatientRegistrationService patientRegistrationService,
                        LoginService loginService,
                        AdminSetupService adminSetupService) {
                this.patientRegistrationService = patientRegistrationService;

                this.loginService = loginService;

                this.adminSetupService = adminSetupService;
        }

        @PostMapping("/register/patient")
        public ResponseEntity<PatientRegistrationResponse> registerPatient(
                        @Valid @RequestBody PatientRegistrationRequest request) {

                PatientRegistrationResponse response = patientRegistrationService
                                .registerPatient(request);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(response);
        }

        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(
                        @Valid @RequestBody LoginRequest request) {

                LoginResponse response = loginService.login(request);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/setup-admin")
        public AdminSetupResponse setupInitialAdmin(
                        @Valid @RequestBody AdminSetupRequest request) {

                return adminSetupService
                                .createInitialAdmin(
                                                request);
        }
}