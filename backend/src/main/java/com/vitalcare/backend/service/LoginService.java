package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.LoginRequest;
import com.vitalcare.backend.dto.LoginResponse;

import com.vitalcare.backend.entity.Doctor;
import com.vitalcare.backend.entity.Patient;
import com.vitalcare.backend.entity.Receptionist;
import com.vitalcare.backend.entity.User;

import com.vitalcare.backend.repository.DoctorRepository;
import com.vitalcare.backend.repository.PatientRepository;
import com.vitalcare.backend.repository.ReceptionistRepository;
import com.vitalcare.backend.repository.UserRepository;
import com.vitalcare.backend.exception.InvalidCredentialsException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

        private final UserRepository userRepository;
        private final PatientRepository patientRepository;
        private final DoctorRepository doctorRepository;
        private final ReceptionistRepository receptionistRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;

        public LoginService(
                        UserRepository userRepository,
                        PatientRepository patientRepository,
                        DoctorRepository doctorRepository,
                        ReceptionistRepository receptionistRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {
                this.userRepository = userRepository;
                this.patientRepository = patientRepository;
                this.doctorRepository = doctorRepository;
                this.receptionistRepository = receptionistRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
        }

        public LoginResponse login(
                        LoginRequest request) {

                // =========================
                // FIND USER BY EMAIL
                // =========================

                User user = userRepository
                                .findByEmail(request.getEmail())
                                .orElseThrow(() -> new InvalidCredentialsException(
                                                "Invalid email or password"));

                // =========================
                // CHECK USER STATUS
                // =========================

                if (!user.getActive()) {

                        throw new IllegalArgumentException(
                                        "User account is inactive");
                }

                // =========================
                // CHECK PASSWORD
                // =========================

                if (!passwordEncoder.matches(
                                request.getPassword(),
                                user.getPassword())) {

                        throw new InvalidCredentialsException(
                                        "Invalid email or password");
                }

                // =========================
                // FIND ROLE PROFILE
                // =========================

                Integer profileId = null;

                String fullName = "";

                switch (user.getRole()) {

                        case PATIENT -> {

                                Patient patient = patientRepository
                                                .findByUserUserId(
                                                                user.getUserId())
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Patient profile not found"));

                                profileId = patient.getPatientId();

                                fullName = patient.getFullName();
                        }

                        case DOCTOR -> {

                                Doctor doctor = doctorRepository
                                                .findByUserUserId(
                                                                user.getUserId())
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Doctor profile not found"));

                                profileId = doctor.getDoctorId();

                                fullName = doctor.getFullName();
                        }

                        case RECEPTIONIST -> {

                                Receptionist receptionist = receptionistRepository
                                                .findByUserUserId(
                                                                user.getUserId())
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Receptionist profile not found"));

                                profileId = receptionist.getReceptionistId();

                                fullName = receptionist.getFullName();
                        }

                        case ADMIN -> {

                                profileId = null;

                                fullName = "Administrator";
                        }
                }

                // =========================
                // GENERATE JWT TOKEN
                // =========================

                String token = jwtService.generateToken(
                                user);

                // =========================
                // RETURN LOGIN RESPONSE
                // =========================

                return new LoginResponse(
                                user.getUserId(),
                                profileId,
                                fullName,
                                user.getEmail(),
                                user.getRole().name(),
                                token,
                                "Login successful");
        }
}