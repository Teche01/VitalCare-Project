package com.vitalcare.backend.service;

import com.vitalcare.backend.dto.PatientProfileRequest;
import com.vitalcare.backend.dto.PatientProfileResponse;

import com.vitalcare.backend.entity.Patient;
import com.vitalcare.backend.entity.User;

import com.vitalcare.backend.repository.PatientRepository;
import com.vitalcare.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientProfileService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientProfileService(
            PatientRepository patientRepository,
            UserRepository userRepository
    ) {
        this.patientRepository =
                patientRepository;

        this.userRepository =
                userRepository;
    }

    // =========================
    // GET PROFILE
    // =========================

    public PatientProfileResponse getProfile(
            Integer patientId,
            String authenticatedEmail
    ) {

        Patient patient =
                getAuthenticatedPatient(
                        patientId,
                        authenticatedEmail
                );

        return convertToResponse(
                patient
        );
    }

    // =========================
    // UPDATE PROFILE
    // =========================

    @Transactional
    public PatientProfileResponse updateProfile(
            Integer patientId,
            String authenticatedEmail,
            PatientProfileRequest request
    ) {

        Patient patient =
                getAuthenticatedPatient(
                        patientId,
                        authenticatedEmail
                );

        patient.setFullName(
                request.getFullName()
        );

        patient.setDateOfBirth(
                request.getDateOfBirth()
        );

        patient.setGender(
                request.getGender()
        );

        patient.setPhone(
                request.getPhone()
        );

        patient.setAddress(
                request.getAddress()
        );

        Patient savedPatient =
                patientRepository.save(
                        patient
                );

        return convertToResponse(
                savedPatient
        );
    }

    // =========================
    // SECURITY CHECK
    // =========================

    private Patient getAuthenticatedPatient(
            Integer requestedPatientId,
            String authenticatedEmail
    ) {

        User user =
                userRepository
                        .findByEmail(
                                authenticatedEmail
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Logged-in user not found"
                                )
                        );

        Patient patient =
                patientRepository
                        .findByUserUserId(
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Patient profile not found"
                                )
                        );

        if (!patient.getPatientId()
                .equals(
                        requestedPatientId
                )) {

            throw new IllegalArgumentException(
                    "You cannot access another patient's profile"
            );
        }

        return patient;
    }

    // =========================
    // RESPONSE
    // =========================

    private PatientProfileResponse
            convertToResponse(
                    Patient patient
            ) {

        return new PatientProfileResponse(
                patient.getPatientId(),
                patient.getFullName(),
                patient.getUser()
                        .getEmail(),
                patient.getDateOfBirth(),
                patient.getGender(),
                patient.getPhone(),
                patient.getAddress()
        );
    }
}